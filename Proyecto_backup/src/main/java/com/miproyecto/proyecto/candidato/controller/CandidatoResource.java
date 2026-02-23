package com.miproyecto.proyecto.candidato.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
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

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.candidato.dto.CandidatoDTO;
import com.miproyecto.proyecto.candidato.dto.EstudioDTO;
import com.miproyecto.proyecto.candidato.dto.HistorialLaboralDTO;
import com.miproyecto.proyecto.candidato.service.CandidatoService;
import com.miproyecto.proyecto.candidato.service.EstudioService;
import com.miproyecto.proyecto.candidato.service.HistorialLaboralService;
import com.miproyecto.proyecto.enums.ResponseCode;
import com.miproyecto.proyecto.postulacion.dto.PostuladoDTO;
import com.miproyecto.proyecto.postulacion.service.PostuladoService;
import com.miproyecto.proyecto.usuario.service.UsuarioService;
import com.miproyecto.proyecto.util.JwtUtils;
import com.miproyecto.proyecto.util.response.ApiError;
import com.miproyecto.proyecto.util.response.ApiResponseBody;
import com.miproyecto.proyecto.validations.ValidationGroups;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.groups.Default;

@Tag(name = "Candidatos", description = "Operaciones relacionadas con la gestión de candidatos")

@RestController
@RequestMapping(value = "/api/candidatos", produces = MediaType.APPLICATION_JSON_VALUE)
public class CandidatoResource {
    
    private final CandidatoService candidatoService;
    private final JwtUtils jwtUtils;
    private final PostuladoService postuladoService;
    private final EstudioService estudioService;
    private final HistorialLaboralService historialLaboralService;
    private final UsuarioService usuarioService; 

    public CandidatoResource(CandidatoService candidatoService, JwtUtils jwtUtils, PostuladoService postuladoService,
            EstudioService estudioService, HistorialLaboralService historialLaboralService,
            UsuarioService usuarioService) {
        this.candidatoService = candidatoService;
        this.jwtUtils = jwtUtils;
        this.postuladoService = postuladoService;
        this.estudioService = estudioService;
        this.historialLaboralService = historialLaboralService;
        this.usuarioService = usuarioService;
    }
    record PerfilResponse(
        CandidatoDTO candidato,
        List<EstudioDTO> estudios,
        List<HistorialLaboralDTO> historialLaboral
    ) {}

