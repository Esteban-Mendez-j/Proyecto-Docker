package com.miproyecto.proyecto.vacante.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miproyecto.proyecto.vacante.model.Cargo;

public interface CargoRepository extends JpaRepository<Cargo, Long>{
    
    Optional<Cargo> findByNombre(String nombre);

    List<Cargo> findTop10ByNombreLikeIgnoreCase(String nombreBusqueda);
}
