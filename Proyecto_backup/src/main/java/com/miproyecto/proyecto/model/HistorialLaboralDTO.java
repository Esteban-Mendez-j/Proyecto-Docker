package com.miproyecto.proyecto.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class HistorialLaboralDTO {

    @JsonProperty("iDHistorial")
    private Long iDHistorial;

    @NotNull
    @Size(max = 100)
    private String titulo;

    @NotNull
    @Size(max = 100)
    private String empresa;

    private Long idUsuario;

    private Boolean trabajoActual;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String descripcion;
    private Boolean visible=true;

    public Boolean getVisible() {
        return visible;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Boolean getTrabajoActual() {
        return trabajoActual;
    }

    public void setTrabajoActual(Boolean trabajoActual) {
        this.trabajoActual = trabajoActual;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Long getiDHistorial() {
        return iDHistorial;
    }

    public void setiDHistorial(Long iDHistorial) {
        this.iDHistorial = iDHistorial;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getEmpresa() {
        return empresa;
    }

    public void setEmpresa(String empresa) {
        this.empresa = empresa;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    @Override
    public String toString() {
        return "HistorialLaboralDTO [iDHistorial=" + iDHistorial + ", titulo=" + titulo + ", empresa=" + empresa
                + ", idUsuario=" + idUsuario + "]";
    }

  

}