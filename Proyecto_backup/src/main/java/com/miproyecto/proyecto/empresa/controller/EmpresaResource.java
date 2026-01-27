package com.miproyecto.proyecto.empresa.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
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

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.empresa.dto.EmpresaDTO;
import com.miproyecto.proyecto.empresa.service.EmpresaService;
import com.miproyecto.proyecto.enums.ResponseCode;
import com.miproyecto.proyecto.usuario.service.UsuarioService;
import com.miproyecto.proyecto.util.JwtUtils;
import com.miproyecto.proyecto.util.response.ApiError;
import com.miproyecto.proyecto.util.response.ApiResponseBody;
import com.miproyecto.proyecto.validations.ValidationGroups;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.groups.Default;

@Tag(name = "Empresas", description = "Operaciones relacionadas con la gestión de empresas")
@RestController
@RequestMapping(value = "/api/empresas", produces = MediaType.APPLICATION_JSON_VALUE)
public class EmpresaResource {

    private final EmpresaService empresaService;
    private final JwtUtils jwtUtils;
    private UsuarioService usuarioService;


    public EmpresaResource(EmpresaService empresaService, JwtUtils jwtUtils, UsuarioService usuarioService) {
        this.empresaService = empresaService;
        this.jwtUtils = jwtUtils;
        this.usuarioService = usuarioService;
    }

    @Operation(
        summary = "Obtener perfil de la empresa",
        description = "Devuelve la información de una empresa por ID. Si no se proporciona el ID, usa el usuario autenticado.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Perfil encontrado"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "404", description = "Empresa no encontrada")
        }
    )
    @GetMapping("/perfil")
    public ResponseEntity<ApiResponseBody<EmpresaDTO>> mostrarPerfil( Model model,HttpSession session,
            @RequestParam(required = false) Long idUsuario) {        
        ApiResponseBody<EmpresaDTO> response = new ApiResponseBody<>();
        if (idUsuario == null) {
            // Sacamos el ID del usuario que inicia sesion
            String jwtToken = (String) session.getAttribute("jwtToken");
            DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
            idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        } 
        EmpresaDTO empresaDTO = empresaService.get(idUsuario);        
        if (empresaDTO == null) {
            ApiError error = new ApiError(ResponseCode.NOT_FOUND, "No se encontraron los datos de la empresa");
            response.setError(error);
            return new ResponseEntity<>(response , HttpStatus.NOT_FOUND);
        } 
        response.setData(empresaDTO);
        return ResponseEntity.ok(response); 
    }

    @Operation(
        summary = "Crear una empresa",
        description = "Registra una nueva empresa en el sistema.",
        responses = {
            @ApiResponse(responseCode = "201", description = "Empresa creada con éxito"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
        }
    )
    @PostMapping("/add")
    public ResponseEntity<ApiResponseBody<Long>> createEmpresa(@RequestBody @Valid final EmpresaDTO empresaDTO) {
        Long id =  empresaService.create(empresaDTO);
        ApiResponseBody<Long> response = new ApiResponseBody<>(id, null, null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(
        summary = "Obtener empresa por ID",
        description = "Devuelve los datos de una empresa específica.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Empresa encontrada"),
            @ApiResponse(responseCode = "404", description = "Empresa no encontrada")
        }
    )
    @GetMapping("/edit/{idEmpresa}")
    public ResponseEntity<ApiResponseBody<EmpresaDTO>> getEmpresa(
            @PathVariable final Long idEmpresa) {
        ApiResponseBody<EmpresaDTO> response = new ApiResponseBody<>(empresaService.get(idEmpresa),null,null);
        return ResponseEntity.ok(response);
    }


    @Operation(
        summary = "Editar datos de la empresa",
        description = "Permite actualizar información de la empresa, incluyendo imagen de perfil.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Empresa actualizada con éxito"),
            @ApiResponse(responseCode = "400", description = "Error al guardar la imagen o datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
        }
    )
    @PutMapping(value = "/edit/{idUsuario}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponseBody<Long>> editCandidato(
            @RequestPart("empresa") @Validated({ValidationGroups.OnUpdate.class, Default.class}) EmpresaDTO empresaDTO,
            @RequestPart(name = "img", required = false) MultipartFile imagen,
            @CookieValue(required = false) String jwtToken) {

        ApiResponseBody<Long> response = new ApiResponseBody<>();
        ApiError error = new ApiError();
        
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

        try {
            if (imagen != null && !imagen.isEmpty()) {
                if (empresaDTO.getImagen() != null && !empresaDTO.getImagen().isEmpty()) {

                    usuarioService.eliminarArchivo(empresaDTO.getImagen(), true);
                }
                String rutaImagen = usuarioService.guardarArchivo(imagen, idUsuario);
                empresaDTO.setImagen(rutaImagen);
            }

            // Actualizar los datos
            response.setData(empresaService.update(idUsuario, empresaDTO));
            return ResponseEntity.ok(response);

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
        summary = "Eliminar una empresa",
        description = "Borra permanentemente los datos de una empresa.",
        responses = {
            @ApiResponse(responseCode = "204", description = "Empresa eliminada con éxito"),
            @ApiResponse(responseCode = "404", description = "Empresa no encontrada")
        }
    )
    @DeleteMapping("/delete/{idEmpresa}")
    public ResponseEntity<Void> deleteEmpresa(
            @PathVariable final Long idEmpresa) {
        
        empresaService.delete(idEmpresa);
        return ResponseEntity.noContent().build();
    }

}

