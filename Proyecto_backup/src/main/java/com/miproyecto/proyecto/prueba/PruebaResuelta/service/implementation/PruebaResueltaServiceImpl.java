package com.miproyecto.proyecto.prueba.PruebaResuelta.service.implementation;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.miproyecto.proyecto.postulacion.model.Postulado;
import com.miproyecto.proyecto.postulacion.service.PostuladoService;
import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.CreatePruebaResueltaDTO;
import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.PruebaResueltaDTO;
import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.UpdatePruebaResueltaDTO;
import com.miproyecto.proyecto.prueba.PruebaResuelta.mapper.PruebaResueltaMapper;
import com.miproyecto.proyecto.prueba.PruebaResuelta.model.PruebaResuelta;
import com.miproyecto.proyecto.prueba.PruebaResuelta.model.Respuesta;
import com.miproyecto.proyecto.prueba.PruebaResuelta.repository.PruebaResueltaRepository;
import com.miproyecto.proyecto.prueba.PruebaResuelta.service.interfaces.PruebaResueltaService;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.PruebaTecnica;
import com.miproyecto.proyecto.prueba.pruebaTecnica.service.implementation.PreguntaServiceImpl;
import com.miproyecto.proyecto.prueba.pruebaTecnica.service.implementation.PruebaTecnicaServiceImpl;
import com.miproyecto.proyecto.util.NotFoundException;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class PruebaResueltaServiceImpl implements PruebaResueltaService {

    private final PruebaResueltaRepository pruebaResueltaRepository;
    private final PruebaTecnicaServiceImpl pruebaTecnicaServiceImpl;
    private final RespuestaServiceImpl respuestaServiceImpl;
    private final PostuladoService postuladoService;
    private final PruebaResueltaMapper pruebaResueltaMapper;
    private final PreguntaServiceImpl preguntaServiceImpl;

    @Override
    @Transactional
    public PruebaResueltaDTO findPruebaResueltaDTOById(Long id) {
        
        PruebaResuelta pruebaResuelta = pruebaResueltaRepository.findById(id)
                .orElseThrow(NotFoundException::new);

        return pruebaResueltaMapper.pruebaResueltaToPruebaResueltaDTO(pruebaResuelta,
                preguntaServiceImpl.countQuestionByPruebaTecnica(pruebaResuelta.getPruebaTecnica()));
    }

    @Override
    public Long create(CreatePruebaResueltaDTO createPruebaResueltaDTO) {
        PruebaTecnica pruebatecnica = pruebaTecnicaServiceImpl
            .findEntityById(createPruebaResueltaDTO.getIdPruebaTecnica());
        
        Postulado postulado = postuladoService
            .findEntityById(createPruebaResueltaDTO.getIdPostulado());

        PruebaResuelta pruebaResuelta = pruebaResueltaMapper
            .CreatePruebaResueltaDTOToPruebaResuelta(createPruebaResueltaDTO, pruebatecnica , postulado);
        
        pruebaResuelta.setFechaRealizacion(LocalDate.now());
        pruebaResuelta.setRespuestas(
                createPruebaResueltaDTO.getRespuestas()
                        .stream()
                        .map(respuesta -> {
                            Respuesta response = respuestaServiceImpl.mapCreateRespuestaDtoToRespuesta(respuesta, pruebaResuelta);
                            response.setEsCorrecta(respuestaServiceImpl.calificarRespueta(response));
                            return response;
                        })
                        .toList());
        pruebaResuelta.setCalificacion(calificarPrueba(pruebaResuelta, pruebatecnica));
        return pruebaResueltaRepository.save(pruebaResuelta).getId();
    }

    @Override
    public Long update(UpdatePruebaResueltaDTO updatePruebaResueltaDTO) {
        existById(updatePruebaResueltaDTO.getId());

        PruebaTecnica pruebaTecnica = pruebaTecnicaServiceImpl
            .findEntityById(updatePruebaResueltaDTO.getPruebaTecnicaId());
        
        PruebaResuelta pruebaResuelta = pruebaResueltaMapper
            .UpdatePruebaResueltaDTOToPruebaResuelta(updatePruebaResueltaDTO, pruebaTecnica);

        pruebaResuelta.setFechaRealizacion(LocalDate.now());
        pruebaResuelta.setRespuestas(
                updatePruebaResueltaDTO.getRespuestas()
                        .stream()
                        .map(respuesta -> {
                            Respuesta response = respuestaServiceImpl.mapUpdateRespuestaDtoToRespuesta(respuesta, pruebaResuelta);
                            response.setEsCorrecta(respuestaServiceImpl.calificarRespueta(response));
                            return response;
                        })
                        .toList());
        pruebaResuelta.setCalificacion(calificarPrueba(pruebaResuelta, pruebaTecnica));

        return pruebaResueltaRepository.save(pruebaResuelta).getId();
    }

    @Override
    public void existById(Long id) {
        Boolean exist = pruebaResueltaRepository.existsById(id);
        if (!exist) new NotFoundException();
    }

    public Double calificarPrueba (PruebaResuelta pruebaResuelta, PruebaTecnica pruebaTecnica){
        List<Respuesta> respuestas = pruebaResuelta.getRespuestas();
        int totalRespuestasCorrectas = 0;
        int totalPreguntas = preguntaServiceImpl
            .countQuestionByPruebaTecnica(pruebaTecnica);
        for (Respuesta respuesta : respuestas) {
            if(respuesta.getEsCorrecta()) ++totalRespuestasCorrectas;
        }
        return calcularCalificacion((double)totalPreguntas, (double)totalRespuestasCorrectas);
    }

    public Double calcularCalificacion(Double totalPreguntas, Double totalRespuestasCorrectas){
        Double calificacionMaxima = 5.0;
        if(totalPreguntas <= 0) throw new ArithmeticException("Error al calcular la calificacion");
        return (calificacionMaxima/totalPreguntas)*totalRespuestasCorrectas;
    }

    public PruebaResuelta mapToEntity(PruebaResueltaDTO pruebaResueltaDTO){

        return PruebaResuelta.builder()
        .id(pruebaResueltaDTO.getId())
        .tiempoDeRespuesta(pruebaResueltaDTO.getTiempoDeRespuesta())
        .calificacion(pruebaResueltaDTO.getCalificacion())
        .fechaRealizacion(pruebaResueltaDTO.getFechaRealizacion())
        .pruebaTecnica(pruebaTecnicaServiceImpl.mapToEntity(pruebaResueltaDTO.getPruebaTecnicaDTO()))
        // .respuestas(pruebaResueltaDTO.getRespuestas()
        //     .stream()
        //     .map(respuestaDTO -> respuestaServiceImpl.mapToEntity(respuestaDTO))
        //     .toList()
        // )
        .build();
    }

    public PruebaResueltaDTO mapToPruebaResueltaDTO(PruebaResuelta pruebaResuelta){

        return PruebaResueltaDTO.builder()
        .id(pruebaResuelta.getId())
        .tiempoDeRespuesta(pruebaResuelta.getTiempoDeRespuesta())
        .calificacion(pruebaResuelta.getCalificacion())
        .fechaRealizacion(pruebaResuelta.getFechaRealizacion())
        .pruebaTecnicaDTO(pruebaTecnicaServiceImpl.mapToDTO(pruebaResuelta.getPruebaTecnica()))
        .build();
    }

    
    
}
