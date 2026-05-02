package com.miproyecto.proyecto.prueba.pruebaTecnica.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.CompararOpcionesDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.CompararPreguntaDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.PreguntaDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.Opciones;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.Pregunta;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.PruebaTecnica;
import com.miproyecto.proyecto.prueba.pruebaTecnica.repository.PreguntaRepository;
import com.miproyecto.proyecto.prueba.pruebaTecnica.service.interfaces.PreguntaService;
import com.miproyecto.proyecto.util.NotFoundException;

@Service
public class PreguntaServiceImpl implements PreguntaService{
    private PreguntaRepository preguntaRepository;
    private OpcionesServiceImpl opcionesService;

    public PreguntaServiceImpl(PreguntaRepository preguntaRepository, OpcionesServiceImpl opcionesService) {
        this.preguntaRepository = preguntaRepository;
        this.opcionesService = opcionesService;
    }

    @Override
    public PreguntaDTO findDtoById(Long id){
        Pregunta pregunta = preguntaRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        return mapToDTO(pregunta);
    }

    @Override
    public Pregunta findEntityById(Long id){
        return preguntaRepository.findById(id)
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public List<PreguntaDTO> findListQuestionByPruebaTecnica(PruebaTecnica pruebaTecnica){
        return preguntaRepository.findByPrueba(pruebaTecnica)
            .stream()
            .map(pregunta -> mapToDTO(pregunta))
            .toList();
    }

    @Override
    public Integer countQuestionByPruebaTecnica(PruebaTecnica pruebaTecnica){
        return preguntaRepository.findByPrueba(pruebaTecnica).size();
    }

    @Override
    public Long create(PreguntaDTO preguntaDTO, PruebaTecnica pruebaTecnica){
        Pregunta pregunta = mapToEntity(preguntaDTO); 
        pregunta.setPrueba(pruebaTecnica);
        opcionesService.create(preguntaDTO.getOpciones(), pregunta);
        return preguntaRepository.save(pregunta).getId();
    }

    @Override
    public void create(List<PreguntaDTO> preguntasDTO, PruebaTecnica pruebaTecnica) {
        preguntaRepository.saveAll(
            preguntasDTO.stream()
            .map(preguntaDTO -> {
                Pregunta pregunta = mapToEntity(preguntaDTO);
                pregunta.setPrueba(pruebaTecnica);
                opcionesService.create(preguntaDTO.getOpciones(), pregunta);
                return pregunta;
            })
            .toList()
        );
    }

    @Override
    public Long update(PreguntaDTO pregunta){
        return preguntaRepository.save(mapToEntity(pregunta)).getId();
    }

    @Override
    public void update(List<PreguntaDTO> preguntas) {
        preguntaRepository.saveAll(
            preguntas.stream()
            .map(pregunta -> mapToEntity(pregunta))
            .toList()
        );
    }

    public PreguntaDTO mapToDTO(Pregunta pregunta){
        PreguntaDTO preguntaDTO = new PreguntaDTO();

        preguntaDTO.setId(pregunta.getId());
        preguntaDTO.setPregunta(pregunta.getPregunta());
        preguntaDTO.setPuntos(pregunta.getPuntos());
        preguntaDTO.setRespuestaCorrecta(pregunta.getRespuestaCorrecta());
        preguntaDTO.setOrden(pregunta.getOrden());
        preguntaDTO.setOpciones(
            pregunta.getOpciones()
            .stream()
            .map(respuesta -> opcionesService.mapToDTO(respuesta))
            .toList()
        );
        return preguntaDTO;
    }

    public Pregunta mapToEntity(PreguntaDTO preguntaDTO){
        Pregunta pregunta = new Pregunta();

        pregunta.setId(preguntaDTO.getId());
        pregunta.setPregunta(preguntaDTO.getPregunta());
        pregunta.setPuntos(preguntaDTO.getPuntos());
        pregunta.setRespuestaCorrecta(preguntaDTO.getRespuestaCorrecta());
        pregunta.setOrden(preguntaDTO.getOrden());
        pregunta.setOpciones(
            preguntaDTO.getOpciones()
            .stream()
            .map(respuestaDTO -> {
                Opciones respuesta = opcionesService.mapToEntity(respuestaDTO);
                respuesta.setPregunta(pregunta);
                return respuesta;
            })
            .toList()
        );
        return pregunta;
    }

    public CompararPreguntaDTO mapDtoToCompararDTO(PreguntaDTO p) {
        List<CompararOpcionesDTO> Opciones = p.getOpciones()
        .stream()
        .map(respuesta -> opcionesService.mapDtoToCompararDTO(respuesta))
        .collect(Collectors.toList());

        return new CompararPreguntaDTO(
            p.getPregunta(),
            p.getPuntos(),
            p.getRespuestaCorrecta(),
            Opciones,
            p.getOrden()
        );
    }

}
