package com.miproyecto.proyecto.model;


import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class EstudioDTO {

    private Long idEstudio;

    @NotNull
    @Size(max = 80)
    private String titulo;

    @NotNull
    @Size(max = 80)
    private String academia;

    private Long idUsuario;

    private String descripcion;
    private String nivelEducativo;
    private String estado;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Boolean visible=true;
    private String Certificado;
    

    public String getCertificado() {
        return Certificado;
    }

    public void setCertificado(String certificado) {
        Certificado = certificado;
    }

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

    public String getNivelEducativo() {
        return nivelEducativo;
    }

    public void setNivelEducativo(String nivelEducativo) {
        this.nivelEducativo = nivelEducativo;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
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

    public Long getIdEstudio() {
        return idEstudio;
    }

    public void setIdEstudio(Long idEstudio) {
        this.idEstudio = idEstudio;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getAcademia() {
        return academia;
    }

    public void setAcademia(String academia) {
        this.academia = academia;
    }
    


    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    @Override
    public String toString() {
        return "EstudioDTO [idEstudio=" + idEstudio + ", titulo=" + titulo + ", academia=" + academia  +", idUsuario="
                + idUsuario + "]";
    }


}
