package com.miproyecto.proyecto.usuario.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miproyecto.proyecto.usuario.dto.UserAuth;
import com.miproyecto.proyecto.util.JwtUtils;
import com.miproyecto.proyecto.util.response.AutenticacionResponse;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController 
@RequestMapping(value = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE) 
public class Autenticacion {
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public Autenticacion(AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<AutenticacionResponse> postMethodName(
            @RequestBody UserAuth user) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.username(),
                        user.password()));

        String token = jwtUtils.createToken(authentication);

        AutenticacionResponse reponse = new AutenticacionResponse(true, token, 
                jwtUtils.getTypeToken(),
                jwtUtils.getJwtExpirationMs());

        return ResponseEntity.ok(reponse);
    }
    
}
