package com.miproyecto.proyecto.vacante.service;


import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.vacante.model.Cargo;
import com.miproyecto.proyecto.vacante.repository.CargoRepository;
@Service 
public class CargoService {

    final CargoRepository cargoRepository;

    CargoService(CargoRepository cargoRepository) {
        this.cargoRepository = cargoRepository;
    }
    
    public Cargo getCargoByNombre(String nombre){
        return cargoRepository.findByNombre(nombre)
            .orElseThrow(NotFoundException::new);
    }

    public List<String> findAllNombreCargoByNombre(String nombre){
        if (nombre == null || nombre.isEmpty()) {
            return Collections.emptyList();
        }
        return cargoRepository.findTop10ByNombreLikeIgnoreCase(nombre.trim()+"%")
                .stream()
                .map(cargo -> cargo.getNombre())
                .toList();
    }
}
