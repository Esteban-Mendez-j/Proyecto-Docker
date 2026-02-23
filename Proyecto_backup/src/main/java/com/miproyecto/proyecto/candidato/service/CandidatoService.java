package com.miproyecto.proyecto.candidato.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.miproyecto.proyecto.aptitudes.model.Aptitudes;
import com.miproyecto.proyecto.aptitudes.service.AptitudesService;
import com.miproyecto.proyecto.candidato.dto.CandidatoDTO;
import com.miproyecto.proyecto.candidato.dto.CandidatoResumenDTO;
import com.miproyecto.proyecto.candidato.model.Candidato;
import com.miproyecto.proyecto.candidato.repository.CandidatoRepository;
import com.miproyecto.proyecto.ml.service.PrediccionService;
import com.miproyecto.proyecto.usuario.model.Roles;
import com.miproyecto.proyecto.usuario.repository.RolesRepository;
import com.miproyecto.proyecto.util.NotFoundException;


@Service
@Transactional
public class CandidatoService{

    private final PrediccionService prediccionService;
    private final CandidatoRepository candidatoRepository;
    private final PasswordEncoder passwordEncoder;
    private final RolesRepository rolesRepository;
    private final AptitudesService aptitudesService;

    public CandidatoService(PrediccionService prediccionService, CandidatoRepository candidatoRepository,
            PasswordEncoder passwordEncoder, RolesRepository rolesRepository, AptitudesService aptitudesService) {
        this.prediccionService = prediccionService;
        this.candidatoRepository = candidatoRepository;
        this.passwordEncoder = passwordEncoder;
        this.rolesRepository = rolesRepository;
        this.aptitudesService = aptitudesService;
    }

