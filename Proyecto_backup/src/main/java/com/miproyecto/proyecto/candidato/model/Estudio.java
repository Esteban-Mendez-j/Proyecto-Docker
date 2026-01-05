package com.miproyecto.proyecto.candidato.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;


@Entity
public class Estudio {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEstudio;

    @Column(nullable = false, length = 80)
    private String titulo;

    @Column(nullable = false, length = 80)
    private String academia;

    @Column
    private String descripcion;

    @Column
    private String nivelEducativo;

    @Column
    private String estado;

    @Column
    private LocalDate fechaInicio;

    @Column
    private LocalDate fechaFin;

    @Column
    private Boolean visible;

    @Column
    private String certificado;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_id")
    private Candidato idUsuario;

    public String getCertificado() {
        return certificado;
    }

    public void setCertificado(String certificado) {
        this.certificado = certificado;
    }


    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Boolean getVisible() {
        return visible;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
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

    public void setIdEstudio(final Long idEstudio) {
        this.idEstudio = idEstudio;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(final String titulo) {
        this.titulo = titulo;
    }

    public String getAcademia() {
        return academia;
    }

    public void setAcademia(final String academia) {
        this.academia = academia;
    }
    
    //     public String getNivelEducacion() {
    //     return nivelEducacion;
    // }

    // public void setNivelEducacion(String nivelEducacion) {
    //     this.nivelEducacion = nivelEducacion;
    // }

    public Candidato getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(final Candidato idUsuario) {
        this.idUsuario = idUsuario;
    }

}
