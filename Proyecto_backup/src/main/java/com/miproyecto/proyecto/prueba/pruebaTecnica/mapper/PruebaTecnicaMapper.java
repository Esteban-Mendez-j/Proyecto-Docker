package com.miproyecto.proyecto.prueba.pruebaTecnica.mapper;

import org.mapstruct.Context;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.ComparaPruebaDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.PruebaTecnicaDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.PruebaTecnica;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.FIELD)
public interface PruebaTecnicaMapper {
    
    PruebaTecnicaMapper INSTANCE = Mappers.getMapper(PruebaTecnicaMapper.class);
    
    @Mapping(source = "vacante.nvacantes", target = "idVacante")
    ComparaPruebaDTO pruebaTecnicaTOComparaPruebaDTO(PruebaTecnica pruebaTecnica);

    @Named("sinPreguntas")
    @Mapping(source = "vacante.nvacantes", target = "idVacante")
    @Mapping(target = "preguntas", ignore = true)
    @Mapping(target = "totalPreguntas", expression = "java(paramTotalPreguntas)")
    PruebaTecnicaDTO pruebaTecnicaToPruebaTecnicaDtoSinPreguntas(PruebaTecnica pruebaTecnica, @Context int paramTotalPreguntas);
    
    @Named("completo")
    @Mapping(source = "vacante.nvacantes", target = "idVacante")
    @Mapping(target = "totalPreguntas", ignore = true)
    PruebaTecnicaDTO pruebaTecnicaToPruebaTecnicaDTO(PruebaTecnica pruebaTecnica);

}
