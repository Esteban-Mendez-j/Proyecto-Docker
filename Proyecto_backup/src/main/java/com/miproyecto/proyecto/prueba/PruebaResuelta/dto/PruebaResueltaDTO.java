package com.miproyecto.proyecto.prueba.PruebaResuelta.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.PreguntaResueltaDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.PruebaTecnicaDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PruebaResueltaDTO {
    private Long id; 
    private LocalTime tiempoDeRespuesta;
    private Double calificacion;
    private LocalDate fechaRealizacion;
    private PruebaTecnicaDTO pruebaTecnicaDTO;
    // private List<RespuestaDTO> respuestas;
    private List<PreguntaResueltaDTO> preguntaResuelta;
}