    @Operation(
        summary = "Mostrar perfil de candidato",
        description = "Obtiene la información completa del perfil de un candidato, incluyendo estudios e historial laboral. Si no se especifica un ID de usuario, se obtiene del token JWT en sesión."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Perfil encontrado"),
        @ApiResponse(responseCode = "401", description = "Token de sesión no encontrado"),
        @ApiResponse(responseCode = "404", description = "Candidato o postulación no encontrada"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/perfil")
    public ResponseEntity<ApiResponseBody<PerfilResponse>> mostrarPerfil(
        @RequestParam(required = false) Long idUsuario,
        @RequestParam(required = false) Long nPostulacion,
        @CookieValue(name = "jwtToken") String jwtToken) {

        ApiResponseBody<PerfilResponse> response = new ApiResponseBody<>(); 
        ApiError error = new ApiError();

        String rol = null; 
        try {
            // 1. Obtener ID del token si no viene por parámetro
            if (idUsuario == null) {
                if (jwtToken == null) {
                    error.setCode(ResponseCode.UNAUTORIZED);
                    error.setMessage("El usuario no esta Autenticado");
                    response.setError(error);
                    return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
                }

                DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
                idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
                rol = decodedJWT.getClaim("rolPrincipal").asString();
            }

            // 2. Validar si tiene permiso de ver la postulación
            if (nPostulacion != null && "EMPRESA".equalsIgnoreCase(rol) ) {
                PostuladoDTO postulado = postuladoService.get(nPostulacion);
                if (postulado == null || postulado.getCandidato() == null) {
                    error.setCode(ResponseCode.WARNING);
                    error.setMessage("Postulación no encontrada o inválida");
                    response.setError(error);
                    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                }
                if (!postulado.getCandidato().getId().equals(idUsuario)) {
                    error.setCode(ResponseCode.WARNING);
                    error.setMessage("No tienes permiso para acceder");
                    return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
                }
            }

            // 3. Obtener candidato
            CandidatoDTO candidatoDTO = candidatoService.get(idUsuario);
            if (candidatoDTO == null) {
                error.setCode(ResponseCode.WARNING);
                error.setMessage("Candidato no encontrado");
                response.setError(error);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            PerfilResponse data = new PerfilResponse(
                candidatoDTO, 
                estudioService.getEstudiosByIdUsuarioAndVisible(idUsuario, true), 
                historialLaboralService.getHistorialByIdUsuarioAndVisible(idUsuario, true)
            );
            response.setData(data);
            return ResponseEntity.ok(response);

        }catch (TokenExpiredException expired){
            error.setCode(ResponseCode.EXPIRED_TOKEN);
            error.setMessage("Sesion expirada, inicia nuevamente");
            response.setError(error);
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        } 
        catch (Exception e) {
            error.setCode(ResponseCode.ERROR);
            error.setMessage(e.getMessage());
            response.setError(error);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(
        summary = "Crear nuevo candidato",
        description = "Crea un nuevo registro de candidato a partir de los datos enviados y devuelve el id."
    )
    @ApiResponse(responseCode = "201", description = "Candidato creado correctamente. Devuelve el ID del candidato.")
    @PostMapping("/add")
    public ResponseEntity<ApiResponseBody<Long>> createCandidato(@RequestBody  @Valid  CandidatoDTO candidatoDTO) {
        Long id = candidatoService.create(candidatoDTO);
        ApiResponseBody<Long> response = new ApiResponseBody<>(id, null, null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(
        summary = "Obtener candidato por ID",
        description = "Devuelve la información de un candidato específico."
    )
    @ApiResponse(responseCode = "200", description = "Devuelve la informacion del candidato.")
    @GetMapping("/edit/{idUsuario}")
    public ResponseEntity<ApiResponseBody<CandidatoDTO>> getCandidato(
            @PathVariable final Long idUsuario) {
        ApiResponseBody<CandidatoDTO> response = new ApiResponseBody<>(
            candidatoService.get(idUsuario), 
            null, null
        );
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Editar candidato (con archivos)",
        description = "Permite actualizar los datos de un candidato, incluyendo imagen de perfil y currículum en PDF."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Candidato actualizado correctamente."),
        @ApiResponse(responseCode = "400", description = "Error al actualizar el candidato."),
        @ApiResponse(responseCode = "500", description = "Error inesperado del servidor.")
    })
    @PutMapping(value = "/edit/{idUsuario}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponseBody<ApiError>> editCandidato(
            @RequestPart("candidato") @Validated({ValidationGroups.OnUpdate.class, Default.class}) CandidatoDTO candidatoDTO,
            @RequestPart(name = "img", required = false) MultipartFile imagen,
            @RequestPart(name = "pdf", required = true) MultipartFile curriculo) {

        ApiResponseBody<ApiError> response = new ApiResponseBody<>();
        ApiError error = new ApiError();
        Long idUsuario = candidatoDTO.getIdUsuario();

        try {
            
            if (imagen != null && !imagen.isEmpty()) {
                if (candidatoDTO.getImagen() != null && !candidatoDTO.getImagen().isEmpty()) {

                    usuarioService.eliminarArchivo(candidatoDTO.getImagen(), true);
                }
                String rutaImagen = usuarioService.guardarArchivo(imagen, idUsuario);
                candidatoDTO.setImagen(rutaImagen);
            }

            // Verificar si se ha proporcionado un nuevo curriculo
            if (curriculo != null && !curriculo.isEmpty()) {
                if (candidatoDTO.getCurriculo() != null && !candidatoDTO.getCurriculo().isEmpty() ) {
                    usuarioService.eliminarArchivo(candidatoDTO.getCurriculo(), false);
                }
                String rutacurriculo = usuarioService.guardarArchivo(curriculo, idUsuario);
                candidatoDTO.setCurriculo(rutacurriculo);
            }
            // Actualizar los datos
            candidatoService.update(idUsuario, candidatoDTO);
            return ResponseEntity.noContent().build();

        } catch (IOException e) {
            error.setCode(ResponseCode.ERROR);
            error.setMessage("Error al guardar la imagen.");
            response.setError(error);
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            error.setCode(ResponseCode.ERROR);
            error.setMessage(e.getMessage());
            response.setError(error);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @Operation(
        summary = "Eliminar candidato",
        description = "Elimina un candidato del sistema usando su ID."
    )
    @DeleteMapping("/delete/{idCandidato}")
    public ResponseEntity<Void> deleteCandidato(
            @PathVariable final Long idCandidato) {
        candidatoService.delete(idCandidato);
        return ResponseEntity.noContent().build();
    }

    //TODO: Falta terminar este metodo
    @PostMapping("/registro/automatio")
    public ResponseEntity<ApiResponseBody<Long>> postMethodName( 
        @RequestPart(name = "pdf", required = true) MultipartFile curriculo) {
        ApiResponseBody<Long> response = new ApiResponseBody<>();
        try {
            
        } catch (Exception e) {
            
        }
        
        return ResponseEntity.ok(response);
    }
    
}