    // busca un candidato por su id
    public CandidatoDTO get(final Long idUsuario) {
        return candidatoRepository.findById(idUsuario)
                .map(candidato -> mapToDTO(candidato, new CandidatoDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public CandidatoResumenDTO getCandidatoResumen(final Long idUsuario) {
        return candidatoRepository.findById(idUsuario)
                .map(candidato -> mapToResumenDTO(candidato, new CandidatoResumenDTO()))
                .orElseThrow(NotFoundException::new);
    }

    // busca un candidato por su identificacion
    public CandidatoDTO getByIdentificacion(final String identificacion) {
        return candidatoRepository.findByIdentificacion(identificacion)
                .map(candidato -> mapToDTO(candidato, new CandidatoDTO()))
                .orElseThrow(NotFoundException::new);
    }


    // crea y guarda un objeto candidato en la base de datos 
    public Long create(final CandidatoDTO candidatoDTO) {
        final Candidato candidato = new Candidato();
        List<Roles> roles= new ArrayList<>();

        roles.add(rolesRepository.findByRol("CANDIDATO"));
        candidatoDTO.setIsActive(true);
        candidatoDTO.setFechaRegistro(LocalDate.now());
        mapToEntity(candidatoDTO, candidato, true);
        candidato.setRoles(roles);// guarda el rol en la db
        return candidatoRepository.save(candidato).getIdUsuario();
    }

    // busca y actualiza un objeto candidato en la base de datos 
    public void update(final Long idUsuario, final CandidatoDTO candidatoDTO) throws Exception {
        final Candidato candidato = candidatoRepository.findById(idUsuario)
                .orElseThrow(NotFoundException::new);
        mapToEntity(candidatoDTO, candidato, false);
        
        candidatoRepository.save(candidato);

        prediccionService.ActualizarAfinidad(idUsuario);
    }

    public void delete(final Long idUsuario) {
        candidatoRepository.deleteById(idUsuario);
    }

    // convierte un objeto de tipo candidato a candidatoDTO
    public CandidatoDTO mapToDTO(final Candidato candidato, final CandidatoDTO candidatoDTO) {
        candidatoDTO.setIdUsuario(candidato.getIdUsuario());
        candidatoDTO.setNombre(candidato.getNombre());
        candidatoDTO.setContrasena(candidato.getContrasena());
        candidatoDTO.setCorreo(candidato.getCorreo());
        candidatoDTO.setTelefono(candidato.getTelefono());
        candidatoDTO.setDescripcion(candidato.getDescripcion());
        candidatoDTO.setImagen(candidato.getImagen());
        candidatoDTO.setApellido(candidato.getApellido());
        candidatoDTO.setCurriculo(candidato.getCurriculo());
        candidatoDTO.setExperiencia(candidato.getExperiencia());
        candidatoDTO.setIdentificacion(candidato.getIdentificacion());
        candidatoDTO.setIsActive(candidato.getIsActive());
        candidatoDTO.setComentarioAdmin(candidato.getComentarioAdmin());
        candidatoDTO.setFechaInicioSesion(candidato.getFechaInicioSesion());
        candidatoDTO.setFechaRegistro(candidato.getFechaRegistro());
        List<Aptitudes> aptitudes = candidato.getAptitudes() != null ? candidato.getAptitudes() : new ArrayList<>();
            candidatoDTO.setAptitudes(
                aptitudes.stream().map(Aptitudes::getNombreAptitud).collect(Collectors.toList())
            );
        candidatoDTO.setVideoLink(candidato.getVideoLink());

        candidatoDTO.setNivelEducativo(candidato.getNivelEducativo());
                        
        candidatoDTO.setRoles(
            candidato.getRoles().stream()
                    .map(roles -> roles.getRol())
                    .collect(Collectors.toList())
        );
        return candidatoDTO;
    }

    public CandidatoResumenDTO mapToResumenDTO(final Candidato candidato, final CandidatoResumenDTO candidatoResumenDTO) {
        candidatoResumenDTO.setId(candidato.getIdUsuario());
        candidatoResumenDTO.setNombre(candidato.getNombre());
        candidatoResumenDTO.setExperiencia(candidato.getExperiencia());
        candidatoResumenDTO.setCurriculo(candidato.getCurriculo());
        candidatoResumenDTO.setCorreo(candidato.getCorreo());
        return candidatoResumenDTO;
    }
    
    // convierte un objeto de Roles candidatoDTO a candidato
    private Candidato mapToEntity(final CandidatoDTO candidatoDTO, final Candidato candidato, boolean crear) {
        if (crear) {
            // candidato.setRoles(candidatoDTO.getRoles());
            candidato.setContrasena(passwordEncoder.encode(candidatoDTO.getContrasena()));
        }
        
        candidato.setNombre(candidatoDTO.getNombre());
        candidato.setCorreo(candidatoDTO.getCorreo());
        candidato.setTelefono(candidatoDTO.getTelefono());
        candidato.setDescripcion(candidatoDTO.getDescripcion());
        candidato.setImagen(candidatoDTO.getImagen());
        candidato.setApellido(candidatoDTO.getApellido());
        candidato.setCurriculo(candidatoDTO.getCurriculo());
        candidato.setExperiencia(candidatoDTO.getExperiencia());
        candidato.setIdentificacion(candidatoDTO.getIdentificacion());
        candidato.setIsActive(candidatoDTO.getIsActive());
        candidato.setComentarioAdmin(candidatoDTO.getComentarioAdmin());
        candidato.setFechaInicioSesion(candidatoDTO.getFechaInicioSesion());
        candidato.setFechaRegistro(candidatoDTO.getFechaRegistro());
        List<String> aptitudes = candidatoDTO.getAptitudes() != null ? candidatoDTO.getAptitudes() : new ArrayList<>();
        candidato.setAptitudes(aptitudesService.mapToListEntity(aptitudes));
        candidato.setNivelEducativo(candidatoDTO.getNivelEducativo());
        candidato.setVideoLink(candidatoDTO.getVideoLink());
        return candidato;
    }

    public boolean identificacionExists(final String identificacion) {
        return candidatoRepository.existsByIdentificacionIgnoreCase(identificacion);
    }

}

