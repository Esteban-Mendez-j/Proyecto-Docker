package com.miproyecto.proyecto.rest;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.miproyecto.proyecto.model.CandidatoResumenDTO;
import com.miproyecto.proyecto.model.PostuladoDTO;
import com.miproyecto.proyecto.model.VacanteDTO;
import com.miproyecto.proyecto.service.CandidatoService;
import com.miproyecto.proyecto.service.PostuladoService;
import com.miproyecto.proyecto.service.VacanteService;
import com.miproyecto.proyecto.util.JwtUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;

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
    public ResponseEntity<List<PostuladoDTO>> getAllPostulados() {
        return ResponseEntity.ok(postuladoService.findAll());
    }

    @Operation(
        summary = "Listar candidatos postulados a una vacante",
        description = "Permite a una empresa obtener la lista de candidatos que se han postulado a una vacante específica, con filtros opcionales."
    )
    @GetMapping("/lista")
    public ResponseEntity<Map<String, Object>> listaByNvacantes(
        @RequestParam Long nvacantes,
        @RequestParam(required = false) String estado,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaMinima,
        @RequestParam(required = false) String nombreCandidato,
        @PageableDefault(page = 0, size = 10) Pageable pageable,
        @CookieValue(required = false) String jwtToken) {

        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        String rolPrincipal = decodedJWT.getClaim("rolPrincipal").asString();
        VacanteDTO vacante = vacanteService.findByIdUsuarioAndNvacante(idUsuario, nvacantes);
        
        if (vacante == null && rolPrincipal.equalsIgnoreCase("EMPRESA")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Map<String, Object> response = postuladoService.findByNvacantes(nvacantes, estado, fechaMinima, nombreCandidato, pageable);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Listar postulaciones de un candidato",
        description = "Devuelve la lista de postulaciones realizadas por el candidato autenticado, con filtros opcionales."
    )
    @GetMapping("/lista/candidato")
    public ResponseEntity<Map<String, Object>> listaByIdUsuario(
            HttpSession session,
            @PageableDefault(page = 0, size = 10) Pageable pageable,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) LocalDate fechaMinima,
            @RequestParam(required = false) String tituloVacante,
            @RequestParam(required = false) String empresa
    ) {
        String jwtToken = (String) session.getAttribute("jwtToken");
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

        Map<String, Object> response = postuladoService.findByIdUsuario(
            idUsuario, estado, tituloVacante, empresa, fechaMinima, pageable
        );
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Postularse a una vacante",
        description = "Permite a un candidato autenticado postularse a una vacante, verificando que tenga currículum y que no exista una postulación activa previa."
    )
    @PostMapping("/add/{nvacantes}")
    public ResponseEntity<Map<String, Object>> addPostulacion(
            @PathVariable Long nvacantes,
            HttpSession session) throws Exception {

        Map<String, Object> response = new HashMap<>();
        String jwtToken = (String) session.getAttribute("jwtToken");
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

        PostuladoDTO postuladoDTO = postuladoService.findByNvacantesAndIdUsuario(nvacantes, idUsuario);
        if (postuladoDTO != null && postuladoDTO.isActive()) {
            response.put("status", "error");
            response.put("message", "Ya postulaste a esta vacante.");
            return ResponseEntity.badRequest().body(response);
        }

        CandidatoResumenDTO candidatoResumenDTO = candidatoService.getCandidatoResumen(idUsuario);
        if (candidatoResumenDTO.getCurriculo() == null) {
            response.put("status", "info");
            response.put("message", "Debes subir tu currículum para postularte.");
            return ResponseEntity.badRequest().body(response);
        }

        if (postuladoDTO != null) {
            postuladoService.cambiarEstado(postuladoDTO, true);
        } else {
            PostuladoDTO nuevo = new PostuladoDTO();
            nuevo.setCandidato(candidatoResumenDTO);
            postuladoService.create(nuevo, candidatoResumenDTO, nvacantes);
        }

        response.put("status", "success");
        response.put("message", "Postulación realizada con éxito.");
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Obtener una postulación por ID", description = "Devuelve los datos de una postulación específica.")
    @GetMapping("/edit/{nPostulacion}")
    public ResponseEntity<PostuladoDTO> getPostulado(
            @PathVariable final Long nPostulacion) {
        return ResponseEntity.ok(postuladoService.get(nPostulacion));
    }

    @Operation(summary = "Actualizar una postulación", description = "Modifica los datos de una postulación existente.")
    @PutMapping("/edit/{nPostulacion}")
    public ResponseEntity<Long> updatePostulado(
            @PathVariable final Long nPostulacion,
            @RequestBody final PostuladoDTO postuladoDTO) {
        postuladoService.update(nPostulacion, postuladoDTO);
        return ResponseEntity.ok(nPostulacion);
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
