package com.miproyecto.proyecto.optimizacion.dto;

import java.util.List;

public class OptimizationResponse {

    private String status;
    private List<VacanteOptimizacionDTO> vacantes_recomendadas;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<VacanteOptimizacionDTO> getVacantes_recomendadas() {
        return vacantes_recomendadas;
    }

    public void setVacantes_recomendadas(List<VacanteOptimizacionDTO> vacantes_recomendadas) {
        this.vacantes_recomendadas = vacantes_recomendadas;
    }
}