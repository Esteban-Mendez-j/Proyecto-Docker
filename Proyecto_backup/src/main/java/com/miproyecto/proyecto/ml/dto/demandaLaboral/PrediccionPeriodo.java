package com.miproyecto.proyecto.ml.dto.demandaLaboral;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PrediccionPeriodo(
    int periodo,

    @JsonProperty("cantidad_predicha")
    int cantidadPredicha

) {}