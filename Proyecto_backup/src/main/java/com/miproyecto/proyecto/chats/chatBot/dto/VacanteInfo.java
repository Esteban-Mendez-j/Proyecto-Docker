package com.miproyecto.proyecto.chats.chatBot.dto;

import java.util.List;

/** Vista de una vacante para el LLM (solo tipos simples). Nunca incluye datos internos ni de postulantes. */
public record VacanteInfo(
        Long id,
        String titulo,
        String cargo,
        String descripcion,
        String ciudad,
        String departamento,
        String modalidad,
        String sueldo,
        String experiencia,
        String requerimientos,
        String tipo,
        String empresa,
        String fechaPublicacion,
        String totalPostulaciones,
        List<String> aptitudes,
        List<String> requisitos,
        Boolean activa,
        Boolean activaPorEmpresa) {
}