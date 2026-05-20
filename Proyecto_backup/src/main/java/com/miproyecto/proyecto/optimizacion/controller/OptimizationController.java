package com.miproyecto.proyecto.optimizacion.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miproyecto.proyecto.optimizacion.dto.OptimizationResponse;
import com.miproyecto.proyecto.optimizacion.dto.VacanteOptimizacionDTO;
import com.miproyecto.proyecto.optimizacion.service.OptimizationService;

@RestController
@RequestMapping("/api/optimizacion/{idCandidato}")
public class OptimizationController {

    @Autowired
    private OptimizationService optimizationService;

    @GetMapping
    public  OptimizationResponse optimize(@PathVariable List<VacanteOptimizacionDTO> idCandidato) {
        return optimizationService.optimizePool(idCandidato);
    }
}
