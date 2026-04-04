package com.miproyecto.proyecto.prueba.PruebaResuelta.dto;

import java.time.LocalTime;
import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdatePruebaResueltaDTO {
    private Long id; 
    private LocalTime tiempoDeRespuesta;
    private Long pruebaTecnicaId;
    private List<UpdateRespuestaDTO> respuestas;
}
