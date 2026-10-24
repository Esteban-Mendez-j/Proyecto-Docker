package com.miproyecto.proyecto.chats.chatBot.service.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.miproyecto.proyecto.chats.chatBot.McpUserContext;
import com.miproyecto.proyecto.chats.chatBot.dto.VacanteInfo;
import com.miproyecto.proyecto.chats.chatBot.mapper.VacanteMcpMapper;
import com.miproyecto.proyecto.chats.chatBot.repository.VacanteMcpEstadoRepository;
import com.miproyecto.proyecto.util.exception.AccesoDenegadoException;
import com.miproyecto.proyecto.vacante.dto.VacanteDTO;
import com.miproyecto.proyecto.vacante.model.Vacante;
import com.miproyecto.proyecto.vacante.repository.VacanteRepository;
import com.miproyecto.proyecto.vacante.service.VacanteService;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;


/**
 * Logica + AUTORIZACION de las herramientas MCP sobre vacantes. Las reglas de permisos viven aqui (servidor),
 * no en el prompt. Crear/actualizar pasan por tu VacanteService, asi se respetan tus reglas existentes.
 * Lecturas: siempre via VacanteService.get -> VacanteDTO (cargo como texto, aptitudes, requisitos...).
 */
@Service
@Transactional
public class VacanteMcpService {

    private static final int LIMITE_DEFECTO = 10;
    private static final int LIMITE_MAXIMO = 20;

    private final VacanteRepository vacanteRepository;
    private final VacanteMcpEstadoRepository estadoRepository;
    private final VacanteService vacanteService;
    private final VacanteMcpMapper mapper;
    private final String cargoProperty;
    private final boolean permitirEliminar;

    public VacanteMcpService(VacanteRepository vacanteRepository,
            VacanteMcpEstadoRepository estadoRepository,
            VacanteService vacanteService,
            VacanteMcpMapper mapper,
            @Value("${app.mcp.vacantes.cargo-property:nombre}") String cargoProperty,
            @Value("${app.mcp.vacantes.allow-delete:false}") boolean permitirEliminar) {
        this.vacanteRepository = vacanteRepository;
        this.estadoRepository = estadoRepository;
        this.vacanteService = vacanteService;
        this.mapper = mapper;
        this.cargoProperty = cargoProperty;
        this.permitirEliminar = permitirEliminar;
    }

    // ---------------------------------------------------------------- LEER

    /** Publico (cualquier rol, incluso invitado). Solo vacantes activas por empresa y por administrador. */
    @Transactional(readOnly = true)
    public List<VacanteInfo> buscar(McpUserContext ctx, String titulo, String cargo, String ciudad,
            String departamento, String modalidad, String tipo, Integer limite) {

        Specification<Vacante> spec = (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            p.add(cb.isTrue(root.<Boolean>get("isActive")));
            p.add(cb.isTrue(root.<Boolean>get("activaPorEmpresa")));
            like(p, cb, root.<String>get("titulo"), titulo);
            like(p, cb, root.<String>get("ciudad"), ciudad);
            like(p, cb, root.<String>get("departamento"), departamento);
            like(p, cb, root.<String>get("modalidad"), modalidad);
            String t = limpio(tipo);
            if (t != null) {
                p.add(cb.equal(cb.lower(root.<String>get("tipo")), t.toLowerCase()));
            }
            String c = limpio(cargo);
            if (c != null) {
                // Vacante.cargo es una entidad (@ManyToOne Cargo): se filtra por su campo de nombre.
                p.add(cb.like(cb.lower(root.join("cargo").<String>get(cargoProperty)), patron(c)));
            }
            return cb.and(p.toArray(new Predicate[0]));
        };

        Pageable page = PageRequest.of(0, limite(limite), Sort.by(Sort.Direction.DESC, "fechaPublicacion"));
        Long idLogin = idLogin(ctx);
        return vacanteRepository.findAll(spec, page).getContent().stream()
                .map(v -> mapper.toInfo(vacanteService.get(idLogin, v.getNvacantes())))
                .toList();
    }

    @Transactional(readOnly = true)
    public VacanteInfo obtener(McpUserContext ctx, Long id) {
        VacanteDTO dto = cargarDto(ctx, id);
        if (!mapper.esPublica(dto) && !puedeGestionar(ctx, dto)) {
            throw noExiste(id); // no revelamos que existe
        }
        return mapper.toInfo(dto);
    }

    @Transactional(readOnly = true)
    public List<VacanteInfo> listarDeEmpresa(McpUserContext ctx, Long idEmpresa, Integer limite) {
        long objetivo;
        if (ctx.esEmpresa()) {
            objetivo = ctx.userId(); // una empresa solo ve las suyas
        } else if (ctx.esAdmin()) {
            if (idEmpresa == null) {
                throw new IllegalArgumentException("Indica el idEmpresa a consultar.");
            }
            objetivo = idEmpresa;
        } else {
            throw new AccesoDenegadoException("solo empresas o administradores pueden listar vacantes de una empresa.");
        }
        Specification<Vacante> spec = (root, query, cb) ->
                cb.equal(root.get("idUsuario").get("idUsuario"), objetivo);
        Pageable page = PageRequest.of(0, limite(limite), Sort.by(Sort.Direction.DESC, "fechaPublicacion"));
        Long idLogin = idLogin(ctx);
        return vacanteRepository.findAll(spec, page).getContent().stream()
                .map(v -> mapper.toInfo(vacanteService.get(idLogin, v.getNvacantes())))
                .toList();
    }

