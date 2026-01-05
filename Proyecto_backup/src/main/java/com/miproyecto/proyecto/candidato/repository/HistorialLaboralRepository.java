package com.miproyecto.proyecto.candidato.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miproyecto.proyecto.candidato.model.Candidato;
import com.miproyecto.proyecto.candidato.model.HistorialLaboral;


public interface HistorialLaboralRepository extends JpaRepository<HistorialLaboral, Long> {

    HistorialLaboral findFirstByIdUsuario(Candidato candidato);

    List<HistorialLaboral> findByIdUsuario(Candidato candidato);

    List<HistorialLaboral> findByIdUsuarioAndVisible(Candidato candidato, Boolean visible);

    void deleteByIdUsuario_IdUsuario(Long idUsuario);

}
