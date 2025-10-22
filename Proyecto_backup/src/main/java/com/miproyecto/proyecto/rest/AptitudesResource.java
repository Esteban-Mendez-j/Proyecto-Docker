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

import com.miproyecto.proyecto.model.AptitudesDTO;
import com.miproyecto.proyecto.service.AptitudesService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;


@Tag(name = "Aptitudes", description = "Operaciones para gestionar las aptitudes de un candidato")
@RestController
@RequestMapping(value = "/api/aptitudes", produces = MediaType.APPLICATION_JSON_VALUE)
public class AptitudesResource {

    private final AptitudesService aptitudesService;

    public AptitudesResource(final AptitudesService aptitudesService) {
        this.aptitudesService = aptitudesService;
    }
    
    @Operation(
        summary = "Listar todas las aptitudes",
        description = "Devuelve la lista completa de aptitudes registradas.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Lista de aptitudes obtenida correctamente")
        }
    )
    @GetMapping
    public ResponseEntity<List<AptitudesDTO>> getAllAptitudes() {
        return ResponseEntity.ok(aptitudesService.findAll());
    
    }

    @Operation(
        summary = "Añadir una nueva aptitud",
        description = "Registra una nueva aptitud en el sistema.",
        responses = {
            @ApiResponse(responseCode = "201", description = "Aptitud añadida correctamente"),
            @ApiResponse(responseCode = "400", description = "Error al añadir datos inválidos")
        }
    )
    @PostMapping("/add")
    public ResponseEntity<Long> createAptitud(
            @RequestBody @Valid final AptitudesDTO aptitudesDTO) {
        final Long createdIdAptitud = aptitudesService.create(aptitudesDTO);
        return new ResponseEntity<>(createdIdAptitud, HttpStatus.CREATED);
            }

    @Operation(
        summary = "Obtener aptitudes especificas por su propia ID",
        description = "Devuelve las aptitudes asociadas por su ID.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Aptitudes reemplazadas correctamente"),
            @ApiResponse(responseCode = "400", description = "Error al procesar la solicitud")
        }
    )
    @GetMapping("/edit/{idAptitud}")
    public ResponseEntity<List<AptitudesDTO>> getAptitudes(
        @Parameter(description = "id de usuario y su aptitudes asociadas")
        @PathVariable(name = "idAptitud") final Long idAptitud) {
        return ResponseEntity.ok(aptitudesService.getAptitudesByIdUsuario(idAptitud));
        }
    
    @Operation(
        summary = "reemplazar lista de aptitudes",
        description = "Elimina todas las aptitudes actuales de un candidato y las reemplaza por una nueva lista.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Lista de aptitudes reemplazada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
        }
    )
    @PutMapping("/replace/{candidatoId}")
    public ResponseEntity<Void> replaceAptitudes(
        @Parameter (description = "ID del candidato cuyas aptitudes se reemplazarán")
        @PathVariable (name = "candidatoId") final Long candidatoId,
        @RequestBody @Valid final List<AptitudesDTO> nuevosDTO) {
        aptitudesService.replaceAptitudes(candidatoId, nuevosDTO);
        return ResponseEntity.ok().build();
    }        
    @Operation(
        summary = "Actualizar una aptitud",
        description = "Modifica los datos de una aptitud existente.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Aptitud actualizada correctamente"),
            @ApiResponse(responseCode = "404", description = "Aptitud no encontrada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
        } 
    )
    @PutMapping("/edit/{idAptitud}")
    public ResponseEntity<Void> updateAptitud(  
        @Parameter (description = "ID de la aptitud a modificar")
        @PathVariable (name = "idAptitud") final Long idAptitud,
        @RequestBody @Valid final AptitudesDTO aptitudesDTO) {
        aptitudesService.update(idAptitud, aptitudesDTO);
        return ResponseEntity.ok().build();
    }

        @Operation(
        summary = "Eliminar una aptitud",
        description = "Elimina permanentemente una aptitud por su ID.",
        responses = {
            @ApiResponse(responseCode = "204", description = "Aptitud eliminada correctamente"),
            @ApiResponse(responseCode = "404", description = "Aptitud no encontrado")
        }
    )
    @DeleteMapping("/delete/{idAptitud}")
    public ResponseEntity<Void> deleteAptitud(
            @Parameter(description = "ID de la Aptitud a eliminar")
            @PathVariable(name = "idAptitud") final Long idAptitud) {
        aptitudesService.delete(idAptitud);
        return ResponseEntity.noContent().build();
    }
}


