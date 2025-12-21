package com.miproyecto.proyecto.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.miproyecto.proyecto.domain.Candidato;
import com.miproyecto.proyecto.domain.Estudio;
import com.miproyecto.proyecto.model.EstudioDTO;
import com.miproyecto.proyecto.repos.CandidatoRepository;
import com.miproyecto.proyecto.repos.EstudioRepository;
import com.miproyecto.proyecto.util.NotFoundException;


@Service
public class EstudioService {

    private final EstudioRepository estudioRepository;
    private final CandidatoRepository candidatoRepository;

    public EstudioService(final EstudioRepository estudioRepository,
            final CandidatoRepository candidatoRepository) {
        this.estudioRepository = estudioRepository;
        this.candidatoRepository = candidatoRepository;
    }

    //TODO: debo indicar que solo se obtengan las que tienen la visibilidad en 1 o true tambein en historial
    public List<EstudioDTO> findAll() {
        final List<Estudio> estudios = estudioRepository.findAll(Sort.by("idEstudio"));
        return estudios.stream()
                .map(estudio -> mapToDTO(estudio, new EstudioDTO()))
                .toList();
    }

    @Transactional
    public void replaceEstudios(Long candidatoId, List<EstudioDTO> nuevosDTO) {

        // 1) Borrar todos los estudios actuales del candidato
        estudioRepository.deleteByIdUsuario_IdUsuario(candidatoId);
        
        List<Estudio> nuevos = nuevosDTO.stream()
                .map(dto -> mapToEntity(dto, new Estudio()))   // ① dto, ② entidad vacía
                .toList();


        // 3) Guardar la lista nueva
        estudioRepository.saveAll(nuevos);
    }


    // obtienen todos los estudios registrados con el mismo idUsuario 
    public List<EstudioDTO> getEstudiosByIdUsuarioAndVisible(final Long idUsuario, final Boolean visible) {
        final Candidato candidato = candidatoRepository.findById(idUsuario)
                .orElseThrow(NotFoundException::new);
        final List<Estudio> idUsuarioEstudio = estudioRepository.findByIdUsuarioAndVisible(candidato, visible );
        if (idUsuarioEstudio != null) {
            return idUsuarioEstudio.stream()
            .map(estudio -> mapToDTO(estudio, new EstudioDTO()))
            .toList();   
        }
        return null;
    }

    public EstudioDTO get(final Long idEstudio) {
        return estudioRepository.findById(idEstudio)
                .map(estudio -> mapToDTO(estudio, new EstudioDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public void cambiarVisibilidad(boolean estado, Long idEstudio){
        Estudio estudio = estudioRepository.findById(idEstudio)
                .orElseThrow(NotFoundException::new);
        estudio.setVisible(estado);
        estudioRepository.save(estudio);
    }

    public Long create(final EstudioDTO estudioDTO) {
        final Estudio estudio = new Estudio();
        mapToEntity(estudioDTO, estudio);
        return estudioRepository.save(estudio).getIdEstudio();
    }

    public void update(final Long idEstudio, final EstudioDTO estudioDTO) {
        final Estudio estudio = estudioRepository.findById(idEstudio)
                .orElseThrow(NotFoundException::new);
        mapToEntity(estudioDTO, estudio);
        System.out.println(estudio);
        estudioRepository.save(estudio);
    }

    public void delete(final Long idEstudio) {
        estudioRepository.deleteById(idEstudio);
    }

    private EstudioDTO mapToDTO(final Estudio estudio, final EstudioDTO estudioDTO) {
        estudioDTO.setIdEstudio(estudio.getIdEstudio());
        estudioDTO.setTitulo(estudio.getTitulo());
        estudioDTO.setDescripcion(estudio.getDescripcion());
        estudioDTO.setEstado(estudio.getEstado());
        estudioDTO.setFechaInicio(estudio.getFechaInicio());
        estudioDTO.setNivelEducativo(estudio.getNivelEducativo());
        estudioDTO.setFechaFin(estudio.getFechaFin());
        estudioDTO.setAcademia(estudio.getAcademia());
        estudioDTO.setVisible(estudio.getVisible());
        estudioDTO.setCertificado(estudio.getCertificado());
        estudioDTO.setIdUsuario(estudio.getIdUsuario() == null ? null : estudio.getIdUsuario().getIdUsuario());
        return estudioDTO;
    }

    private Estudio mapToEntity(final EstudioDTO estudioDTO, final Estudio estudio) {
        estudio.setTitulo(estudioDTO.getTitulo());
        estudio.setAcademia(estudioDTO.getAcademia());
        estudio.setDescripcion(estudioDTO.getDescripcion());
        estudio.setEstado(estudioDTO.getEstado());
        estudio.setFechaInicio(estudioDTO.getFechaInicio());
        estudio.setNivelEducativo(estudioDTO.getNivelEducativo());
        estudio.setFechaFin(estudioDTO.getFechaFin());
        estudio.setVisible(estudioDTO.getVisible());
        estudio.setCertificado(estudioDTO.getCertificado());
        final Candidato idUsuario = estudioDTO.getIdUsuario() == null ? null : candidatoRepository.findById(estudioDTO.getIdUsuario())
                .orElseThrow(() -> new NotFoundException("idUsuario not found"));
        estudio.setIdUsuario(idUsuario);
        return estudio;
    }

}
