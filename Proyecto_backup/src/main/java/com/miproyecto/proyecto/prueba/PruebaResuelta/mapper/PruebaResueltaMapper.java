package com.miproyecto.proyecto.prueba.PruebaResuelta.mapper;

import org.mapstruct.Context;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.miproyecto.proyecto.postulacion.model.Postulado;
import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.CreatePruebaResueltaDTO;
import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.PruebaResueltaDTO;
import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.UpdatePruebaResueltaDTO;
import com.miproyecto.proyecto.prueba.PruebaResuelta.model.PruebaResuelta;
import com.miproyecto.proyecto.prueba.pruebaTecnica.mapper.PruebaTecnicaMapper;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.PruebaTecnica;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.FIELD, 
uses = {RespuestaMapper.class, PruebaTecnicaMapper.class})
public interface PruebaResueltaMapper {
    
    PruebaResueltaMapper INSTANCE = Mappers.getMapper(PruebaResueltaMapper.class);

    @Mapping(source = "pruebaTecnica", target = "pruebaTecnicaDTO", qualifiedByName = "sinPreguntas")
    @Mapping(source = "respuestas", target = "preguntaResuelta")
    PruebaResueltaDTO pruebaResueltaToPruebaResueltaDTO(PruebaResuelta pruebaResuelta, @Context int paramTotalPreguntas);
    
    @Mapping(source = "paramPruebaTecnica", target = "pruebaTecnica")
    @Mapping(source = "paramPostulado", target = "postulado")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "fechaRealizacion", ignore = true)
    @Mapping(target = "calificacion", ignore = true)
    @Mapping(target = "respuestas", ignore = true)
    PruebaResuelta CreatePruebaResueltaDTOToPruebaResuelta(CreatePruebaResueltaDTO createPruebaResueltaDTO, PruebaTecnica paramPruebaTecnica, Postulado paramPostulado);
    

    @Mapping(source = "paramPruebaTecnica", target = "pruebaTecnica")
    @Mapping(target = "calificacion", ignore = true)
    @Mapping(target = "fechaRealizacion", ignore = true)
    @Mapping(target = "postulado", ignore = true)
    @Mapping(target = "respuestas", ignore = true)
    @Mapping(source = "updatePruebaResueltaDTO.id", target = "id")
    PruebaResuelta UpdatePruebaResueltaDTOToPruebaResuelta(UpdatePruebaResueltaDTO updatePruebaResueltaDTO, PruebaTecnica paramPruebaTecnica);
    
}
