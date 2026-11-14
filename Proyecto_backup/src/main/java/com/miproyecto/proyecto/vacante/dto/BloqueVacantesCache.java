package com.miproyecto.proyecto.vacante.dto;

import java.util.List;

public record BloqueVacantesCache(
        List<VacanteDTO> vacantes,
        long totalResultados
) {}