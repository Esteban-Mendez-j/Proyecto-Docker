package com.miproyecto.proyecto.prueba.pruebaTecnica.service.interfaces;

import java.util.List;

import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.PreguntaDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.Pregunta;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.PruebaTecnica;

public interface PreguntaService {
    
    PreguntaDTO findDtoById(Long id);

    Pregunta findEntityById(Long id);

    List<PreguntaDTO> findListQuestionByPruebaTecnica(PruebaTecnica pruebaTecnica);

    Integer countQuestionByPruebaTecnica(PruebaTecnica pruebaTecnica);

    Long create(PreguntaDTO preguntaDTO, PruebaTecnica pruebaTecnica);

    void create(List<PreguntaDTO> preguntasDTO, PruebaTecnica pruebaTecnica) ;

    Long update(PreguntaDTO pregunta);

    void update(List<PreguntaDTO> preguntas) ;

}
