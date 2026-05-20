package com.miproyecto.proyecto.prueba.pruebaTecnica.mapper;


import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;

import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.OpcionesDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.Opciones;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.FIELD)
public interface OpcionesMapper {

    OpcionesDTO opcionesToOpcionesDTO(Opciones opciones);
}
