package com.miproyecto.proyecto.prueba.PruebaResuelta.mapper;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.RespuestaDTO;
import com.miproyecto.proyecto.prueba.PruebaResuelta.model.Respuesta;
import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.PreguntaResueltaDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.FIELD)
public interface RespuestaMapper {
    
    RespuestaMapper INSTANCE = Mappers.getMapper(RespuestaMapper.class);

    RespuestaDTO respuestaToRespuestaDTO(Respuesta respuesta);

    @Mapping(source = "pregunta.pregunta", target = "preguntaText")
    @Mapping(source = "pregunta.puntos", target = "puntos")
    @Mapping(source = "pregunta.respuestaCorrecta", target = "respuestaCorrecta")
    @Mapping(source = "pregunta.orden", target = "orden")
    @Mapping(source = "pregunta.opciones", target = "opciones")
    @Mapping(source = "pregunta.id", target = "idPregunta")
    @Mapping(source = "respuestaTexto", target = "respuestaUsuario")
    @Mapping(source = "id", target = "idRespuesta")
    PreguntaResueltaDTO respuestaToPreguntaResueltaDTO(Respuesta respuesta);
}
