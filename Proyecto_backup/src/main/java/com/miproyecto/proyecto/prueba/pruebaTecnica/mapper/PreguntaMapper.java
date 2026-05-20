package com.miproyecto.proyecto.prueba.pruebaTecnica.mapper;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;

import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.PreguntaDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.Pregunta;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.FIELD)
public interface PreguntaMapper {

    PreguntaDTO preguntaToPreguntaDTO(Pregunta pregunta);
}
