package com.miproyecto.proyecto.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.miproyecto.proyecto.domain.VacanteFavorita;

@Repository
public interface VacanteFavoritaRepository extends JpaRepository<VacanteFavorita, Long> {
    
    
}
