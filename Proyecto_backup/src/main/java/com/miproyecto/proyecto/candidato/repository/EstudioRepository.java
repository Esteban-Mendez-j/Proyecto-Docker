package com.miproyecto.proyecto.candidato.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.miproyecto.proyecto.candidato.model.Candidato;
import com.miproyecto.proyecto.candidato.model.Estudio;


public interface EstudioRepository extends JpaRepository<Estudio, Long> {

    Estudio findFirstByIdUsuario(Candidato candidato);

    boolean existsByIdUsuario(Candidato candidato);

    List<Estudio> findByIdUsuario(Candidato candidato);

    List<Estudio> findByIdUsuarioAndVisible(Candidato candidato, Boolean visible);

    void deleteByIdUsuario_IdUsuario(Long idUsuario);
    
    @Query("""
        SELECT e
        FROM Estudio e
        WHERE e.idUsuario.idUsuario = :idUsuario
        AND e.visible = :visible
    """)
    List<Estudio> findByUsuarioIdAndVisible( @Param("idUsuario") Long idUsuario,
            @Param("visible") Boolean visible);
}
