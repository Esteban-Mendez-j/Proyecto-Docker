package com.miproyecto.proyecto.prueba.pruebaTecnica.dto;

import java.time.LocalTime;
import java.util.List;

public class ComparaPruebaDTO {
    private String titulo;
    private String descripcion;
    private LocalTime tiempoParaResponder;
    private List<CompararPreguntaDTO> preguntas;
    private Boolean isActive;
    private Long idVacante;

    public ComparaPruebaDTO(String titulo, String descripcion, LocalTime tiempoParaResponder,
            List<CompararPreguntaDTO> preguntas, Boolean isActive, Long idVacante) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.tiempoParaResponder = tiempoParaResponder;
        this.preguntas = preguntas;
        this.isActive = isActive;
        this.idVacante = idVacante;
    }

    public String getTitulo() {
        return titulo;
    }
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public LocalTime getTiempoParaResponder() {
        return tiempoParaResponder;
    }
    public void setTiempoParaResponder(LocalTime tiempoParaResponder) {
        this.tiempoParaResponder = tiempoParaResponder;
    }
    public List<CompararPreguntaDTO> getPreguntas() {
        return preguntas;
    }
    public void setPreguntas(List<CompararPreguntaDTO> preguntas) {
        this.preguntas = preguntas;
    }
    public Boolean getIsActive() {
        return isActive;
    }
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    public Long getIdVacante() {
        return idVacante;
    }
    public void setIdVacante(Long idVacante) {
        this.idVacante = idVacante;
    }

    @Override
    public String toString() {
        return "ComparaPruebaDTO [titulo=" + titulo + ", descripcion=" + descripcion + ", tiempoParaResponder="
                + tiempoParaResponder + ", preguntas=" + preguntas + ", isActive=" + isActive
                + ", idVacante=" + idVacante + "]";
    }


}
