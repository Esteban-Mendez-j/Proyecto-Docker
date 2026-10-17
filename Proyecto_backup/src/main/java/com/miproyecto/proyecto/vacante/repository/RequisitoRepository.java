package com.miproyecto.proyecto.vacante.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miproyecto.proyecto.vacante.model.Requisito;

import java.util.List;
import java.util.Optional;
import java.util.Set;


public interface RequisitoRepository extends JpaRepository<Requisito,Long>{
    Optional<Requisito> findByNombre(String nombre);

    Optional<Set<Requisito>> findAllByNombreIn(List<String> nombres);
    
}
