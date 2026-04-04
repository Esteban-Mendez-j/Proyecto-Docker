package com.miproyecto.proyecto.prueba.pruebaTecnica.Controller;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.PruebaTecnicaDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.service.implementation.PruebaTecnicaServiceImpl;
import com.miproyecto.proyecto.util.response.ApiResponseBody;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
 

@RestController
@RequestMapping(value = "/api/prueba/tecnica", produces = MediaType.APPLICATION_JSON_VALUE)
public class PruebaTecnicaResource {

    private PruebaTecnicaServiceImpl pruebaTecnicaService;

    public PruebaTecnicaResource(PruebaTecnicaServiceImpl pruebaTecnicaService) {
        this.pruebaTecnicaService = pruebaTecnicaService;
    }

    @GetMapping
    public ResponseEntity<ApiResponseBody<PruebaTecnicaDTO>> getPruebaTecnica(
            @RequestParam(name = "idPrueba", required = false ) Long id, 
            @RequestParam(name = "idVacante", required = false) Long idVacante) {

        PruebaTecnicaDTO pruebaTecnicaDTO = new PruebaTecnicaDTO();
        if( id != null ){
            pruebaTecnicaDTO = pruebaTecnicaService.getPruebaTecnicaById(id);
        }else{
            pruebaTecnicaDTO = pruebaTecnicaService.getPruebaTecnicaByIdVacanteAndIsActive(idVacante, true);
        }
        
        ApiResponseBody<PruebaTecnicaDTO> response = new ApiResponseBody<>(
            pruebaTecnicaDTO,
            null, null
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponseBody<Long>> crearPrueba(
            @RequestBody PruebaTecnicaDTO pruebaTecnicaDTO) throws JsonProcessingException, NoSuchAlgorithmException {
        
        ApiResponseBody<Long> response = new ApiResponseBody<>(
            pruebaTecnicaService.create(pruebaTecnicaDTO),
            null, null
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED) ;
    }
    
    @PutMapping("/edit")
    public ResponseEntity<ApiResponseBody<Long>> editarPrueba(
            @RequestBody PruebaTecnicaDTO pruebaTecnicaDTO) throws JsonProcessingException, NoSuchAlgorithmException {
        
        ApiResponseBody<Long> response = new ApiResponseBody<>(
            pruebaTecnicaService.update(pruebaTecnicaDTO),
            null, null
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED) ;
    }
    
    @PutMapping("/hash")
    public ResponseEntity<ApiResponseBody<HashMap<String, String>>> genrarHash(
            @RequestBody PruebaTecnicaDTO pruebaTecnicaDTO) throws JsonProcessingException, NoSuchAlgorithmException {
        
        HashMap<String, String> map = new HashMap<>();
        String hashEntrada = pruebaTecnicaService.generateSHA256(pruebaTecnicaDTO);
        PruebaTecnicaDTO pruebaGuardada = pruebaTecnicaService.getPruebaTecnicaById(pruebaTecnicaDTO.getId());
        map.put("HashEntrada", hashEntrada);
        map.put("HashBaseDatos", pruebaGuardada.getHash());
        map.put("comparacion", String.valueOf(hashEntrada.equals(pruebaGuardada.getHash())));
        ApiResponseBody<HashMap<String, String>> response = new ApiResponseBody<>(
            map,
            null, null
        );
        return new ResponseEntity<>(response, HttpStatus.OK) ;
    }

    @PutMapping("/estado")
    public ResponseEntity<Void> modificarIsActive (
        @RequestParam Boolean estado, 
        @RequestParam Long id) {

        pruebaTecnicaService.setIsActiveById(estado, id);
        return ResponseEntity.noContent().build();
    }
    
}
