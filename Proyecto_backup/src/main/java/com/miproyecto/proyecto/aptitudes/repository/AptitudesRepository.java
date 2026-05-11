package com.miproyecto.proyecto.aptitudes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miproyecto.proyecto.aptitudes.model.Aptitudes;


public interface AptitudesRepository extends JpaRepository<Aptitudes, Long> {

    Aptitudes findByNombreAptitud(String nombreAptitud);  
} 
