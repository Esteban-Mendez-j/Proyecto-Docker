package com.miproyecto.proyecto.vacante.service;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.vacante.model.Requisito;
import com.miproyecto.proyecto.vacante.repository.RequisitoRepository;

@Service 
public class RequisitoService {

    private final RequisitoRepository requisitoRepository;

    public RequisitoService(RequisitoRepository requisitoRepository) {
        this.requisitoRepository = requisitoRepository;
    }

    public Requisito findRequisitoByNombre(String nombre){
        return requisitoRepository.findByNombre(nombre)
            .orElseThrow(NotFoundException::new); 
    }
    
    public Set<Requisito> findSetRequisitoByNombre(List<String> nombres){
        return requisitoRepository.findAllByNombreIn(nombres)
            .orElseThrow(NotFoundException::new); 
    }
    

    public List<String> findAllNombreRequisitoByNombre(String nombre){
        if (nombre == null || nombre.isEmpty()) {
            return Collections.emptyList();
        }
        return requisitoRepository.findTop10ByNombreLikeIgnoreCase(nombre.trim()+"%")
                .stream()
                .map(requisito -> requisito.getNombre())
                .toList();
    }
    
}
