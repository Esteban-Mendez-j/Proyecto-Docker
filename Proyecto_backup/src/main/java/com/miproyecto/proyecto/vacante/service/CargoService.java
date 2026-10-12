package com.miproyecto.proyecto.vacante.service;


import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.vacante.model.Cargo;
import com.miproyecto.proyecto.vacante.repository.CargoRepository;

public class CargoService {

    final CargoRepository cargoRepository;

    CargoService(CargoRepository cargoRepository) {
        this.cargoRepository = cargoRepository;
    }
    
    public Cargo getCargoByNombre(String nombre){
        return cargoRepository.findCargoByNombre(nombre)
            .orElseThrow(NotFoundException::new);
    }
}
