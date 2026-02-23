package com.miproyecto.proyecto.candidato.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.candidato.dto.HistorialLaboralDTO;
import com.miproyecto.proyecto.candidato.service.HistorialLaboralService;
import com.miproyecto.proyecto.util.JwtUtils;
import com.miproyecto.proyecto.util.response.ApiResponseBody;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
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
    public ResponseEntity<ApiResponseBody<List<HistorialLaboralDTO>>> getAllHistorialLaborals() {
        ApiResponseBody<List<HistorialLaboralDTO>> response = new ApiResponseBody<>(historialLaboralService.findAll(), null, null);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Crear un nuevo historial laboral",
        description = "Registra un nuevo historial laboral para el usuario autenticado.",
        responses = {
            @ApiResponse(responseCode = "201", description = "Historial laboral creado correctamente, devuelve el id del Historial"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o faltantes"),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado")
        }
    )
    @PostMapping("/add")
    public ResponseEntity<ApiResponseBody<Long>> createHistorialLaboral(
            @RequestBody @Valid final HistorialLaboralDTO historialLaboralDTO,
            @CookieValue(name="jwtToken") String jwtToken) {
        
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        historialLaboralDTO.setIdUsuario(idUsuario);
        final Long createdIDHistorial = historialLaboralService.create(historialLaboralDTO);
        ApiResponseBody<Long> response = new ApiResponseBody<>(createdIDHistorial, null, null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
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
    public ResponseEntity<ApiResponseBody<HistorialLaboralDTO>> getHistorialLaboral(
            @Parameter(description = "ID del historial laboral")
            @PathVariable final Long iDHistorial,
            @CookieValue(name="jwtToken") String jwtToken) {
        jwtUtils.validateToken(jwtToken);
        ApiResponseBody<HistorialLaboralDTO> response = new ApiResponseBody<>(
            historialLaboralService.get(iDHistorial), 
            null, null
        );
        return ResponseEntity.ok(response);
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
    public ResponseEntity<ApiResponseBody<Long>> updateHistorialLaboral(
            @Parameter(description = "ID del historial laboral a actualizar")
            @PathVariable final Long iDHistorial,
            @RequestBody @Valid final HistorialLaboralDTO historialLaboralDTO,
            @CookieValue(name="jwtToken") String jwtToken) {
        jwtUtils.validateToken(jwtToken);
        historialLaboralService.update(iDHistorial, historialLaboralDTO);
        ApiResponseBody<Long> response = new ApiResponseBody<>(
            iDHistorial, 
            null, null
        );
        return ResponseEntity.ok(response);
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
            @PathVariable final Long iDHistorial) {
        historialLaboralService.delete(iDHistorial);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/cambiar/visibilidad/{estado}/{idHistorial}")
    public ResponseEntity<ApiResponseBody<Long>> cambiarVisibilidad(
        @PathVariable final Boolean estado,
        @PathVariable final Long idHistorial,
        @CookieValue(name = "jwtToken") String jwtToken
    ) {
        jwtUtils.validateToken(jwtToken);
        historialLaboralService.cambiarVisibilidad(estado, idHistorial); 
        ApiResponseBody<Long> response = new ApiResponseBody<>(idHistorial, null, null);
        return ResponseEntity.ok(response);
    }
}
