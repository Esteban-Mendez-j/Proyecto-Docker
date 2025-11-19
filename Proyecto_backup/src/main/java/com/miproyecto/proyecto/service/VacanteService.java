package com.miproyecto.proyecto.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.miproyecto.proyecto.domain.Empresa;
import com.miproyecto.proyecto.domain.Postulado;
import com.miproyecto.proyecto.domain.Vacante;
import com.miproyecto.proyecto.domain.VacanteFavorita;
import com.miproyecto.proyecto.model.FiltroVacanteDTO;
import com.miproyecto.proyecto.model.VacanteDTO;
import com.miproyecto.proyecto.model.VacanteResumenDTO;
import com.miproyecto.proyecto.repos.*;
import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.util.ReferencedWarning;

@Service
@Transactional
public class VacanteService {

    private final VacanteFavoritaRepository vacanteFavoritaRepository;
    private final VacanteRepository vacanteRepository;
    private final EmpresaRepository empresaRepository;
    private final PostuladoRepository postuladoRepository;
    private final AptitudesService aptitudesService;
    private final PrediccionService prediccionService;
    @Value("${app.upload-dir.video}")
    private String videoUploadDir;

    public VacanteService(VacanteFavoritaRepository vacanteFavoritaRepository, VacanteRepository vacanteRepository,
            EmpresaRepository empresaRepository, PostuladoRepository postuladoRepository,
            AptitudesService aptitudesService, PrediccionService prediccionService) {
        this.vacanteFavoritaRepository = vacanteFavoritaRepository;
        this.vacanteRepository = vacanteRepository;
        this.empresaRepository = empresaRepository;
        this.postuladoRepository = postuladoRepository;
        this.aptitudesService = aptitudesService;
        this.prediccionService = prediccionService;
    }

    public String guardarVideo(MultipartFile file, Long nVacante) throws IOException {
        String tipo = file.getContentType();

        // Verifica si es video valido 
        String carpeta;
        if (tipo != null && tipo.startsWith("image/")) {
            carpeta = videoUploadDir;
        } else {
            throw new IllegalArgumentException("Solo se permiten archivos de imagen o PDF.");
        }

        // Crear carpeta si no existe
        Path rutaCarpeta = Path.of(carpeta).toAbsolutePath();
        Files.createDirectories(rutaCarpeta);

        // Crear nombre único para el archivo
        String nombreArchivo = nVacante + "_" + UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path rutaArchivo = rutaCarpeta.resolve(nombreArchivo);

        // Guardar el archivo en el servidor
        try (InputStream is = file.getInputStream()) {
            Files.copy(is, rutaArchivo, StandardCopyOption.REPLACE_EXISTING);
        }

        return nombreArchivo;
    }

    public void eliminarVideo(String fileName) throws IOException {
        // Determinar la carpeta dependiendo si es imagen o PDF
        String carpeta = videoUploadDir;
        Path ruta = Path.of(carpeta, fileName);

        // Eliminar el archivo si existe
        if (Files.exists(ruta)) {
            Files.delete(ruta);
        } else {
            throw new IOException("El archivo no existe: " + ruta);
        }
    }

    //  Método para incrementar visitas
    public void incrementarVisitas(final Long nvacantes) {
        final Vacante vacante = vacanteRepository.findById(nvacantes)
                .orElseThrow(NotFoundException::new);
        vacante.incrementarVisitas();
        vacanteRepository.save(vacante);
    }

    // listado de todas las vacantes activas 
    public Map<String,Object> findAllByEstado(boolean estado, Pageable pageable, String nameList) {
        final Page<Vacante> vacantes = vacanteRepository.findByIsActiveOrderByFechaPublicacionDesc(estado, pageable);
        final Page<VacanteDTO> vacantesDTO = vacantes.map(vacante -> mapToDTO(0L, 0L ,vacante, new VacanteDTO()));
        return mapResponse(vacantesDTO, nameList) ;       
    }

