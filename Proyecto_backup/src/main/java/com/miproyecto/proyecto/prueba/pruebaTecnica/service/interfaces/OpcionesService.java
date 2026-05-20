package com.miproyecto.proyecto.prueba.pruebaTecnica.service.interfaces;

import java.util.List;

import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.OpcionesDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.Pregunta;

public interface OpcionesService {

    Long create(OpcionesDTO opcionDTO, Pregunta pregunta);

    void create(List<OpcionesDTO> opcionesDTO, Pregunta pregunta);

    Long update(OpcionesDTO opcionDTO, Pregunta pregunta);

    void update(List<OpcionesDTO> opcionesDTO, Pregunta pregunta);

}
