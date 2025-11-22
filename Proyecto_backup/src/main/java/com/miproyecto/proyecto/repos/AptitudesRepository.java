package com.miproyecto.proyecto.repos;

// import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miproyecto.proyecto.domain.Aptitudes;
// import com.miproyecto.proyecto.domain.Candidato;

public interface AptitudesRepository extends JpaRepository<Aptitudes, Long> {
    
    // Aptitudes findFirstByIdUsuario(Candidato candidato);

    // boolean existsByIdUsuario(Candidato candidato);

    // List<Aptitudes> findByCandidato(Candidato candidato);

    // void deleteByIdUsuario_IdUsuario(Long idUsuario);

    Aptitudes findByNombreAptitud(String nombreAptitud);  
} 
