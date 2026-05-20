package com.miproyecto.proyecto.prueba.pruebaTecnica.dto;

import java.util.List;

public class CompararPreguntaDTO {
    private String pregunta;
    private Integer puntos;
    private String respuestaCorrecta;
    private List<CompararOpcionesDTO> opciones;
    private Integer orden;
    
    public CompararPreguntaDTO(String pregunta, Integer puntos, String respuestaCorrecta,
         List<CompararOpcionesDTO> opciones, Integer orden) {
        this.pregunta = pregunta;
        this.puntos = puntos;
        this.respuestaCorrecta = respuestaCorrecta;
        
        this.opciones = opciones;
        this.orden = orden;
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
    public List<CompararOpcionesDTO> getOpciones() {
        return opciones;
    }
    public void setOpciones(List<CompararOpcionesDTO> opciones) {
        this.opciones = opciones;
    }
    public Integer getOrden() {
        return orden;
    }
    public void setOrden(Integer orden) {
        this.orden = orden;
    }

    @Override
    public String toString() {
        return "CompararPreguntaDTO [pregunta=" + pregunta + ", puntos=" + puntos + ", respuestaCorrecta="
                + respuestaCorrecta + ", opciones=" + opciones + ", orden=" + orden + "]";
    }
}
