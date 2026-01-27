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
import com.miproyecto.proyecto.candidato.dto.EstudioDTO;
import com.miproyecto.proyecto.candidato.service.EstudioService;
import com.miproyecto.proyecto.util.JwtUtils;
import com.miproyecto.proyecto.util.response.ApiResponseBody;

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
    public ResponseEntity<ApiResponseBody<List<EstudioDTO>>> getAllEstudios() {
        ApiResponseBody<List<EstudioDTO>> response = new ApiResponseBody<>(estudioService.findAll(), null, null);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Crear un nuevo estudio",
        description = "Registra un nuevo estudio en el sistema.",
        responses = {
            @ApiResponse(responseCode = "201", description = "Estudio creado correctamente, devuelve el id del estudio creado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
        }
    )
    @PostMapping("/add")
    public ResponseEntity<ApiResponseBody<Long>> createEstudio(
            @RequestBody @Valid final EstudioDTO estudioDTO,
            @CookieValue(name="jwtToken") String jwtToken) {

        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        estudioDTO.setIdUsuario(idUsuario);
        ApiResponseBody<Long> response = new ApiResponseBody<>(estudioService.create(estudioDTO), null, null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
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
    public ResponseEntity<ApiResponseBody<EstudioDTO>> getEstudio(
            @Parameter(description = "ID del estudio a consultar")
            @PathVariable final Long idEstudio,
            @CookieValue(name="jwtToken") String jwtToken) {
        jwtUtils.validateToken(jwtToken);        
        ApiResponseBody<EstudioDTO> response = new ApiResponseBody<>(estudioService.get(idEstudio), null, null);
        return ResponseEntity.ok(response);
    }
    

    @Operation(
        summary = "Actualizar un estudio",
        description = "Modifica los datos de un estudio existente.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Estudio actualizado correctamente, devuelve el id del estudio"),
            @ApiResponse(responseCode = "404", description = "Estudio no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
        }
    )
    @PutMapping("/edit/{idEstudio}")
    public ResponseEntity<ApiResponseBody<Long>> updateEstudio(
            @Parameter(description = "ID del estudio a actualizar")
            @PathVariable final Long idEstudio,
            @RequestBody @Valid final EstudioDTO estudioDTO,
            @CookieValue(name="jwtToken") String jwtToken) {
        jwtUtils.validateToken(jwtToken);          
        estudioService.update(idEstudio, estudioDTO);
        ApiResponseBody<Long> response = new ApiResponseBody<>(idEstudio, null, null);
        return ResponseEntity.ok(response);
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
    public ResponseEntity<ApiResponseBody<Long>> cambiarVisibilidad(
        @PathVariable final Boolean estado,
        @PathVariable final Long idEstudio,
        @CookieValue(name = "jwtToken") String jwtToken
    ) {
        jwtUtils.validateToken(jwtToken);
        estudioService.cambiarVisibilidad(estado, idEstudio); 
        ApiResponseBody<Long> response = new ApiResponseBody<>(idEstudio, null, null);
        return ResponseEntity.ok(response);
    }
}
