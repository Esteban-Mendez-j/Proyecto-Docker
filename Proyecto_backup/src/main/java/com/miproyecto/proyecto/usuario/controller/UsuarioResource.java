package com.miproyecto.proyecto.usuario.controller;

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
import com.miproyecto.proyecto.usuario.dto.DataResponse;
import com.miproyecto.proyecto.usuario.dto.UsuarioDTO;
import com.miproyecto.proyecto.usuario.service.UsuarioService;
import com.miproyecto.proyecto.util.JwtUtils;
import com.miproyecto.proyecto.util.response.ApiResponseBody;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;


@Tag(name = "Usuarios", description = "Operaciones relacionadas con la gestión de usuarios y sus roles")
@RestController
@RequestMapping(value = "/api/usuarios", produces = MediaType.APPLICATION_JSON_VALUE)
public class UsuarioResource {

    private final UsuarioService usuarioService;
    private final JwtUtils jwtUtils;

    public UsuarioResource(UsuarioService usuarioService, JwtUtils jwtUtils) {
        this.usuarioService = usuarioService;
        this.jwtUtils = jwtUtils;
    }

    @Operation(
        summary = "Obtener rol de usuario",
        description = "Devuelve el rol principal y la lista de roles del usuario autenticado. Si no está autenticado, se devuelve como 'ROLE_INVITADO'."
    )
    @ApiResponse(responseCode = "200", description = "Rol obtenido correctamente")
    @GetMapping("/rol")
    public ResponseEntity<ApiResponseBody<DataResponse>> getRol(
            @CookieValue(required = false) String jwtToken) {

        ApiResponseBody<DataResponse> response = new ApiResponseBody<>();

        if (jwtToken == null) {
            DataResponse data = new DataResponse(
                null, 
                "ROLE_INVITADO", 
                List.of("ROLE_INVITADO"),
                null, null
            );
            response.setData(data);
            return ResponseEntity.ok(response);
        }
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        List<String> roles = decodedJWT.getClaim("authorities").asList(String.class);
        String rolPrincipal = decodedJWT.getClaim("rolPrincipal").asString();
        
        DataResponse data = new DataResponse(
            Long.parseLong(jwtUtils.extractUsername(decodedJWT)),
            rolPrincipal,
            roles,
            null, null
        );
        response.setData(data);
        return ResponseEntity.ok(response);
    }


    @Operation(
        summary = "Datos de session",
        description = "Devuelve el nombre, roles e imagen de la session o usuario autenticado"
    )
    @ApiResponse(responseCode = "200", description = "Datos obtenidos correctamente" )
    @GetMapping("/datos")
    public  ResponseEntity<ApiResponseBody<DataResponse>> obtenerImagenYNombre(
        @CookieValue(name = "jwtToken", required = false) String jwtToken){
        
        ApiResponseBody<DataResponse> response = new ApiResponseBody<>();

        if(jwtToken == null){
            DataResponse data = new DataResponse(
                null, 
                "ROLE_INVITADO", 
                List.of("ROLE_INVITADO"),
                null, null
            );
            response.setData(data);
            return ResponseEntity.ok(response);
        }

        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long id = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        List<String> roles = decodedJWT.getClaim("authorities").asList(String.class);
        String rolPrincipal = decodedJWT.getClaim("rolPrincipal").asString();

        UsuarioDTO usuarioDTO = usuarioService.get(id);
        DataResponse data = new DataResponse(
            id, rolPrincipal, 
            roles, usuarioDTO.getNombre(), 
            usuarioDTO.getImagen()
        );
        response.setData(data);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Crear un nuevo usuario",
        description = "Crea un nuevo usuario en el sistema.",
        responses = {
            @ApiResponse(responseCode = "201", description = "usuario creado con exito"),
            @ApiResponse(responseCode = "400", description = "Campos invalidos")
        }
    )
    @PostMapping("/add")
    public ResponseEntity<ApiResponseBody<UsuarioDTO>> createUsuario(@RequestBody @Valid final UsuarioDTO usuarioDTO) {
        final UsuarioDTO createdUsuario = usuarioService.create(usuarioDTO);
        ApiResponseBody<UsuarioDTO> response = new ApiResponseBody<>(createdUsuario, null, null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(
        summary = "Obtener usuario por ID",
        description = "Devuelve los datos de un usuario específico.",
        responses = {
            @ApiResponse(responseCode = "200", description = "usuario obtenido con exito"),
        }
    )
    @GetMapping("/edit/{idUsuario}")
    public ResponseEntity<ApiResponseBody<UsuarioDTO>> getUsuario(
            @PathVariable final Long idUsuario) {
        ApiResponseBody<UsuarioDTO> response = new ApiResponseBody<>(
            usuarioService.get(idUsuario), null, null
        );
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Actualizar un usuario",
        description = "Actualiza los datos de un usuario existente.",
        responses = {
            @ApiResponse(responseCode = "200", description = "usuario actualizado con exito"),
            @ApiResponse(responseCode = "400", description = "Campos invalidos")
        }
    )
    @PutMapping("/edit/{idUsuario}")
    public ResponseEntity<ApiResponseBody<Long>> updateUsuario(
            @PathVariable final Long idUsuario,
            @RequestBody @Valid final UsuarioDTO usuarioDTO) {
        usuarioService.update(idUsuario, usuarioDTO);
        ApiResponseBody<Long> response = new ApiResponseBody<>(
            idUsuario, null, null
        );
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Eliminar un usuario",
        description = "Elimina un usuario del sistema."
    )
    @ApiResponse(responseCode = "204", description = "Usuario eliminado correctamente")
    @DeleteMapping("/delete/{idUsuario}")
    public ResponseEntity<Void> deleteUsuario(
            @PathVariable final Long idUsuario) {
        usuarioService.delete(idUsuario);
        return ResponseEntity.noContent().build();
    }
}
