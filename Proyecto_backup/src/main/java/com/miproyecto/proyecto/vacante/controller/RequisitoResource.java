package com.miproyecto.proyecto.vacante.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.miproyecto.proyecto.vacante.service.RequisitoService;


@RestController 
@RequestMapping(value = "/api/requisito", produces = MediaType.APPLICATION_JSON_VALUE)
public class RequisitoResource {

    private RequisitoService RequisitoService;

    public RequisitoResource(RequisitoService RequisitoService) {
        this.RequisitoService = RequisitoService;
    }

    @GetMapping("/search")
    public List<String> findNameRequisitoByName(@RequestParam String nombre) {
        
        return RequisitoService.findAllNombreRequisitoByNombre(nombre);
    }
    
}
