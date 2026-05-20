package com.miproyecto.proyecto.optimizacion.dto;

import java.util.List;

public class OptimizationRequest {

    private List<VacanteOptimizacionDTO> vacancies;

    public List<VacanteOptimizacionDTO> getVacancies() {
        return vacancies;
    }

    public void setVacancies(
        List<VacanteOptimizacionDTO> vacancies
    ) {
        this.vacancies = vacancies;
    }
}