package com.miproyecto.proyecto.rest;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.service.VacanteFavoritoService;
import com.miproyecto.proyecto.util.JwtUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping(value = "/api/vacantes/favoritas", produces = MediaType.APPLICATION_JSON_VALUE)
public class VacanteFavoritaResource {
    private VacanteFavoritoService vacanteFavoritoService;
    private final JwtUtils jwtUtils;

    public VacanteFavoritaResource(VacanteFavoritoService vacanteFavoritoService, JwtUtils jwtUtils) {
        this.vacanteFavoritoService = vacanteFavoritoService;
        this.jwtUtils = jwtUtils;
    }

    @Operation(
        summary = "Guardar Vacantes en favoritos",
        description = "Guarada una vacante en la seccion de favoritos"
    )
    @ApiResponse(responseCode = "201", description = "vacante guardada correctamente")
    @PostMapping("/add/{idVacante}")
    public ResponseEntity<Map<String, Object>> AgregarVacanteFavorita(
        @PathVariable(name = "idVacante") Long idVacante, 
        @CookieValue(name = "jwtToken", required = true) String jwtToken) {
        Map<String, Object> response = new HashMap<>();
        
        if (jwtToken == null) {
            response.put("status", 401);
            response.put("mensaje", "Inicia sesión");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        vacanteFavoritoService.Create(idVacante, idUsuario);
        response.put("status", 201);
        response.put("mensaje", "vacante guardada correctamente");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Map<String, Object>> RemoverVacanteFavorita(@PathVariable Long id){
        Map<String, Object> response = new HashMap<>();
        vacanteFavoritoService.delete(id);
        response.put("status", 204);
        response.put("mensaje", "vacante removida correctamente");
        return ResponseEntity.ok(response);
    }
    
}
