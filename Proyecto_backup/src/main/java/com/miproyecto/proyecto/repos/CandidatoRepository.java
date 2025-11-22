package com.miproyecto.proyecto.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miproyecto.proyecto.domain.Candidato;



public interface CandidatoRepository extends JpaRepository<Candidato, Long> {

    Optional<Candidato> findByIdentificacion( String identificacion);

    boolean existsByIdentificacionIgnoreCase(String identificacion);

    
    boolean existsByIdUsuario(Long idUsuario);


}
