package com.miproyecto.proyecto.chats.chatBot.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import com.miproyecto.proyecto.vacante.model.Vacante;

public interface VacanteMcpEstadoRepository extends Repository<Vacante, Long> {

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("update Vacante v set v.activaPorEmpresa = :valor where v.nvacantes = :id")
    int fijarActivaPorEmpresa(@Param("id") Long id, @Param("valor") boolean valor);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("update Vacante v set v.isActive = :valor where v.nvacantes = :id")
    int fijarIsActive(@Param("id") Long id, @Param("valor") boolean valor);
}
