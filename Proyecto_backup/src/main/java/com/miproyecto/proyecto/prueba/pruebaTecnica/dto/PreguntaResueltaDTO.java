package com.miproyecto.proyecto.prueba.pruebaTecnica.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PreguntaResueltaDTO {
    private Long idPregunta;
    private Long idRespuesta;
    private String preguntaText;
    private Integer puntos;
    private String respuestaCorrecta;
    private String respuestaUsuario;
    private Boolean esCorrecta;
    private Integer orden;
    private List<OpcionesDTO> opciones;
}
