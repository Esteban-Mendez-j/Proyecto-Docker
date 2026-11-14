package com.miproyecto.proyecto.vacante.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    public Map<Long, List<String>> obtenerRequisitosPorVacante(
            List<Long> idsVacantes) {

        List<Object[]> resultados = requisitoRepository.findNombresByVacantes(idsVacantes);

        Map<Long, List<String>> requisitosPorVacante = new HashMap<>();

        for (Object[] fila : resultados) {

            Long idVacante = (Long) fila[0];
            String nombreRequisito = (String) fila[1];

            requisitosPorVacante
                    .computeIfAbsent(idVacante, k -> new ArrayList<>())
                    .add(nombreRequisito);
        }

        return requisitosPorVacante;
    }
    
}
