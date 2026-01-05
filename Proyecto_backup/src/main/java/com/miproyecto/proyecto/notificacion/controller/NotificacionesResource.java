package com.miproyecto.proyecto.notificacion.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.enums.EstadoEnvio;
import com.miproyecto.proyecto.notificacion.service.NotificacionService;
import com.miproyecto.proyecto.util.JwtUtils;

@RestController
@RequestMapping(value = "/api/notificaciones", produces = MediaType.APPLICATION_JSON_VALUE)
public class NotificacionesResource {

    private final NotificacionService notificacionService;
    private final JwtUtils jwtUtils;

    public NotificacionesResource(NotificacionService notificacionService, JwtUtils jwtUtils) {
        this.notificacionService = notificacionService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping("/recibidas")
    public ResponseEntity<Map<String, Object>> obtenerNotificacionesRecibidas (
            @CookieValue(name = "jwtToken") String jwtToken,
            @PageableDefault(page = 0, size = 10) Pageable pageable){
        
        Map<String, Object> response = new HashMap<>();

        if(jwtToken == null){
            response.put("status", 401);
            response.put("mensaje", "Inicia sesión");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

        response = notificacionService.findByDestinatarioAndVisible(idUsuario, pageable, true);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recibidas/recientes")
    public ResponseEntity<Map<String, Object>> obtenerNotificacionesRecibidasRecientes (
            @CookieValue(name = "jwtToken") String jwtToken){
        
        Map<String, Object> response = new HashMap<>();

        if(jwtToken == null){
            response.put("status", 401);
            response.put("mensaje", "Inicia sesión");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

        response.put("notificaciones", notificacionService.findByDestinatarioRecientes(idUsuario, true, EstadoEnvio.ENVIADO));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/enviadas")
    public ResponseEntity<Map<String, Object>> obtenerNotificacionesEnviadas(
            @CookieValue(name = "jwtToken") String jwtToken,
            @PageableDefault(page = 0, size = 10) Pageable pageable){
        
        Map<String, Object> response = new HashMap<>();

        if(jwtToken == null){
            response.put("status", 401);
            response.put("mensaje", "Inicia sesión");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

        response = notificacionService.findByRemitenteAndVisible(idUsuario, pageable, true);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/edit/estadoEnvio/{id}") 
    public ResponseEntity<Map<String, Object>> editEstadoEnvio(
        @PathVariable(name = "id", required = true) String idNotificacion){
            
        notificacionService.cambiarEstadoEnvio(EstadoEnvio.RECIBIDO, idNotificacion);
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        return ResponseEntity.ok().body(response);
    }

    /*TODO: verificar si es correcto que solo tenag un solo atributo de visibilidad 
      porque donde alguno de los dos oculte la notificacion el otro no la va a poder ver
    */ 
    @PutMapping("/edit/visibilidad/{id}") 
    public ResponseEntity<Map<String, Object>> editVisibilidad(
        @PathVariable(name = "id", required = true) String idNotificacion,
        @RequestParam(name = "visibilidad") boolean visibilidad){

        notificacionService.cambiarVisible(visibilidad, idNotificacion);
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        return ResponseEntity.ok().body(response);
    }

}
