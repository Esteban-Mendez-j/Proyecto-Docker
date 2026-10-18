package com.miproyecto.proyecto.vacante.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miproyecto.proyecto.vacante.service.CargoService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController 
@RequestMapping(value = "/api/cargo", produces = MediaType.APPLICATION_JSON_VALUE)
public class CargoResource {

    private CargoService cargoService;

    public CargoResource(CargoService cargoService) {
        this.cargoService = cargoService;
    }

    @GetMapping("/search")
    public List<String> findNameCargoByName(@RequestParam String nombre) {

        return cargoService.findAllNombreCargoByNombre(nombre);
    }
    
}
