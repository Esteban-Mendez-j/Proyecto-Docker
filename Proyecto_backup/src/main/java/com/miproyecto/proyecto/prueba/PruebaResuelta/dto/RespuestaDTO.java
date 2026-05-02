package com.miproyecto.proyecto.prueba.PruebaResuelta.dto;

import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.PreguntaDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaDTO {

    private Long id;
    private Boolean esCorrecta;
    private String respuestaTexto;
    private PreguntaDTO pregunta;
}
