package com.miproyecto.proyecto.prueba.PruebaResuelta.dto;

import java.time.LocalTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreatePruebaResueltaDTO {

    private LocalTime tiempoDeRespuesta;
    private Long idPruebaTecnica;
    private Long idPostulado;
    private List<CreateRespuestaDTO> respuestas;
}
