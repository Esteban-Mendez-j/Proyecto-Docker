package com.miproyecto.proyecto.candidato.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miproyecto.proyecto.candidato.model.Candidato;
import com.miproyecto.proyecto.candidato.model.Estudio;


public interface EstudioRepository extends JpaRepository<Estudio, Long> {

    Estudio findFirstByIdUsuario(Candidato candidato);

    boolean existsByIdUsuario(Candidato candidato);

    List<Estudio> findByIdUsuario(Candidato candidato);

    List<Estudio> findByIdUsuarioAndVisible(Candidato candidato, Boolean visible);

    void deleteByIdUsuario_IdUsuario(Long idUsuario);
    

}
