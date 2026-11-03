package com.miproyecto.proyecto.aptitudes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.miproyecto.proyecto.aptitudes.model.Aptitudes;


public interface AptitudesRepository extends JpaRepository<Aptitudes, Long> {

    Aptitudes findByNombreAptitud(String nombreAptitud);  

    @Query("""
        SELECT v.nvacantes, a.nombreAptitud
        FROM Vacante v
        JOIN v.aptitudes a
        WHERE v.nvacantes IN :idsVacantes
    """)
    List<Object[]> findAptitudesByVacantes(@Param("idsVacantes") List<Long> idsVacantes);
} 
