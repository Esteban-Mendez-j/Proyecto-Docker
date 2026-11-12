package com.miproyecto.proyecto.notificacion.controller;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.miproyecto.proyecto.notificacion.dto.PrediccionPublicadaDTO;
import com.miproyecto.proyecto.usuario.dto.RegistroDispositivoDTO;
import com.miproyecto.proyecto.usuario.service.DispositivoUsuarioService;
import com.miproyecto.proyecto.notificacion.service.NotificacionPushService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionFirebaseController {

    private final DispositivoUsuarioService dispositivoService;
    private final NotificacionPushService notificacionPushService;

    @Value("${notificaciones.internal-secret}")
    private String internalSecret;

    public NotificacionFirebaseController(DispositivoUsuarioService dispositivoService,
            NotificacionPushService notificacionPushService) {
        this.dispositivoService = dispositivoService;
        this.notificacionPushService = notificacionPushService;
    }

    // Registrar o actualizar el dispositivo del usuario autenticado.
    @PostMapping("/dispositivos")
    public ResponseEntity<?> registrarDispositivo(
            @Valid @RequestBody RegistroDispositivoDTO dto,
            Authentication authentication) {

        Long idUsuario = Long.valueOf(authentication.getName());

        dispositivoService.registrar(idUsuario, dto);

        return ResponseEntity.ok(
                Map.of("mensaje", "Dispositivo registrado correctamente"));
    }

    // Desactivar el dispositivo al cerrar sesión o revocar permiso.
    @PostMapping("/dispositivos/desactivar")
    public ResponseEntity<?> desactivarDispositivo(
            @Valid @RequestBody RegistroDispositivoDTO dto,
            Authentication authentication) {

        Long idUsuario = Long.valueOf(authentication.getName());

        dispositivoService.desactivar(idUsuario, dto.getToken());

        return ResponseEntity.ok(
                Map.of("mensaje", "Dispositivo desactivado correctamente"));
    }

    // Endpoint interno llamado por Python.
    @PostMapping("/prediccion-publicada")
    public ResponseEntity<?> prediccionPublicada(
            @RequestHeader(value = "X-Internal-Secret", required = false) String receivedSecret,
            @RequestBody PrediccionPublicadaDTO dto) {

        if (!validarSecreto(receivedSecret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No autorizado"));
        }

        if (!"NUEVA_PREDICCION".equals(dto.getTipo())
                || dto.getEjecucionId() == null
                || dto.getEjecucionId().isBlank()
                || dto.getAnioPredicho() == null) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Datos de predicción inválidos"));
        }

        Map<String, Integer> resultado = notificacionPushService.notificarNuevaPrediccion(
                dto.getEjecucionId(),
                dto.getAnioPredicho());

        return ResponseEntity.ok(resultado);
    }

    private boolean validarSecreto(String receivedSecret) {

        if (receivedSecret == null
                || receivedSecret.isBlank()
                || internalSecret == null
                || internalSecret.isBlank()) {
            return false;
        }

        return MessageDigest.isEqual(
                receivedSecret.getBytes(StandardCharsets.UTF_8),
                internalSecret.getBytes(StandardCharsets.UTF_8));
    }
}