    public Map<String,Object> mapResponse(Page<VacanteDTO> pageableResponse, String nameList){
        Map<String,Object> response = new HashMap<>();

        response.put(nameList, pageableResponse.getContent());
        response.put("totalElements", pageableResponse.getTotalElements());
        response.put("pageActual", pageableResponse.getPageable());
        response.put("totalPage", pageableResponse.getTotalPages());
        return response;
    }

    // listado de las vacantes que esten relacionados con el idUsuario  
    public Map<String,Object> findByIdUsuario(Long idUsuario, Pageable pageable) {
        // Obtener la empresa usando su id
        Empresa empresa = empresaRepository.findById(idUsuario)
                .orElseThrow(() -> new NotFoundException("Empresa no encontrada"));
        
        // Obtener las vacantes relacionadas con esa empresa
        Page<Vacante> vacantes = vacanteRepository.findByIdUsuario(empresa, pageable);
        
        // Convertir cada vacante a VacanteDTO y devolver la lista
        Page<VacanteDTO> vacantesDTO = vacantes.map(vacante -> mapToDTO(0L, idUsuario ,vacante, new VacanteDTO()));
        return mapResponse(vacantesDTO, "vacantes");
                
    }

    public VacanteDTO findByIdUsuarioAndNvacante(Long idUsuario, Long nVacante){
        Empresa empresa = empresaRepository.findById(idUsuario)
                .orElse(null);

        return vacanteRepository.findByIdUsuarioAndNvacantes(empresa, nVacante)
            .map(vacante -> mapToDTO(0L,idUsuario,vacante, new VacanteDTO()))
            .orElse(null);
    }

    public Map<String, Object> buscarVacantesConFiltros( Long idPsotulacion, FiltroVacanteDTO filtro, Pageable pageable) {
        
        Page<VacanteDTO> page = null;

        if (Boolean.TRUE.equals(filtro.getIsFavorita())) {
            Specification<VacanteFavorita> specFav = VacanteSpecifications.favoritaConFiltros(idPsotulacion, filtro);
            page = vacanteFavoritaRepository.findAll(specFav, pageable)
                    .map(vf -> mapToDTO(idPsotulacion, idPsotulacion, vf.getVacanteFavorita(), new VacanteDTO()));
        }else{
            Specification<Vacante> specification = VacanteSpecifications.conFiltros(idPsotulacion, filtro);
            page = vacanteRepository.findAll(specification, pageable).map(vacante -> mapToDTO(idPsotulacion,idPsotulacion,vacante, new VacanteDTO()));
        }
        return mapResponse(page, "vacantes");         
    }

