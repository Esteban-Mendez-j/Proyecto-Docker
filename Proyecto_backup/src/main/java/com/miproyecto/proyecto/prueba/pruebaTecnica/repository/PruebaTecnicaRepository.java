package com.miproyecto.proyecto.prueba.pruebaTecnica.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miproyecto.proyecto.prueba.pruebaTecnica.model.PruebaTecnica;
import com.miproyecto.proyecto.vacante.model.Vacante;


public interface PruebaTecnicaRepository extends JpaRepository< PruebaTecnica ,Long> {
    
    Optional<PruebaTecnica> findByVacante(Vacante vacante);

    Optional<PruebaTecnica> findByVacanteAndIsActive (Vacante vacante, Boolean isActive);

    Optional<PruebaTecnica> findFirstByVacanteOrderByVersionDesc (Vacante vacante);
}
