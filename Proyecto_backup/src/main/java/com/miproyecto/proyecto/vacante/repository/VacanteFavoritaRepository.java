package com.miproyecto.proyecto.vacante.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.miproyecto.proyecto.usuario.model.Usuario;
import com.miproyecto.proyecto.vacante.model.Vacante;
import com.miproyecto.proyecto.vacante.model.VacanteFavorita;

public interface VacanteFavoritaRepository extends JpaRepository<VacanteFavorita, Long>, JpaSpecificationExecutor<VacanteFavorita> {

    Page<VacanteFavorita> findVacantesFavoritasByUsuarioFavorita(Usuario usuario, Pageable pageable);
    
    Optional<VacanteFavorita> findByVacanteFavoritaAndUsuarioFavorita(Vacante vacante, Usuario usuario);
    
}
    
    
