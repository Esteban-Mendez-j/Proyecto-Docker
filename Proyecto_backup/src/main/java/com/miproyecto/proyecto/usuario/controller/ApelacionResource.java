package com.miproyecto.proyecto.usuario.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.usuario.dto.ApelacionDTO;
import com.miproyecto.proyecto.usuario.service.ApelacionService;
import com.miproyecto.proyecto.util.JwtUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Tag(name = "Apelacion", description = "Operaciones para gestionar apelaciones de usuarios, revisión de sanciones y solicitudes relacionadas")
@RestController
@RequestMapping(value = "/api/apelacion", produces = MediaType.APPLICATION_JSON_VALUE)
public class ApelacionResource {

    private final ApelacionService apelacionService;
    private final JwtUtils jwtUtils;

    public ApelacionResource(ApelacionService apelacionService, JwtUtils jwtUtils) {
        this.apelacionService = apelacionService;
        this.jwtUtils = jwtUtils;
    }

    @Operation(summary = "Lista todas las apelaciones (solo admin)", description = "Devuelve todas las apelaciones registradas en el sistema. Solo para administradores.")
    @GetMapping("/admin/list")
    public ResponseEntity<List<ApelacionDTO>> getAllApelacions() {
        return ResponseEntity.ok(apelacionService.findAll());
    }

    @Operation(summary = "Lista apelaciones del usuario autenticado", description = "Devuelve las apelaciones asociadas al usuario autenticado mediante su token JWT.")
    @GetMapping("/list")
    public ResponseEntity<List<ApelacionDTO>> list(Model model, HttpSession session) {
        String jwtToken = (String) session.getAttribute("jwtToken");
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

        List<ApelacionDTO> apelaciones = apelacionService.findByUsuarioId(idUsuario);
        return ResponseEntity.ok(apelaciones);
    }

    @Operation(summary = "Obtener apelación por ID para cambiar estado", description = "Obtiene los detalles de una apelación para su posterior cambio de estado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Apelación encontrada"),
            @ApiResponse(responseCode = "404", description = "Apelación no encontrada")
    })
    @GetMapping("/cambiarEstado/{idApelacion}")
    public ResponseEntity<ApelacionDTO> cambiarEstado(
            @Parameter(description = "ID de la apelación") @PathVariable final Long idApelacion,
            Model model) {
        ApelacionDTO apelacionDTO = apelacionService.get(idApelacion);

        if (apelacionDTO == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(apelacionDTO);
    }

    @Operation(summary = "Cambia el estado de una apelación", description = "Modifica el estado de una apelación existente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estado cambiado correctamente"),
            @ApiResponse(responseCode = "404", description = "Apelación no encontrada")
    })
    @PostMapping("/cambiarEstado/{idApelacion}")
    public ResponseEntity<Long> cambiarEstado(
            @Parameter(description = "ID de la apelación") @PathVariable final Long idApelacion,
            @Parameter(description = "Nuevo estado de la apelación") @RequestParam final String estado,
            RedirectAttributes redirectAttributes) {

        ApelacionDTO apelacionDTO = apelacionService.get(idApelacion);

        if (apelacionDTO == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        apelacionDTO.setEstado(estado);
        apelacionService.update(idApelacion, apelacionDTO);
        return ResponseEntity.ok(idApelacion);
    }

    @Operation(summary = "Crear una nueva apelación", description = "Crea una apelación a partir de los datos enviados en el cuerpo de la solicitud.")
    @ApiResponse(responseCode = "201", description = "Apelación creada correctamente")
    @PostMapping("/add")
    public ResponseEntity<Long> createApelacion(
            @RequestBody @Valid final ApelacionDTO apelacionDTO) {
        final Long createdId = apelacionService.create(apelacionDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @Operation(summary = "Obtener apelación por ID", description = "Devuelve los detalles de una apelación específica.")
    @GetMapping("/edit/{id}")
    public ResponseEntity<ApelacionDTO> getApelacion(
            @Parameter(description = "ID de la apelación") @PathVariable final Long id) {
        return ResponseEntity.ok(apelacionService.get(id));
    }

    @Operation(summary = "Actualizar apelación", description = "Modifica una apelación existente usando su ID.")
    @PutMapping("/edit/{id}")
    public ResponseEntity<Long> updateApelacion(
            @Parameter(description = "ID de la apelación") @PathVariable final Long id,
            @RequestBody @Valid final ApelacionDTO apelacionDTO) {
        apelacionService.update(id, apelacionDTO);
        return ResponseEntity.ok(id);
    }

    @Operation(summary = "Eliminar apelación", description = "Elimina una apelación existente usando su ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteApelacion(
            @Parameter(description = "ID de la apelación") @PathVariable final Long id) {
        apelacionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
