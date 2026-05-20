package com.miproyecto.proyecto.prueba.PruebaResuelta.service.implementation;


import org.springframework.stereotype.Service;

import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.CreateRespuestaDTO;
import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.RespuestaDTO;
import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.UpdateRespuestaDTO;
import com.miproyecto.proyecto.prueba.PruebaResuelta.model.PruebaResuelta;
import com.miproyecto.proyecto.prueba.PruebaResuelta.model.Respuesta;
import com.miproyecto.proyecto.prueba.PruebaResuelta.repository.RespuestaRepository;
import com.miproyecto.proyecto.prueba.PruebaResuelta.service.interfaces.RespuestaService;
import com.miproyecto.proyecto.prueba.pruebaTecnica.service.implementation.PreguntaServiceImpl;
import com.miproyecto.proyecto.util.NotFoundException;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class RespuestaServiceImpl implements RespuestaService {

    private final RespuestaRepository respuestaRepository;
    private final PreguntaServiceImpl preguntaServiceImpl;
    
    @Override
    public RespuestaDTO findById(Long id) {
        Respuesta respuesta = respuestaRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        return mapToRespuestaDTO(respuesta);   
    }

    @Override
    public Long create(RespuestaDTO respuestaDTO) {

        respuestaDTO.setPregunta(
                preguntaServiceImpl.findDtoById(respuestaDTO.getPregunta().getId())
        );

        Respuesta respuesta = mapToEntity(respuestaDTO);
        return respuestaRepository.save(respuesta).getId();
    }

    @Override
    public Long update(RespuestaDTO respuestaDTO) {

        existById(respuestaDTO.getId());

        respuestaDTO.setPregunta(
                preguntaServiceImpl.findDtoById(respuestaDTO.getPregunta().getId())
        );

        Respuesta respuesta = mapToEntity(respuestaDTO);
        return respuestaRepository.save(respuesta).getId();
    }

    @Override
    public void existById(Long id) {
        Boolean exist = respuestaRepository.existsById(id);
        if (!exist) new NotFoundException();
    }

    public Boolean calificarRespueta(Respuesta respuesta){
        String respuestaCorrecta = respuesta.getPregunta().getRespuestaCorrecta();
        return respuestaCorrecta.equalsIgnoreCase(respuesta.getRespuestaTexto());
    }

    public RespuestaDTO mapToRespuestaDTO(Respuesta respuesta) {

        return RespuestaDTO.builder()
                .id(respuesta.getId())
                .respuestaTexto(respuesta.getRespuestaTexto())
                .esCorrecta(respuesta.getEsCorrecta())
                .pregunta(preguntaServiceImpl.mapToDTO(respuesta.getPregunta()))
                .build();
    }

    public Respuesta mapCreateRespuestaDtoToRespuesta(CreateRespuestaDTO createRespuestaDTO, PruebaResuelta pruebaResuelta){
        return Respuesta.builder()
            .respuestaTexto(createRespuestaDTO.getRespuestaTexto())
            .pregunta(preguntaServiceImpl.findEntityById(createRespuestaDTO.getIdPregunta()))
            .pruebaResuelta(pruebaResuelta)
            .build();
    }

    public Respuesta mapUpdateRespuestaDtoToRespuesta(UpdateRespuestaDTO updateRespuestaDTO, PruebaResuelta pruebaResuelta){
        return Respuesta.builder()
            .id(updateRespuestaDTO.getId())
            .respuestaTexto(updateRespuestaDTO.getRespuestaTexto())
            .pregunta(preguntaServiceImpl.findEntityById(updateRespuestaDTO.getIdPregunta()))
            .pruebaResuelta(pruebaResuelta)
            .build();
    }

    public Respuesta mapToEntity(RespuestaDTO respuestaDTO) {

        return Respuesta.builder()
                .id(respuestaDTO.getId())
                .respuestaTexto(respuestaDTO.getRespuestaTexto())
                .esCorrecta(respuestaDTO.getEsCorrecta())
                .pregunta(preguntaServiceImpl.mapToEntity(respuestaDTO.getPregunta()))
                .build();
    }

}
