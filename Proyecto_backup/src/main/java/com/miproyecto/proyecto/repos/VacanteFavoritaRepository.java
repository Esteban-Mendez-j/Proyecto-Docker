package com.miproyecto.proyecto.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.miproyecto.proyecto.domain.Vacante;
import com.miproyecto.proyecto.domain.VacanteFavorita;

@Repository
public interface VacanteFavoritaRepository extends JpaRepository<VacanteFavorita, Long> {
     
      // 🔹 Devuelve solo las vacantes marcadas como favoritas por el usuario
    @Query("SELECT vf.vacanteFavorita FROM VacanteFavorita vf WHERE vf.usuarioFavorita.id = :idUsuario")
    List<Vacante> findVacantesFavoritasByUsuario(@Param("idUsuario") Long idUsuario);
}
    
    
