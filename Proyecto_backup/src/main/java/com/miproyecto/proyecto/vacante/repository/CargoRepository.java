package com.miproyecto.proyecto.vacante.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miproyecto.proyecto.vacante.model.Cargo;

public interface CargoRepository extends JpaRepository<Cargo, Long>{
    
    Optional<Cargo> findCargoByNombre(String nombre);
}
