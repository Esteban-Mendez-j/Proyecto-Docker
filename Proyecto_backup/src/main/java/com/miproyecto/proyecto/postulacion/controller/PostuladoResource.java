package com.miproyecto.proyecto.postulacion.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.candidato.dto.CandidatoResumenDTO;
import com.miproyecto.proyecto.candidato.service.CandidatoService;
import com.miproyecto.proyecto.enums.ResponseCode;
import com.miproyecto.proyecto.postulacion.dto.PostuladoDTO;
import com.miproyecto.proyecto.postulacion.service.PostuladoService;
import com.miproyecto.proyecto.util.JwtUtils;
import com.miproyecto.proyecto.util.response.ApiError;
import com.miproyecto.proyecto.util.response.ApiResponseBody;
import com.miproyecto.proyecto.vacante.dto.VacanteDTO;
import com.miproyecto.proyecto.vacante.service.VacanteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Postulados", description = "Operaciones relacionadas con las postulaciones a vacantes")
@RestController
@RequestMapping(value = "/api/postulados", produces = MediaType.APPLICATION_JSON_VALUE)
public class PostuladoResource {

    private final PostuladoService postuladoService;
    private final CandidatoService candidatoService;
    private final JwtUtils jwtUtils;
    private final VacanteService vacanteService;

    public PostuladoResource(PostuladoService postuladoService, CandidatoService candidatoService, JwtUtils jwtUtils,
            VacanteService vacanteService) {
        this.postuladoService = postuladoService;
        this.candidatoService = candidatoService;
        this.jwtUtils = jwtUtils;
        this.vacanteService = vacanteService;
    }

