package com.miproyecto.proyecto.candidato.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.candidato.service.PrediccionService;
import com.miproyecto.proyecto.util.JwtUtils;

@RestController
@RequestMapping("/api/prediccion")
public class PrediccionResource {

    @Autowired
    private PrediccionService prediccionService;
    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping("/evaluar/{nvacantes}")
    public ResponseEntity<Map<String, Object>> predecirMatch(
            @PathVariable Long nvacantes,
            @CookieValue(name="jwtToken", required= true) String jwtToken) {

        try {
            Map<String, Object> resultado = new HashMap<>();
            DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
            Long idCandidato = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
            resultado = prediccionService.predecirDesdeComparacion(nvacantes, idCandidato);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("mensaje", e.getMessage() );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
