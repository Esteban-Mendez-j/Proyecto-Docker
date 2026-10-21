package com.miproyecto.proyecto.ml.dto.demandaLaboral;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;


public record CargoPrediccion(
    int id,
    String nombre,
    int posicion,
    Boolean success, // true: si la prediccion de este cargo se realizó correctamente 
    
    @JsonProperty ("motivo_sin_prediccion")
    String motivoSinPrediccion,

    @JsonProperty("demanda_historica")
    List<DemandaHistorica> demandaHistorica,

    List<PrediccionPeriodo> prediccion,

    @JsonProperty("crecimiento_estimado")
    double crecimientoEstimado,

    List<RequisitoPrediccion> requisitos
) {}