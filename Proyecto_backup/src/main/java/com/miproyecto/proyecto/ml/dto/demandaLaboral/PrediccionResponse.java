package com.miproyecto.proyecto.ml.dto.demandaLaboral;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;


public record PrediccionResponse (
    boolean success,
    String mensaje,

    @JsonProperty("fecha_generacion")
    LocalDateTime fechaGeneracion,

    @JsonProperty("horizonte_prediccion")
    HorizontePrediccion horizontePrediccion,

    List<CargoPrediccion> cargos
){}


