package com.miproyecto.proyecto.repos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.miproyecto.proyecto.domain.Empresa;
import com.miproyecto.proyecto.domain.Vacante;


public interface VacanteRepository extends JpaRepository<Vacante, Long>, JpaSpecificationExecutor<Vacante>{

    Page<Vacante> findByIdUsuario(Empresa empresa, Pageable pageable);

    Vacante findFirstByIdUsuario(Empresa empresa);

    Optional<Vacante> findByIdUsuarioAndNvacantes(Empresa idUsuario, Long nvacantes);

    Page<Vacante> findByIsActiveOrderByFechaPublicacionDesc(Boolean estado, Pageable pageable);

    List<Vacante> findTop2ByIsActiveOrderByFechaPublicacionDesc(Boolean estado);

    List<Vacante> findTop2ByIsActiveOrderBySueldoDesc(Boolean estado);

    List<Vacante> findTop2ByIsActiveOrderByExperienciaAsc(Boolean estado);

    List<Vacante> findTop6ByIdUsuarioOrderByTotalpostulacionesDesc(Empresa idUsuario);

    @Query("""
            SELECT DISTINCT v.titulo
            FROM Vacante v
            WHERE LOWER(v.titulo) LIKE LOWER(CONCAT(:titulo, '%'))
            ORDER BY v.titulo ASC
            """)
    List<String> findTituloByTitulo(@Param("titulo") String titulo);

    
}
