package com.miproyecto.proyecto.repos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miproyecto.proyecto.domain.Usuario;
import com.miproyecto.proyecto.domain.Vacante;
import com.miproyecto.proyecto.domain.VacanteFavorita;

public interface VacanteFavoritaRepository extends JpaRepository<VacanteFavorita, Long> {

    List<VacanteFavorita>findVacantesFavoritasByUsuarioFavorita(Usuario usuario);
    
    Optional<VacanteFavorita> findByVacanteFavoritaAndUsuarioFavorita(Vacante vacante, Usuario usuario);
    
}
    
    
