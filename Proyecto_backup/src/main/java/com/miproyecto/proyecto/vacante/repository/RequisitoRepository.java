package com.miproyecto.proyecto.vacante.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.miproyecto.proyecto.vacante.model.Requisito;

import java.util.List;
import java.util.Optional;
import java.util.Set;


public interface RequisitoRepository extends JpaRepository<Requisito,Long>{
    Optional<Requisito> findByNombre(String nombre);

    Optional<Set<Requisito>> findAllByNombreIn(List<String> nombres);
    
    List<Requisito> findTop10ByNombreLikeIgnoreCase(String nombreBusqueda);

    @Query ("""
        SELECT v.nvacantes, r.nombre
        FROM Vacante v
        JOIN v.requisitos r
        WHERE v.nvacantes IN :idsVacantes
    """)
    List<Object[]> findNombresByVacantes(
            @Param("idsVacantes") List<Long> idsVacantes);
}
