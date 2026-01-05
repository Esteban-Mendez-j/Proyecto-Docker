package com.miproyecto.proyecto.candidato.service;

import com.miproyecto.proyecto.candidato.dto.HistorialLaboralDTO;
import com.miproyecto.proyecto.candidato.model.Candidato;
import com.miproyecto.proyecto.candidato.model.HistorialLaboral;
import com.miproyecto.proyecto.candidato.repository.CandidatoRepository;
import com.miproyecto.proyecto.candidato.repository.HistorialLaboralRepository;
import com.miproyecto.proyecto.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class HistorialLaboralService {

    private final HistorialLaboralRepository historialLaboralRepository;
    private final CandidatoRepository candidatoRepository;

    public HistorialLaboralService(final HistorialLaboralRepository historialLaboralRepository,
            final CandidatoRepository candidatoRepository) {
        this.historialLaboralRepository = historialLaboralRepository;
        this.candidatoRepository = candidatoRepository;
    }

    public List<HistorialLaboralDTO> findAll() {
        final List<HistorialLaboral> historialLaborals = historialLaboralRepository.findAll(Sort.by("iDHistorial"));
        return historialLaborals.stream()
                .map(historialLaboral -> mapToDTO(historialLaboral, new HistorialLaboralDTO()))
                .toList();
    }

    public List<HistorialLaboralDTO> getHistorialByIdUsuarioAndVisible(final Long idUsuario, final Boolean visible ) {
        final Candidato candidato = candidatoRepository.findById(idUsuario)
                .orElseThrow(NotFoundException::new);
        final List<HistorialLaboral> idUsuarioHistorialLaboral =  historialLaboralRepository.findByIdUsuarioAndVisible(candidato, visible);
        if (idUsuarioHistorialLaboral != null) {
            return idUsuarioHistorialLaboral.stream()
            .map(historialLaboral -> mapToDTO(historialLaboral, new HistorialLaboralDTO()))
            .toList();
        }
        return null;
    }

    public void cambiarVisibilidad(boolean estado, Long idHistorial) {
        HistorialLaboral historial = historialLaboralRepository.findById(idHistorial)
                .orElseThrow(NotFoundException::new);
        historial.setVisible(estado);
        historialLaboralRepository.save(historial);
    }

    public HistorialLaboralDTO get(final Long iDHistorial) {
        return historialLaboralRepository.findById(iDHistorial)
                .map(historialLaboral -> mapToDTO(historialLaboral, new HistorialLaboralDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final HistorialLaboralDTO historialLaboralDTO) {
        final HistorialLaboral historialLaboral = new HistorialLaboral();
        mapToEntity(historialLaboralDTO, historialLaboral);
        return historialLaboralRepository.save(historialLaboral).getIDHistorial();
    }

    public void update(final Long iDHistorial, final HistorialLaboralDTO historialLaboralDTO) {
        final HistorialLaboral historialLaboral = historialLaboralRepository.findById(iDHistorial)
                .orElseThrow(NotFoundException::new);
        mapToEntity(historialLaboralDTO, historialLaboral);
        historialLaboralRepository.save(historialLaboral);
    }

    public void delete(final Long iDHistorial) {
        historialLaboralRepository.deleteById(iDHistorial);
    }

    @Transactional
    public void replaceHistorial(Long candidatoId, List<HistorialLaboralDTO> nuevosDTO) {

        historialLaboralRepository.deleteByIdUsuario_IdUsuario(candidatoId);
        
        List<HistorialLaboral> nuevos = nuevosDTO.stream()
                .map(dto -> mapToEntity(dto, new HistorialLaboral()))   // ① dto, ② entidad vacía
                .toList();

        historialLaboralRepository.saveAll(nuevos);
    }

    private HistorialLaboralDTO mapToDTO(final HistorialLaboral historialLaboral,
            final HistorialLaboralDTO historialLaboralDTO) {
        historialLaboralDTO.setiDHistorial(historialLaboral.getIDHistorial());
        historialLaboralDTO.setTitulo(historialLaboral.getTitulo());
        historialLaboralDTO.setEmpresa(historialLaboral.getEmpresa());
        historialLaboralDTO.setFechaFin(historialLaboral.getFechaFin());
        historialLaboralDTO.setFechaInicio(historialLaboral.getFechaInicio());
        historialLaboralDTO.setTrabajoActual(historialLaboral.getTrabajoActual());
        historialLaboralDTO.setDescripcion(historialLaboral.getDescripcion());
        historialLaboralDTO.setVisible(historialLaboral.getVisible());
        historialLaboralDTO.setIdUsuario(historialLaboral.getIdUsuario() == null ? null : historialLaboral.getIdUsuario().getIdUsuario());
        return historialLaboralDTO;
    }

    private HistorialLaboral mapToEntity(final HistorialLaboralDTO historialLaboralDTO,
            final HistorialLaboral historialLaboral) {
        historialLaboral.setTitulo(historialLaboralDTO.getTitulo());
        historialLaboral.setEmpresa(historialLaboralDTO.getEmpresa());
        historialLaboral.setFechaFin(historialLaboralDTO.getFechaFin());
        historialLaboral.setFechaInicio(historialLaboralDTO.getFechaInicio());
        historialLaboral.setTrabajoActual(historialLaboralDTO.getTrabajoActual());
        historialLaboral.setDescripcion(historialLaboralDTO.getDescripcion());
        historialLaboral.setVisible(historialLaboralDTO.getVisible());
        final Candidato idUsuario = historialLaboralDTO.getIdUsuario() == null ? null : candidatoRepository.findById(historialLaboralDTO.getIdUsuario())
                .orElseThrow(() -> new NotFoundException("idUsuario not found"));
        historialLaboral.setIdUsuario(idUsuario);
        return historialLaboral;
    }

}
