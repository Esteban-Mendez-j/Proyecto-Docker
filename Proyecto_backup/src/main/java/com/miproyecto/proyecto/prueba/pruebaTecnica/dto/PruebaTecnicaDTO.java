package com.miproyecto.proyecto.prueba.pruebaTecnica.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PruebaTecnicaDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private LocalTime tiempoParaResponder;
    private Integer totalPreguntas;
    private Integer version = 0;
    private Boolean isActive;
    private LocalDate fechaCreacion;
    private Long idVacante;
    private String hash;
    private List<PreguntaDTO> preguntas;
}
