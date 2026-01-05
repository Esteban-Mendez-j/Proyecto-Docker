package com.miproyecto.proyecto.aptitudes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.miproyecto.proyecto.aptitudes.model.Aptitudes;

@Repository
public interface AptitudesRepository extends JpaRepository<Aptitudes, Long> {

    Aptitudes findByNombreAptitud(String nombreAptitud);  
} 
