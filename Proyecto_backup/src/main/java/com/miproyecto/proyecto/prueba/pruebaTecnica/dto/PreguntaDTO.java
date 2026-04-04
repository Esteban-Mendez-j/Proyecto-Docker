package com.miproyecto.proyecto.prueba.pruebaTecnica.dto;

import java.util.List;


public class PreguntaDTO {
    private Long id;
    private String pregunta;
    private Integer puntos;
    private String respuestaCorrecta;
    private Integer orden;
    private List<OpcionesDTO> opciones;
    
    public List<OpcionesDTO> getOpciones() {
        return opciones;
    }
    public void setOpciones(List<OpcionesDTO> opciones) {
        this.opciones = opciones;
    }
    public Integer getOrden() {
        return orden;
    }
    public void setOrden(Integer orden) {
        this.orden = orden;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getPregunta() {
        return pregunta;
    }
    public void setPregunta(String pregunta) {
        this.pregunta = pregunta;
    }
    public Integer getPuntos() {
        return puntos;
    }
    public void setPuntos(Integer puntos) {
        this.puntos = puntos;
    }
    public String getRespuestaCorrecta() {
        return respuestaCorrecta;
    }
    public void setRespuestaCorrecta(String respuestaCorrecta) {
        this.respuestaCorrecta = respuestaCorrecta;
    }
}