    // ------------------------------------------------------------ ESCRIBIR

    public VacanteInfo crear(McpUserContext ctx, Map<String, String> campos) {
        if (!ctx.esEmpresa()) {
            throw new AccesoDenegadoException("solo las empresas pueden crear vacantes.");
        }
        // Obligatorios en tu entidad (nullable = false)
        for (String obligatorio : List.of("titulo", "cargo", "modalidad", "ciudad", "departamento", "tipo")) {
            if (limpio(campos.get(obligatorio)) == null) {
                throw new IllegalArgumentException("Falta el campo obligatorio '" + obligatorio + "'. Pidelo al usuario.");
            }
        }
        VacanteDTO dto = new VacanteDTO();
        mapper.aplicar(dto, campos);
        mapper.fijarIdUsuario(dto, ctx.userId()); // duenio = usuario autenticado, nunca lo decide el LLM
        Long id = vacanteService.create(dto);
        return mapper.toInfo(cargarDto(ctx, id));
    }

    public VacanteInfo actualizar(McpUserContext ctx, Long id, Map<String, String> campos) {
        VacanteDTO dto = cargarDto(ctx, id);
        if (!puedeGestionar(ctx, dto)) {
            throw new AccesoDenegadoException("solo la empresa duenia de la vacante (o un administrador) puede modificarla.");
        }
        if (campos.values().stream().allMatch(c -> limpio(c) == null)) {
            throw new IllegalArgumentException("Indica al menos un campo para modificar.");
        }
        // Parte del DTO completo actual: se conservan aptitudes, requisitos y demas campos no enviados.
        mapper.aplicar(dto, campos);
        vacanteService.update(id, dto);
        return mapper.toInfo(cargarDto(ctx, id));
    }

    /**
     * Empresa: activa/desactiva SU vacante (activaPorEmpresa). Admin: bloquea/desbloquea cualquiera (isActive).
     * Para ser publica deben estar ambas en true.
     */
    public VacanteInfo cambiarEstado(McpUserContext ctx, Long id, boolean activa) {
        VacanteDTO dto = cargarDto(ctx, id);
        if (ctx.esAdmin()) {
            estadoRepository.fijarIsActive(id, activa);
        } else if (ctx.esEmpresa() && esPropietario(ctx, dto)) {
            estadoRepository.fijarActivaPorEmpresa(id, activa);
        } else {
            throw new AccesoDenegadoException("no puedes cambiar el estado de esta vacante.");
        }
        return mapper.toInfo(cargarDto(ctx, id));
    }

    /** Deshabilitado por defecto (app.mcp.vacantes.allow-delete=false): evita borrados que se salten tu limpieza. */
    public void eliminar(McpUserContext ctx, Long id) {
        if (!permitirEliminar) {
            throw new IllegalArgumentException("La eliminacion definitiva esta deshabilitada. "
                    + "Ofrece desactivar la vacante con cambiar_estado_vacante.");
        }
        VacanteDTO dto = cargarDto(ctx, id);
        boolean permitido = ctx.esSuperAdmin() || (ctx.esEmpresa() && esPropietario(ctx, dto));
        if (!permitido) {
            throw new AccesoDenegadoException("no puedes eliminar esta vacante.");
        }
        vacanteRepository.deleteById(id);
        vacanteRepository.flush(); // fuerza aqui los errores de llaves foraneas
    }

    // ------------------------------------------------------------- helpers

    private VacanteDTO cargarDto(McpUserContext ctx, Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Falta el id de la vacante.");
        }
        try {
            return vacanteService.get(idLogin(ctx), id);
        } catch (RuntimeException e) {
            if ("NotFoundException".equals(e.getClass().getSimpleName())) {
                throw noExiste(id);
            }
            throw e;
        }
    }

    private Long idLogin(McpUserContext ctx) {
        return ctx.userId() != null ? ctx.userId() : 0L; // 0L = invitado (como en tus consultas Top)
    }

    private IllegalArgumentException noExiste(Long id) {
        return new IllegalArgumentException("No existe una vacante con id " + id + " (o no tienes acceso a ella).");
    }

    private boolean esPropietario(McpUserContext ctx, VacanteDTO dto) {
        return Objects.equals(ctx.userId(), mapper.propietarioId(dto));
    }

    private boolean puedeGestionar(McpUserContext ctx, VacanteDTO dto) {
        return ctx.esAdmin() || (ctx.esEmpresa() && esPropietario(ctx, dto));
    }

    private int limite(Integer l) {
        return (l == null || l < 1) ? LIMITE_DEFECTO : Math.min(l, LIMITE_MAXIMO);
    }

    private String limpio(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }

    private void like(List<Predicate> p, CriteriaBuilder cb, Expression<String> campo, String valor) {
        String v = limpio(valor);
        if (v != null) {
            p.add(cb.like(cb.lower(campo), patron(v)));
        }
    }

    private String patron(String v) {
        String seguro = v.toLowerCase().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
        return "%" + seguro + "%";
    }
}
