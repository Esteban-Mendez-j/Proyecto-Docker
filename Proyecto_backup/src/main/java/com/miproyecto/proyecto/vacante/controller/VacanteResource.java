package com.miproyecto.proyecto.vacante.controller;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.candidato.dto.CandidatoDTO;
import com.miproyecto.proyecto.candidato.service.CandidatoService;
import com.miproyecto.proyecto.util.JwtUtils;
import com.miproyecto.proyecto.vacante.dto.FiltroVacanteDTO;
import com.miproyecto.proyecto.vacante.dto.VacanteDTO;
import com.miproyecto.proyecto.vacante.service.VacanteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Tag(name = "Vacantes", description = "Operaciones relacionadas con la gestión y consulta de vacantes")
@RestController
@RequestMapping(value = "/api/vacantes", produces = MediaType.APPLICATION_JSON_VALUE)
public class VacanteResource {

    private final CandidatoService candidatoService;
    private final VacanteService vacanteService;
    private final JwtUtils jwtUtils;

    public VacanteResource(VacanteService vacanteService, JwtUtils jwtUtils, CandidatoService candidatoService) {
        this.vacanteService = vacanteService;
        this.jwtUtils = jwtUtils;
        this.candidatoService = candidatoService;
    }

    // 🔥 NUEVO: Endpoint para registrar visitas
      
