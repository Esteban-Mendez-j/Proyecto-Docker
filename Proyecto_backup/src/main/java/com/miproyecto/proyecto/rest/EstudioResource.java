package com.miproyecto.proyecto.rest;

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
import com.miproyecto.proyecto.model.EstudioDTO;
import com.miproyecto.proyecto.service.EstudioService;
import com.miproyecto.proyecto.util.JwtUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Estudios", description = "Operaciones para gestionar los estudios de un candidato")
@RestController
@RequestMapping(value = "/api/estudios", produces = MediaType.APPLICATION_JSON_VALUE)
public class EstudioResource {

    private final EstudioService estudioService;
    private final JwtUtils jwtUtils;

    public EstudioResource(final EstudioService estudioService, final JwtUtils jwtUtils) {
        this.estudioService = estudioService;
        this.jwtUtils = jwtUtils;
    }

    @Operation(
        summary = "Listar todos los estudios",
        description = "Devuelve la lista completa de estudios registrados.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Lista de estudios obtenida correctamente")
        }
    )
    @GetMapping
    public ResponseEntity<List<EstudioDTO>> getAllEstudios() {
        return ResponseEntity.ok(estudioService.findAll());
    }

    @Operation(
        summary = "Crear un nuevo estudio",
        description = "Registra un nuevo estudio en el sistema.",
        responses = {
            @ApiResponse(responseCode = "201", description = "Estudio creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
        }
    )
    @PostMapping("/add")
    public ResponseEntity<Long> createEstudio(
            @RequestBody @Valid final EstudioDTO estudioDTO,
            @CookieValue(name="jwtToken") String jwtToken) {
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        estudioDTO.setIdUsuario(idUsuario);
        final Long createdIdEstudio = estudioService.create(estudioDTO);
        return new ResponseEntity<>(createdIdEstudio, HttpStatus.CREATED);
    }

    @Operation(
        summary = "Obtener un estudio por ID",
        description = "Devuelve la información de un estudio específico.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Estudio encontrado"),
            @ApiResponse(responseCode = "404", description = "Estudio no encontrado")
        }
    )
    @GetMapping("/edit/{idEstudio}")
    public ResponseEntity<EstudioDTO> getEstudio(
            @Parameter(description = "ID del estudio a consultar")
            @PathVariable final Long idEstudio) {
        return ResponseEntity.ok(estudioService.get(idEstudio));
    }

    @Operation(
        summary = "Reemplazar lista de estudios",
        description = "Elimina todos los estudios actuales de un candidato y los reemplaza por una nueva lista.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Lista de estudios reemplazada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
        }
    )
    @PutMapping("/replace/{candidatoId}")
    public ResponseEntity<Void> replaceEstudios(
            @Parameter(description = "ID del candidato cuyos estudios se reemplazarán")
            @PathVariable Long candidatoId,
            @RequestBody List<EstudioDTO> estudios) {
        estudioService.replaceEstudios(candidatoId, estudios);
        return ResponseEntity.ok().build();
    }

    @Operation(
        summary = "Actualizar un estudio",
        description = "Modifica los datos de un estudio existente.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Estudio actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Estudio no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
        }
    )
    @PutMapping("/edit/{idEstudio}")
    public ResponseEntity<Long> updateEstudio(
            @Parameter(description = "ID del estudio a actualizar")
            @PathVariable final Long idEstudio,
            @RequestBody @Valid final EstudioDTO estudioDTO) {
        estudioService.update(idEstudio, estudioDTO);
        return ResponseEntity.ok(idEstudio);
    }

    @Operation(
        summary = "Eliminar un estudio",
        description = "Elimina permanentemente un estudio por su ID.",
        responses = {
            @ApiResponse(responseCode = "204", description = "Estudio eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Estudio no encontrado")
        }
    )
    @DeleteMapping("/delete/{idEstudio}")
    public ResponseEntity<Void> deleteEstudio(
            @Parameter(description = "ID del estudio a eliminar")
            @PathVariable final Long idEstudio) {
        estudioService.delete(idEstudio);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/cambiar/visibilidad/{estado}/{idEstudio}")
    public ResponseEntity<Long> cambiarVisibilidad(
        @PathVariable final Boolean estado,
        @PathVariable final Long idEstudio
    ) {
        estudioService.cambiarVisibilidad(estado, idEstudio); 
        return ResponseEntity.ok(idEstudio);
    }
}
