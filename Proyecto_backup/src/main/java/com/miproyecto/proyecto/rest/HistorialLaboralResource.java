package com.miproyecto.proyecto.rest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.model.HistorialLaboralDTO;
import com.miproyecto.proyecto.service.HistorialLaboralService;
import com.miproyecto.proyecto.util.JwtUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Tag(name = "Historial Laboral", description = "Operaciones para gestionar el historial laboral de los candidatos")
@RestController
@RequestMapping(value = "/api/historialLaborals", produces = MediaType.APPLICATION_JSON_VALUE)
public class HistorialLaboralResource {

    private final HistorialLaboralService historialLaboralService;
    private final JwtUtils jwtUtils;

    public HistorialLaboralResource(HistorialLaboralService historialLaboralService, JwtUtils jwtUtils) {
        this.historialLaboralService = historialLaboralService;
        this.jwtUtils = jwtUtils;
    }

    @Operation(
        summary = "Listar todo el historial laboral",
        description = "Devuelve la lista completa de todos los registros de historial laboral.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
        }
    )
    @GetMapping
    public ResponseEntity<List<HistorialLaboralDTO>> getAllHistorialLaborals() {
        return ResponseEntity.ok(historialLaboralService.findAll());
    }

    @Operation(
        summary = "Crear un nuevo historial laboral",
        description = "Registra un nuevo historial laboral para el usuario autenticado.",
        responses = {
            @ApiResponse(responseCode = "201", description = "Historial laboral creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o faltantes"),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado")
        }
    )
    @PostMapping("/add")
    public ResponseEntity<Long> createHistorialLaboral(
            @RequestBody @Valid final HistorialLaboralDTO historialLaboralDTO,
            HttpSession session) {
        String jwtToken = (String) session.getAttribute("jwtToken");
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        historialLaboralDTO.setIdUsuario(idUsuario);
        final Long createdIDHistorial = historialLaboralService.create(historialLaboralDTO);
        return new ResponseEntity<>(createdIDHistorial, HttpStatus.CREATED);
    }

    @Operation(
        summary = "Obtener un historial laboral por ID",
        description = "Devuelve la información de un historial laboral específico.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Historial encontrado"),
            @ApiResponse(responseCode = "404", description = "Historial no encontrado")
        }
    )
    @GetMapping("/edit/{iDHistorial}")
    public ResponseEntity<HistorialLaboralDTO> getHistorialLaboral(
            @Parameter(description = "ID del historial laboral")
            @PathVariable(name = "iDHistorial") final Long iDHistorial) {
        return ResponseEntity.ok(historialLaboralService.get(iDHistorial));
    }

    @Operation(
        summary = "Reemplazar historial laboral",
        description = "Elimina todo el historial laboral actual de un candidato y lo reemplaza por una nueva lista.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Historial reemplazado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
        }
    )
    @PutMapping("/replace/{candidatoId}")
    public ResponseEntity<Void> replaceEstudios(
            @Parameter(description = "ID del candidato cuyos historiales se reemplazarán")
            @PathVariable Long candidatoId,
            @RequestBody List<HistorialLaboralDTO> historial) {
        historialLaboralService.replaceHistorial(candidatoId, historial);
        return ResponseEntity.ok().build();
    }

    @Operation(
        summary = "Actualizar un historial laboral",
        description = "Modifica los datos de un historial laboral existente.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Historial actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Historial no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
        }
    )
    @PutMapping("/edit/{iDHistorial}")
    public ResponseEntity<Long> updateHistorialLaboral(
            @Parameter(description = "ID del historial laboral a actualizar")
            @PathVariable(name = "iDHistorial") final Long iDHistorial,
            @RequestBody @Valid final HistorialLaboralDTO historialLaboralDTO) {
        historialLaboralService.update(iDHistorial, historialLaboralDTO);
        return ResponseEntity.ok(iDHistorial);
    }

    @Operation(
        summary = "Eliminar un historial laboral",
        description = "Elimina un historial laboral de forma permanente por su ID.",
        responses = {
            @ApiResponse(responseCode = "204", description = "Historial eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Historial no encontrado")
        }
    )
    @DeleteMapping("/delete/{iDHistorial}")
    public ResponseEntity<Void> deleteHistorialLaboral(
            @Parameter(description = "ID del historial laboral a eliminar")
            @PathVariable(name = "iDHistorial") final Long iDHistorial) {
        historialLaboralService.delete(iDHistorial);
        return ResponseEntity.noContent().build();
    }
}
