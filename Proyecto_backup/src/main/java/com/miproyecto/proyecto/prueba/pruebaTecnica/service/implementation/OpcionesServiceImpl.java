package com.miproyecto.proyecto.prueba.pruebaTecnica.service.implementation;

import java.util.List;

import org.springframework.stereotype.Service;

import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.CompararOpcionesDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.OpcionesDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.Opciones;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.Pregunta;
import com.miproyecto.proyecto.prueba.pruebaTecnica.repository.OpcionesRepository;
import com.miproyecto.proyecto.prueba.pruebaTecnica.service.interfaces.OpcionesService;


@Service
public class OpcionesServiceImpl implements OpcionesService {
    private final OpcionesRepository opcionesRepository;

    public OpcionesServiceImpl(OpcionesRepository opcionesRepository) {
        this.opcionesRepository = opcionesRepository;
    }

    @Override
    public Long create(OpcionesDTO opcionDTO, Pregunta pregunta){
        Opciones opcion = mapToEntity(opcionDTO);
        opcion.setPregunta(pregunta);
        return opcionesRepository.save(opcion).getId();
    }

    @Override
    public void create(List<OpcionesDTO> opcionesDTO, Pregunta pregunta){
        
        opcionesRepository.saveAll(
            opcionesDTO.stream()
            .map(opcionDTO -> {
                Opciones opcion = mapToEntity(opcionDTO);
                opcion.setPregunta(pregunta);
                return opcion;
            })
            .toList()
        );
    }

    @Override
    public Long update(OpcionesDTO opcionDTO, Pregunta pregunta){
        return opcionesRepository.save(mapToEntity(opcionDTO)).getId();
    }

    @Override
    public void update(List<OpcionesDTO> opcionesDTO, Pregunta pregunta){
        
        opcionesRepository.saveAll(
            opcionesDTO.stream()
            .map(opcion -> mapToEntity(opcion))
            .toList()
        );
    }

    public OpcionesDTO mapToDTO(Opciones opcion){
        OpcionesDTO opcionDTO = new OpcionesDTO();
        opcionDTO.setId(opcion.getId());
        opcionDTO.setTexto(opcion.getTexto());
        opcionDTO.setOrden(opcion.getOrden());
        return opcionDTO;
    }

    public Opciones mapToEntity(OpcionesDTO opcionDTO){
        Opciones opcion = new Opciones();
        opcion.setId(opcionDTO.getId());
        opcion.setTexto(opcionDTO.getTexto());
        opcion.setOrden(opcionDTO.getOrden());
        return opcion;
    }

    public CompararOpcionesDTO mapDtoToCompararDTO(OpcionesDTO opcion){
        return  new CompararOpcionesDTO(opcion.getTexto(), opcion.getOrden());
    }
}
