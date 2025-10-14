package com.miproyecto.proyecto.repos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.miproyecto.proyecto.domain.Usuario;
import com.miproyecto.proyecto.domain.Vacante;
import com.miproyecto.proyecto.domain.VacanteFavorita;



@Repository
public interface VacanteFavoritaRepository extends JpaRepository<VacanteFavorita, Long> {
     
// @Query(value = """
//     SELECT
//         v.nvacantes AS nvacantes,
//         v.titulo AS titulo,
//         v.ciudad AS ciudad,
//         v.tipo AS tipo,
//         v.activa_por_empresa AS activaPorEmpresa,
//         v.is_active AS isActive
//     FROM vacante v
//     WHERE v.nvacantes IN (
//         SELECT vf.id_fav_vacante
//         FROM vacante_favorita vf
//         WHERE vf.id_fav_usuario = :idUsuario
//     )
//     ORDER BY v.nvacantes DESC
//     """, nativeQuery = true)
// List<Map<String, Object>> findVacantesFavoritasByUsuario(@Param("idUsuario") Long idUsuario);
    List<VacanteFavorita>findVacantesFavoritasByUsuarioFavorita(Usuario usuario);
    
    Optional<VacanteFavorita> findByVacanteFavoritaAndUsuarioFavorita(Vacante vacante, Usuario usuario);
    
}
    
    
