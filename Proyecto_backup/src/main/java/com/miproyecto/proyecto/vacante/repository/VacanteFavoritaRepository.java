package com.miproyecto.proyecto.vacante.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.miproyecto.proyecto.usuario.model.Usuario;
import com.miproyecto.proyecto.vacante.model.Vacante;
import com.miproyecto.proyecto.vacante.model.VacanteFavorita;

public interface VacanteFavoritaRepository extends JpaRepository<VacanteFavorita, Long>, JpaSpecificationExecutor<VacanteFavorita> {

    Page<VacanteFavorita> findVacantesFavoritasByUsuarioFavorita(Usuario usuario, Pageable pageable);
    
    Optional<VacanteFavorita> findByVacanteFavoritaAndUsuarioFavorita(Vacante vacante, Usuario usuario);

    boolean existsByVacanteFavorita_NvacantesAndUsuarioFavorita_IdUsuario(Long nvacantes, Long idUsuario);

    long countByVacanteFavorita_Nvacantes(Long nvacantes);

    @Query("SELECT vf.vacanteFavorita.nvacantes FROM VacanteFavorita vf WHERE vf.usuarioFavorita.idUsuario = :idUsuario AND vf.vacanteFavorita.nvacantes IN :nvacantes")
    List<Long> findVacanteIdsFavoritasByUsuarioAndVacanteIds(@Param("idUsuario") Long idUsuario, @Param("nvacantes") List<Long> nvacantes);
    
}