    @Operation(summary = "Registrar visita a vacante", description = "Incrementa el contador de visitas cada vez que se visualiza una vacante")
    @PostMapping("/visita/{nvacantes}")
    public ResponseEntity<Void> registrarVisita(@PathVariable Long nvacantes) {
        vacanteService.incrementarVisitas(nvacantes);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Listar vacantes propias", description = "Devuelve las vacantes creadas por el usuario autenticado (empresa).")
    @GetMapping
    public ResponseEntity<Map<String,Object>> list(
            HttpSession session,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {

        String jwtToken = (String) session.getAttribute("jwtToken");
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

        Map<String, Object> response = vacanteService.findByIdUsuario(idUsuario, pageable);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Buscar vacantes con filtros (empresa)", description = "Filtra las vacantes propias de la empresa autenticada.")
    @PostMapping("/listar")
    public ResponseEntity<Map<String, Object>> listarVacantes(
            HttpSession session,
            @PageableDefault(page = 0, size = 10) Pageable pageable,
            @RequestBody FiltroVacanteDTO filtro) {

        String jwtToken = (String) session.getAttribute("jwtToken");
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        filtro.setIdUsuario(Long.parseLong(jwtUtils.extractUsername(decodedJWT)));
        Long idUsuarioPostulacion = 0L;

        Map<String, Object> response = vacanteService.buscarVacantesConFiltros(idUsuarioPostulacion, filtro, pageable);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Vacantes más populares", description = "Devuelve las vacantes con más postulaciones para la empresa autenticada.")
    @GetMapping("/popular/listar")
    public ResponseEntity<Map<String, Object>> TopVacantes(HttpSession session) {
        String jwtToken = (String) session.getAttribute("jwtToken");
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idEmpresa = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

        List<VacanteDTO> vacantes = vacanteService.TopVacantesPorPostulados(idEmpresa);
        return ResponseEntity.ok(Map.of("vacantes", vacantes));
    }

    @Operation(summary = "Vacantes destacadas", description = "Lista vacantes ordenadas por fecha, sueldo y experiencia (para candidatos e invitados).")
    @GetMapping("/Top/listar")
    public ResponseEntity<Map<String, Object>> TopVacantesPorFechaSueldoExperiencia(
            @CookieValue(required = false) String jwtToken) {
        Long idUsuario = 0L;
        if (jwtToken != null) {
            DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
            idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        }
        List<VacanteDTO> vacantes = vacanteService.TopVacantesPorFechaSueldoExperiencia(idUsuario);
        return ResponseEntity.ok(Map.of("vacantes", vacantes));
    }

    @Operation(summary = "Listar vacantes filtradas", description = "Filtra y ordena por predicción las vacantes activas para candidatos e invitados.")
    @PostMapping("/listar/filtradas")
    public ResponseEntity<Map<String, Object>> listarVacantesFiltradas(
            HttpSession session,
            @PageableDefault(page = 0, size = 10) Pageable pageable,
            @CookieValue(required = false) String jwtToken,
            @RequestBody FiltroVacanteDTO filtro) {

        Long idUsuario = 0L;
        String rol = "INVITADO"; // rol por defecto
        boolean perfilCompleto = false;
        Map<String, Object> response;

        // Si existe token, extraemos info del candidato
        if (jwtToken != null) {
            DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
            idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
            rol = decodedJWT.getClaim("rolPrincipal").asString();
            rol = rol != null ? rol.toUpperCase() : "INVITADO";

            if ("CANDIDATO".equals(rol)) {
                CandidatoDTO candidato = candidatoService.get(idUsuario);
                perfilCompleto = candidato != null &&
                        candidato.getNivelEducativo() != null && !candidato.getNivelEducativo().isBlank() &&
                        candidato.getAptitudes() != null && !candidato.getAptitudes().isEmpty() &&
                        candidato.getExperiencia() != null && !candidato.getExperiencia().isBlank();
            }
        }

        filtro.setActive(true);
        filtro.setRolUser(rol);

        if ("CANDIDATO".equals(rol) && perfilCompleto) {
            response = vacanteService.buscarVacantesConFiltrosAndOrdenByPrediccion(idUsuario, filtro, pageable);
        } else {
            response = vacanteService.buscarVacantesConFiltros(idUsuario, filtro, pageable);
        }
        return ResponseEntity.ok(response);
    }


    @Operation(summary = "Seleccionar vacante", description = "Obtiene la información de una vacante por su ID. Si el usuario es candidato, también valida permisos.")
    @GetMapping("/seleccion/{nvacantes}")
    public ResponseEntity<Map<String, Object>> seleccionVacante(
            @PathVariable Long nvacantes,
            @CookieValue(required = false) String jwtToken) {

        Long idUsuario = 0L;
        if (jwtToken != null) {
            DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
            String rolPrincipal = decodedJWT.getClaim("rolPrincipal").asString();
            if ("CANDIDATO".equals(rolPrincipal)) {
                idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
            }
        }
        VacanteDTO vacanteSeleccionada = vacanteService.get(idUsuario, nvacantes);
        if (vacanteSeleccionada == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "Vacante no encontrada"));
        }
        return ResponseEntity.ok(Map.of("vacanteSeleccionada", vacanteSeleccionada));
    }

    @Operation(summary = "Crear vacante", description = "Crea una nueva vacante asociada al usuario autenticado.")
    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createVacante(
            @RequestPart("vacante") @Valid VacanteDTO vacanteDTO,
            @CookieValue(name = "jwtToken", required = true) String jwtToken,
            @RequestPart(name = "video", required = false) MultipartFile video) {

        Map<String, Object> response = new HashMap<>();
        try {
            DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
            Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

            if (video != null && !video.isEmpty()) {
                String rutaVideo = vacanteService.guardarVideo(video);
                vacanteDTO.setVideoLink(rutaVideo);
            }

            // Actualizar los datos
            vacanteDTO.setIdUsuario(idUsuario);
            vacanteService.create(vacanteDTO);
            return ResponseEntity.ok(Map.of(
                    "status", HttpStatus.CREATED.value(),
                    "mensaje", vacanteDTO.getTipo() + " creada con exito!"
            ));
        } catch (IOException e) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("mensaje", "Error al guardar la el video.");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("mensaje", "Error al Crear la vacante.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Operation(summary = "Obtener vacante", description = "Obtiene los datos de una vacante específica.")
    @GetMapping("/edit/{nvacantes}")
    public ResponseEntity<VacanteDTO> getVacante(
            @PathVariable Long nvacantes) {
        Long idUsuario = 0L;
        return ResponseEntity.ok(vacanteService.get(idUsuario, nvacantes));
    }

    @Operation(summary = "Actualizar vacante", description = "Actualiza la información de una vacante existente.")
    @PutMapping(value = "/edit/{nvacantes}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateVacante(
            @PathVariable Long nvacantes,
            @RequestPart("vacante") @Valid VacanteDTO vacanteDTO,
            @RequestPart(name = "video", required = false) MultipartFile video,
            @RequestPart(name = "eliminarVideo", required = false) Boolean eliminarVideo) {

        Map<String, Object> response = new HashMap<>();
        try {

            //  Si marcaron eliminar video → elimínalo
            if (Boolean.TRUE.equals(eliminarVideo)) {
                if (vacanteDTO.getVideoLink() != null) {
                    vacanteService.eliminarVideo(vacanteDTO.getVideoLink());
                }
                vacanteDTO.setVideoLink(null);
            }

            // 2️⃣ Si enviaron un video nuevo → reemplazarlo
            else if (video != null && !video.isEmpty()) {

                // si antes ya había uno → eliminarlo
                if (vacanteDTO.getVideoLink() != null) {
                    vacanteService.eliminarVideo(vacanteDTO.getVideoLink());
                }

                String rutaVideo = vacanteService.guardarVideo(video);
                vacanteDTO.setVideoLink(rutaVideo);
            }

            // 3️⃣ Si no enviaron video y no quieren eliminar → mantener el existente

            vacanteService.update(nvacantes, vacanteDTO);

            return ResponseEntity.ok(Map.of(
                    "status", HttpStatus.CREATED.value(),
                    "mensaje", "Vacante actualizada con éxito!"));

        } catch (Exception e) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("mensaje", "Error al actualizar la vacante.");
            System.out.println( e + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Operation(summary = "Cambiar estado de vacante", description = "Activa o desactiva una vacante.")
    @PutMapping("/estado/{idVacante}")
    public ResponseEntity<Void> cambiarEstadoVacante(
            @PathVariable Long idVacante,
            @RequestParam boolean estado) {
        vacanteService.cambiarEstado(idVacante, estado);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Incrementar el numero compartidos", description = "Incrementa en uno cada vez que se comparte una vacante.")
    @PutMapping("/edit/numCompartidos/{idVacante}")
    public  ResponseEntity<Void> incrementNumCompartidos(@PathVariable Long idVacante){
        vacanteService.updateNumCompartidos(idVacante);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/sugerencias")
    public List<String> obtenerSugerencias(@RequestParam String query) {
        if (query == null || query.isEmpty()) {
            return Collections.emptyList();
        }
        return vacanteService.findSugerencias(query.toLowerCase());
    }
    
}   