    @Operation(summary = "Obtener todas las postulaciones", description = "Devuelve la lista completa de postulaciones registradas.")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping
    public ResponseEntity<ApiResponseBody<List<PostuladoDTO>>> getAllPostulados() {
        ApiResponseBody<List<PostuladoDTO>> response = new ApiResponseBody<List<PostuladoDTO>>(
            postuladoService.findAll(),
            null,
            null
        );
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Listar candidatos postulados a una vacante",
        description = "Permite a una empresa obtener la lista de candidatos que se han postulado a una vacante específica, con filtros opcionales.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Postulaciones obtenidas correctamente" ), 
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado" ),       
            @ApiResponse(responseCode = "403", description = "Usuario no autorizado" )       
        }
    )
    @GetMapping("/lista")
    public ResponseEntity<ApiResponseBody<List<PostuladoDTO>>> listaByNvacantes(
        @RequestParam Long nvacantes,
        @RequestParam(required = false) String estado,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaMinima,
        @RequestParam(required = false) String nombreCandidato,
        @PageableDefault(page = 0, size = 10) Pageable pageable,
        @CookieValue(required = false) String jwtToken) {

        ApiResponseBody<List<PostuladoDTO>> response = new ApiResponseBody<>();    
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        String rolPrincipal = decodedJWT.getClaim("rolPrincipal").asString();
        VacanteDTO vacante = vacanteService.findByIdUsuarioAndNvacante(idUsuario, nvacantes);
        
        if (vacante == null && rolPrincipal.equalsIgnoreCase("EMPRESA")) {
            ApiError error = new ApiError(ResponseCode.FORBIDDEN, "No puedes acceder a este recurso");
            response.setError(error);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        response = postuladoService.findByNvacantes(nvacantes, estado, fechaMinima, nombreCandidato, pageable);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Listar postulaciones de un candidato",
        description = "Devuelve la lista de postulaciones realizadas por el candidato autenticado, con filtros opcionales.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Postulaciones obtenidas correctamente" ), 
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado" ),       
        }
    )
    @GetMapping("/lista/candidato")
    public ResponseEntity<ApiResponseBody<List<PostuladoDTO>>> listaByIdUsuario(
            @CookieValue(name = "jwtToken") String jwtToken,
            @PageableDefault(page = 0, size = 10) Pageable pageable,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) LocalDate fechaMinima,
            @RequestParam(required = false) String tituloVacante,
            @RequestParam(required = false) String empresa
    ) {
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

        ApiResponseBody<List<PostuladoDTO>> response = postuladoService.findByIdUsuario(
            idUsuario, estado, tituloVacante, empresa, fechaMinima, pageable
        );
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Postularse a una vacante",
        description = "Permite a un candidato autenticado postularse a una vacante, verificando que tenga currículum y que no exista una postulación activa previa.",
        responses = {
            @ApiResponse(responseCode = "201", description = "Postulaciones creada correctamente" ), 
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado" ),       
            @ApiResponse(responseCode = "400", description = "Usuario sin Curriculo subido" ),       
            @ApiResponse(responseCode = "400", description = "Usuario que ya postuló a la vacante" ),       
        }
    )
    @PostMapping("/add/{nvacantes}")
    public ResponseEntity<ApiResponseBody<Long>> addPostulacion(
            @PathVariable Long nvacantes,
            @CookieValue(name = "jwtToken") String jwtToken) throws Exception {

        ApiResponseBody<Long> response = new ApiResponseBody<>();
        ApiError error = new ApiError();        
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        Long idPostulacion = null;

        PostuladoDTO postuladoDTO = postuladoService.findByNvacantesAndIdUsuario(nvacantes, idUsuario);
        if (postuladoDTO != null && postuladoDTO.isActive()) {
            error.setCode(ResponseCode.WARNING);
            error.setMessage("Ya postulaste a esta vacante.");
            response.setError(error);
            return ResponseEntity.badRequest().body(response);
        }

        CandidatoResumenDTO candidatoResumenDTO = candidatoService.getCandidatoResumen(idUsuario);
        if (candidatoResumenDTO.getCurriculo() == null) {
            error.setCode(ResponseCode.WARNING);
            error.setMessage("Debes subir tu currículum para postularte.");
            response.setError(error);
            return ResponseEntity.badRequest().body(response);
        }

        if (postuladoDTO != null) {
            idPostulacion = postuladoService.cambiarEstado(postuladoDTO, true);
        } else {
            PostuladoDTO nuevo = new PostuladoDTO();
            nuevo.setCandidato(candidatoResumenDTO);
            idPostulacion = postuladoService.create(nuevo, candidatoResumenDTO, nvacantes);
        }

        response.setData(idPostulacion);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(
        summary = "Obtener una postulación por ID", 
        description = "Devuelve los datos de una postulación específica.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Postulacion obtenida correctamente" ), 
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado" ),       
        }
    )
    @GetMapping("/edit/{nPostulacion}")
    public ResponseEntity<ApiResponseBody<PostuladoDTO>> getPostulado(
            @PathVariable final Long nPostulacion) {
        ApiResponseBody<PostuladoDTO> response = new ApiResponseBody<PostuladoDTO>(
            postuladoService.get(nPostulacion),
            null, null
        );
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Actualizar una postulación", 
        description = "Modifica los datos de una postulación existente.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Postulacion actualizada correctamente" ), 
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado" ),       
            @ApiResponse(responseCode = "400", description = "Campos invalidos" ),       
        }
    )
    @PutMapping("/edit/{nPostulacion}")
    public ResponseEntity<ApiResponseBody<Long>> updatePostulado(
            @PathVariable final Long nPostulacion,
            @RequestBody final PostuladoDTO postuladoDTO) {
        postuladoService.update(nPostulacion, postuladoDTO);
        ApiResponseBody<Long> response = new ApiResponseBody<>(
            nPostulacion, null, null
        );
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Cancelar o reactivar una postulación", description = "Cambia el estado de una postulación existente.")
    @PatchMapping("/cancelar/{nPostulacion}")
    public ResponseEntity<Void> cancelarPostulado(
            @PathVariable Long nPostulacion,
            @RequestParam Boolean estado,
            @RequestParam(name = "nvacante") Long nvacantes) {

        postuladoService.cancelarPostulacion(nPostulacion, estado, nvacantes);
        return ResponseEntity.noContent().build();
    } 
}
