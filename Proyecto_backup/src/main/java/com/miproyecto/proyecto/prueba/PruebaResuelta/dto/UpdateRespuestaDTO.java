package com.miproyecto.proyecto.prueba.PruebaResuelta.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateRespuestaDTO {
    private Long id;
    private String respuestaTexto;
    private Long  idPregunta;
}