    //Obtiene 200 vacantes, calcula la afinidad con el usuario autenticado y ordena por la prediccion 
    public Map<String, Object> buscarVacantesConFiltrosAndOrdenByPrediccion(
            Long idPsotulacion, FiltroVacanteDTO filtro, Pageable pageableFront) {

        // 1. Definir el número de bloque del backend (cada bloque = 200 vacantes)
        int pageNumber = pageableFront.getPageNumber() / 10;
        Pageable pageableBackend = PageRequest.of(pageNumber, 200);

        // 2. Consultar vacantes del bloque
        Page<VacanteDTO> page;

        if (Boolean.TRUE.equals(filtro.getIsFavorita())) {
            Specification<VacanteFavorita> specFav = VacanteSpecifications.favoritaConFiltros(idPsotulacion, filtro);
            page = vacanteFavoritaRepository.findAll(specFav, pageableBackend)
                    .map(vf -> mapToDTO(idPsotulacion, idPsotulacion, vf.getVacanteFavorita(), new VacanteDTO()));
        } else {
            Specification<Vacante> specification = VacanteSpecifications.conFiltros(idPsotulacion, filtro);
            page = vacanteRepository.findAll(specification, pageableBackend)
                    .map(vacante -> mapToDTO(idPsotulacion, idPsotulacion, vacante, new VacanteDTO()));
        }

        List<VacanteDTO> vacantes = new ArrayList<>(page.getContent());
        long totalResultados = page.getTotalElements();

        // 3. Calcular predicción por vacante
        vacantes.forEach(v -> {
            try {
                Map<String, Object> resultados = prediccionService.predecirDesdeComparacion(v.getNvacantes(),
                        idPsotulacion);

                Object valor = resultados.get("porcentajeMatch");
                if (valor != null) {
                    v.setPrediccion(Double.parseDouble(valor.toString()));
                }
            } catch (Exception e) {
                System.out.println("Error calculando predicción para vacante " + v.getNvacantes());
            }
        });

        // 4. Ordenar por predicción
        vacantes.sort(Comparator.comparing(VacanteDTO::getPrediccion).reversed());

        // ⚠️ 5. Si el total es MENOR a 200, paginar normalmente
        if (totalResultados < 200) {
            int start = (int) pageableFront.getOffset();
            int end = Math.min(start + pageableFront.getPageSize(), vacantes.size());

            if (start >= end) {
                return mapResponse(
                        new PageImpl<>(Collections.emptyList(), pageableFront, totalResultados),
                        "vacantes");
            }

            List<VacanteDTO> manualPage = vacantes.subList(start, end);
            Page<VacanteDTO> finalPage = new PageImpl<>(manualPage, pageableFront, totalResultados);

            return mapResponse(finalPage, "vacantes");
        }

        // 6. Paginación normal para bloques de 200 (más de 200 resultados totales)
        int pageInsideBlock = pageableFront.getPageNumber() % 10;
        int start = pageInsideBlock * pageableFront.getPageSize();
        int end = Math.min(start + pageableFront.getPageSize(), vacantes.size());

        if (start >= end) {
            return mapResponse(
                    new PageImpl<>(Collections.emptyList(), pageableFront, totalResultados),
                    "vacantes");
        }

        List<VacanteDTO> pageContent = vacantes.subList(start, end);
        Page<VacanteDTO> finalPage = new PageImpl<>(pageContent, pageableFront, totalResultados);
        return mapResponse(finalPage, "vacantes");
    }


    public List<VacanteDTO> TopVacantesPorPostulados(Long idEmpresa){
        
        Empresa empresa = empresaRepository.findById(idEmpresa)
                .orElse(null);

        return vacanteRepository.findTop6ByIdUsuarioOrderByTotalpostulacionesDesc(empresa).stream()
            .map(v -> mapToDTO(0L,idEmpresa, v, new VacanteDTO()))
            .collect(Collectors.toList());  
        
    }

    public List<VacanteDTO> TopVacantesPorFechaSueldoExperiencia(Long idLogin) {
        Set<Vacante> topVacantes = new HashSet<>();
        
        topVacantes.addAll(vacanteRepository.findTop2ByIsActiveOrderByFechaPublicacionDesc(true));
        topVacantes.addAll(vacanteRepository.findTop2ByIsActiveOrderByExperienciaAsc(true));
        topVacantes.addAll(vacanteRepository.findTop2ByIsActiveOrderBySueldoDesc(true));

        // Convertir a DTO
        return topVacantes.stream()
            .filter(vacante -> vacante != null)
            .map(vacante -> mapToDTO(idLogin, idLogin ,vacante, new VacanteDTO()))
            .collect(Collectors.toList());
    }

