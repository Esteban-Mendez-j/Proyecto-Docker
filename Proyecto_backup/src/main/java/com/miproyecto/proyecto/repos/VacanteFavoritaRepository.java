package com.miproyecto.proyecto.repos;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.miproyecto.proyecto.domain.Usuario;
import com.miproyecto.proyecto.domain.Vacante;
import com.miproyecto.proyecto.domain.VacanteFavorita;

public interface VacanteFavoritaRepository extends JpaRepository<VacanteFavorita, Long>, JpaSpecificationExecutor<VacanteFavorita> {

    Page<VacanteFavorita> findVacantesFavoritasByUsuarioFavorita(Usuario usuario, Pageable pageable);
    
    Optional<VacanteFavorita> findByVacanteFavoritaAndUsuarioFavorita(Vacante vacante, Usuario usuario);
    
}
    
    
