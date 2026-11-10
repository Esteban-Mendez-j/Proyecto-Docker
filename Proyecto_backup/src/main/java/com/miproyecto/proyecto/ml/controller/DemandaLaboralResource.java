package com.miproyecto.proyecto.ml.controller;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.miproyecto.proyecto.ml.dto.demandaLaboral.CargoPrediccion;
import com.miproyecto.proyecto.ml.dto.demandaLaboral.PrediccionResponse;
import com.miproyecto.proyecto.ml.service.DemandaLaboralService;
// imports de ApiResponseBody, Meta y Pagination (ajusta a tus paquetes)
import com.miproyecto.proyecto.util.response.ApiResponseBody;
import com.miproyecto.proyecto.util.response.Meta;
import com.miproyecto.proyecto.util.response.Pagination;

@RestController
@RequestMapping("/api/prediccion/demanda-laboral")
public class DemandaLaboralResource {

    private final DemandaLaboralService service;

    public DemandaLaboralResource(DemandaLaboralService service) {
        this.service = service;
    }

    @GetMapping({"", "/simulacion"})
    public ResponseEntity<ApiResponseBody<PrediccionResponse>> obtenerPredicciones(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "5") int limite,
            @RequestParam(name = "cargo_name", required = false) String cargoName) {

        Page<CargoPrediccion> resultado = service.obtenerCargos(pagina, limite, cargoName);

        PrediccionResponse data = new PrediccionResponse(
            true, "Predicción generada correctamente", LocalDateTime.now(),
            service.horizonte(), resultado.getContent());

        Meta meta = new Meta(new Pagination(
            resultado.getTotalElements(), resultado.getPageable(), resultado.getTotalPages()));

        return ResponseEntity.ok(new ApiResponseBody<>(data, meta, null));
    }
}