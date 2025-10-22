package com.miproyecto.proyecto.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.miproyecto.proyecto.model.UsuarioDTO;
import com.miproyecto.proyecto.service.UsuarioService;
import com.miproyecto.proyecto.util.JwtUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
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
    public ResponseEntity<Map<String, Object>> getRol(
            @CookieValue(name = "jwtToken", required = false) String jwtToken,
            HttpSession session) {

        Map<String, Object> response = new HashMap<>();
        if (jwtToken == null) {
            response.put("rolPrincipal", "ROLE_INVITADO");
            response.put("roles", List.of("ROLE_INVITADO"));
            return ResponseEntity.ok(response);
        }
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        if (decodedJWT == null) {
            response.put("rolPrincipal", "ROLE_INVITADO");
            response.put("roles", List.of("ROLE_INVITADO"));
            return ResponseEntity.ok(response);
        }

        List<String> roles = decodedJWT.getClaim("authorities").asList(String.class);
        String rolPrincipal = decodedJWT.getClaim("rolPrincipal").asString();

        response.put("rolPrincipal", rolPrincipal);
        response.put("id", Long.parseLong(jwtUtils.extractUsername(decodedJWT)));
        response.put("roles", roles);
        return ResponseEntity.ok(response);
    }


    @Operation(summary = "Nombre e imagen del Usuario",
        description = "Devuelve el nombre e imagen del usuario"
    )
    @GetMapping("/datos")
    public  ResponseEntity<Map<String, Object>> obtenerImagenYNombre(
        @CookieValue(name = "jwtToken", required = false) String jwtToken){
        
        Map<String, Object> response = new HashMap<>();
        Long id = 0L;

        if(jwtToken == null){
            response.put("status", HttpStatus.NOT_FOUND.value());
            response.put("mensaje", "No ha iniciado sesion");
            return ResponseEntity.ok(response);
        }

        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        id = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

        UsuarioDTO usuarioDTO = usuarioService.get(id);
        response.put("status", HttpStatus.OK.value());
        response.put("nombre", usuarioDTO.getNombre());
        response.put("imagen", usuarioDTO.getImagen());
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Crear un nuevo usuario",
        description = "Crea un nuevo usuario en el sistema."
    )
    @ApiResponse(responseCode = "201", description = "Usuario creado con éxito")
    @PostMapping("/add")
    public ResponseEntity<Long> createUsuario(@RequestBody @Valid final UsuarioDTO usuarioDTO) {
        final Long createdIdUsuario = usuarioService.create(usuarioDTO);
        return new ResponseEntity<>(createdIdUsuario, HttpStatus.CREATED);
    }

    @Operation(
        summary = "Obtener usuario por ID",
        description = "Devuelve los datos de un usuario específico."
    )
    @GetMapping("/edit/{idUsuario}")
    public ResponseEntity<UsuarioDTO> getUsuario(
            @PathVariable(name = "idUsuario") final Long idUsuario) {
        return ResponseEntity.ok(usuarioService.get(idUsuario));
    }

    @Operation(
        summary = "Actualizar un usuario",
        description = "Actualiza los datos de un usuario existente."
    )
    @PutMapping("/edit/{idUsuario}")
    public ResponseEntity<Long> updateUsuario(
            @PathVariable(name = "idUsuario") final Long idUsuario,
            @RequestBody @Valid final UsuarioDTO usuarioDTO) {
        usuarioService.update(idUsuario, usuarioDTO);
        return ResponseEntity.ok(idUsuario);
    }

    @Operation(
        summary = "Eliminar un usuario",
        description = "Elimina un usuario del sistema."
    )
    @ApiResponse(responseCode = "204", description = "Usuario eliminado correctamente")
    @DeleteMapping("/delete/{idUsuario}")
    public ResponseEntity<Void> deleteUsuario(
            @PathVariable(name = "idUsuario") final Long idUsuario) {
        usuarioService.delete(idUsuario);
        return ResponseEntity.noContent().build();
    }
}
