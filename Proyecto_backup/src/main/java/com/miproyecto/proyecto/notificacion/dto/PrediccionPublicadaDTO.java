package com.miproyecto.proyecto.notificacion.dto;


public class PrediccionPublicadaDTO {

    private String tipo;
    private String ejecucionId;
    private Integer anioPredicho;

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getEjecucionId() {
        return ejecucionId;
    }

    public void setEjecucionId(String ejecucionId) {
        this.ejecucionId = ejecucionId;
    }

    public Integer getAnioPredicho() {
        return anioPredicho;
    }

    public void setAnioPredicho(Integer anioPredicho) {
        this.anioPredicho = anioPredicho;
    }
}