    public VacanteDTO get(Long idLogin, final Long nvacantes) {
        return vacanteRepository.findById(nvacantes)
                .map(vacante -> mapToDTO(idLogin,idLogin, vacante, new VacanteDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public VacanteResumenDTO findVacanteResumenById(final Long nvacantes) {
        return vacanteRepository.findById(nvacantes)
                .map(vacante -> mapToResumenDTO(vacante, new VacanteResumenDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public void create(final VacanteDTO vacanteDTO) {
        final Vacante vacante = new Vacante();
        vacanteDTO.setFechaPublicacion(LocalDate.now());
        vacanteDTO.setActive(true);
        vacanteDTO.setActivaPorEmpresa(true);
        mapToEntity(vacanteDTO, vacante);
        vacanteRepository.save(vacante);
    }

    public void update(final Long nvacantes, final VacanteDTO vacanteDTO) {
        final Vacante vacante = vacanteRepository.findById(nvacantes)
                .orElseThrow(NotFoundException::new);
        vacanteDTO.setIdUsuario(vacante.getIdUsuario().getIdUsuario());
        vacanteDTO.setFechaPublicacion(vacante.getFechaPublicacion());
        vacanteDTO.setActive(vacante.getIsActive());
        vacanteDTO.setActivaPorEmpresa(vacante.isActivaPorEmpresa());
        mapToEntity(vacanteDTO, vacante);
        vacanteRepository.save(vacante);
    }

    public void updateNumCompartidos (Long nVacantes){
        final Vacante vacante = vacanteRepository.findById(nVacantes)
                .orElseThrow(NotFoundException::new);
        vacante.setIncrementNumCompartidos(1);
        vacanteRepository.save(vacante);
    }

    public void cambiarEstado(final Long nvacantes, boolean estado) {
        final Vacante vacante = vacanteRepository.findById(nvacantes)
                .orElseThrow(NotFoundException::new);
        vacante.setActivaPorEmpresa(estado);
        vacanteRepository.save(vacante);
    }
    
    public VacanteDTO mapToDTO(Long idPostulaciones, Long idUsuarioAut, final Vacante vacante, final VacanteDTO vacanteDTO) {
        vacanteDTO.setNvacantes(vacante.getNvacantes());
        vacanteDTO.setCargo(vacante.getCargo());
        vacanteDTO.setFechaPublicacion(vacante.getFechaPublicacion());
        vacanteDTO.setSueldo(vacante.getSueldo());
        vacanteDTO.setModalidad(vacante.getModalidad());
        vacanteDTO.setExperiencia(vacante.getExperiencia());
        vacanteDTO.setCiudad(vacante.getCiudad());
        vacanteDTO.setDepartamento(vacante.getDepartamento());
        vacanteDTO.setTitulo(vacante.getTitulo());
        vacanteDTO.setTipo(vacante.getTipo());
        vacanteDTO.setDescripcion(vacante.getDescripcion());
        vacanteDTO.setRequerimientos(vacante.getRequerimientos());
        vacanteDTO.setActive(Boolean.TRUE.equals(vacante.getIsActive()));
        vacanteDTO.setComentarioAdmin(vacante.getComentarioAdmin());
        vacanteDTO.setIdUsuario(vacante.getIdUsuario() == null ? null : vacante.getIdUsuario().getIdUsuario());
        vacanteDTO.setNameEmpresa(vacante.getIdUsuario() != null ? vacante.getIdUsuario().getNombre() : "Empresa Desconocida");
        vacanteDTO.setImagenEmpresa(vacante.getIdUsuario() != null ? vacante.getIdUsuario().getImagen() : "null");
        vacanteDTO.setTotalpostulaciones(vacante.getTotalpostulaciones());
        vacanteDTO.setActivaPorEmpresa(vacante.isActivaPorEmpresa());
        vacanteDTO.setNumCompartidos(vacante.getNumCompartidos());
        vacanteDTO.setnPostulados(vacante.getLitarpostulados() != null? vacante.getLitarpostulados().size(): 0);
        vacanteDTO.setVisitas(vacante.getVisitas());
        
        vacanteDTO.setAptitudes(
                vacante.getAptitudes().stream()
                        .map(aptitud -> aptitud.getNombreAptitud())
                        .collect(Collectors.toList()));
        vacanteDTO.setCandidatoPostulado(
            vacante.getLitarpostulados()
                .stream()
                .anyMatch(p -> p.getCandidato().getIdUsuario().equals(idPostulaciones))
        );
        vacante.getLitarpostulados().stream()
            .filter(p -> p.getCandidato().getIdUsuario().equals(idPostulaciones))
            .findFirst()
            .ifPresent(p -> vacanteDTO.setEstadoPostulacion(p.getEstado())); // o p.getEstado().name()
        vacanteDTO.setNumeroGuardadosFavoritos(vacante.getListaVacnatesFavoritas().size());
        //TODO lo que hcae es que verifica si esta en la lista de favooritos pero no verifica si la lista es del usuario autenticado
        vacante.getListaVacnatesFavoritas()
        .forEach(favoritaVacante -> { 

            Long idUsuarioFav = favoritaVacante.getUsuarioFavorita().getIdUsuario();
            Long nVacanteFav = favoritaVacante.getVacanteFavorita().getNvacantes();
            if (nVacanteFav.equals(vacante.getNvacantes()) && idUsuarioFav.equals(idUsuarioAut)){
                vacanteDTO.setVacanteGuardada(true);
            } 
        }); 
        return vacanteDTO;
    }

    public VacanteResumenDTO mapToResumenDTO(final Vacante vacante, final VacanteResumenDTO vacanteResumenDTO){
        vacanteResumenDTO.setId(vacante.getNvacantes());
        vacanteResumenDTO.setCiudad(vacante.getCiudad());
        vacanteResumenDTO.setTitulo(vacante.getTitulo());
        vacanteResumenDTO.setTipo(vacante.getTipo());
        vacanteResumenDTO.setActivaPorEmpresa(vacante.isActivaPorEmpresa());
        vacanteResumenDTO.setIsActive(vacante.getIsActive());
        vacanteResumenDTO.setNameEmpresa(vacante.getIdUsuario().getNombre());
        vacanteResumenDTO.setModalidad(vacante.getModalidad());
        return vacanteResumenDTO;
    }

    public Vacante mapToEntity(final VacanteDTO vacanteDTO, final Vacante vacante) {
        vacante.setCargo(vacanteDTO.getCargo());
        vacante.setFechaPublicacion(vacanteDTO.getFechaPublicacion());
        vacante.setSueldo(vacanteDTO.getSueldo());
        vacante.setModalidad(vacanteDTO.getModalidad());
        vacante.setExperiencia(vacanteDTO.getExperiencia());
        vacante.setCiudad(vacanteDTO.getCiudad());
        vacante.setDepartamento(vacanteDTO.getDepartamento());
        vacante.setTitulo(vacanteDTO.getTitulo());
        vacante.setTipo(vacanteDTO.getTipo());
        vacante.setDescripcion(vacanteDTO.getDescripcion());
        vacante.setRequerimientos(vacanteDTO.getRequerimientos());
        vacante.setIsActive(vacanteDTO.isActive());
        vacante.setActivaPorEmpresa(vacanteDTO.isActivaPorEmpresa());
        vacante.setComentarioAdmin(vacanteDTO.getComentarioAdmin());
        vacante.setNumCompartidos(vacanteDTO.getNumCompartidos());
        
        // 🔥 NUEVO: Mapear el campo de visitas
        vacante.setVisitas(vacanteDTO.getVisitas());
        
        final Empresa idUsuario = vacanteDTO.getIdUsuario() == null ? null : empresaRepository.findById(vacanteDTO.getIdUsuario())
                .orElseThrow(() -> new NotFoundException("idUsuario not found"));
        vacante.setIdUsuario(idUsuario);
        vacante.setAptitudes(aptitudesService.mapToListEntity(vacanteDTO.getAptitudes()));
        return vacante;
    }

    public ReferencedWarning getReferencedWarning(final Long nvacantes) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Vacante vacante = vacanteRepository.findById(nvacantes)
                .orElseThrow(NotFoundException::new);
        final Postulado nvacantePostulado = postuladoRepository.findFirstByVacante(vacante);
        if (nvacantePostulado != null) {
            referencedWarning.setKey("vacante.postulado.nvacante.referenced");
            referencedWarning.addParam(nvacantePostulado.getNPostulacion());
            return referencedWarning;
        }
        return null;
    }
}