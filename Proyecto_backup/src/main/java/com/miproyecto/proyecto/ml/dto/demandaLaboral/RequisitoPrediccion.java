package com.miproyecto.proyecto.ml.dto.demandaLaboral;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public record RequisitoPrediccion(
    int id,
    String nombre,
    String tipo,
    Boolean success, // true: si la prediccion de este requisito se realizó correctamente 
    
    @JsonProperty ("motivo_sin_prediccion")
    String motivoSinPrediccion,

    @JsonProperty ("demanda_historica")
    List<DemandaHistorica> demandaHistorica,

    List<PrediccionPeriodo> prediccion,

    @JsonProperty("crecimiento_estimado")
    double crecimientoEstimado
) {}
