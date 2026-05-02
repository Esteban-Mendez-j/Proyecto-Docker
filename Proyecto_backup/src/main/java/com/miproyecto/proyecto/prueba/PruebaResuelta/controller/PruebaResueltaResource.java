package com.miproyecto.proyecto.prueba.PruebaResuelta.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.CreatePruebaResueltaDTO;
import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.PruebaResueltaDTO;
import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.UpdatePruebaResueltaDTO;
import com.miproyecto.proyecto.prueba.PruebaResuelta.service.interfaces.PruebaResueltaService;
import com.miproyecto.proyecto.util.response.ApiResponseBody;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;



@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/prueba/resuelta", produces = MediaType.APPLICATION_JSON_VALUE )
public class PruebaResueltaResource {
    
    private final PruebaResueltaService pruebaResueltaService;
    
    @GetMapping
    public ResponseEntity<ApiResponseBody<PruebaResueltaDTO>> getPruebaResuelta(
        @RequestParam Long id) {

        ApiResponseBody<PruebaResueltaDTO> response = new ApiResponseBody<>(
            pruebaResueltaService.findPruebaResueltaDTOById(id), null, null
        );

        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponseBody<Long>> createPruebaResuelta(@RequestBody CreatePruebaResueltaDTO createPruebaResueltaDTO){
        
        ApiResponseBody<Long> response = new ApiResponseBody<>(
            pruebaResueltaService.create(createPruebaResueltaDTO), null, null
        );
        return new ResponseEntity<ApiResponseBody<Long>>(response, HttpStatus.CREATED);
    }

    @PutMapping("/edit")
    public ResponseEntity<ApiResponseBody<Long>> updatePruebaResuelta(
        @RequestBody UpdatePruebaResueltaDTO updatePruebaResueltaDTO){
        
        ApiResponseBody<Long> response = new ApiResponseBody<>(
            pruebaResueltaService.update(updatePruebaResueltaDTO), null, null
        );
        return new ResponseEntity<ApiResponseBody<Long>>(response, HttpStatus.CREATED);
    }
    
}
