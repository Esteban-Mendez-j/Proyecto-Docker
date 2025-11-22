package com.miproyecto.proyecto.rest;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.model.VacanteDTO;
import com.miproyecto.proyecto.service.VacanteFavoritoService;
import com.miproyecto.proyecto.util.JwtUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.servlet.http.HttpSession;


@RestController
@RequestMapping(value = "/api/vacantes/favoritas", produces = MediaType.APPLICATION_JSON_VALUE)
public class VacanteFavoritaResource {
    private final VacanteFavoritoService vacanteFavoritoService;
    private final JwtUtils jwtUtils;

    public VacanteFavoritaResource(VacanteFavoritoService vacanteFavoritoService, JwtUtils jwtUtils) {
        this.vacanteFavoritoService = vacanteFavoritoService;
        this.jwtUtils = jwtUtils;
    }

    @Operation(
        summary = "Guardar Vacantes en favoritos",
        description = "Guarada una vacante en la seccion de favoritos"
    )
    @ApiResponse(responseCode = "201", description = "vacante guardada correctamente")
    @PostMapping("/add/{idVacante}")
    public ResponseEntity<Map<String, Object>> AgregarVacanteFavorita(
        @PathVariable Long idVacante, 
        @CookieValue(required = true) String jwtToken) {
        Map<String, Object> response = new HashMap<>();
        
        if (jwtToken == null) {
            response.put("status", 401);
            response.put("mensaje", "Inicia sesión");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        response = vacanteFavoritoService.CreateOrRemove(idVacante, idUsuario);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Map<String, Object>> RemoverVacanteFavorita(@PathVariable Long id){
        Map<String, Object> response = new HashMap<>();
        vacanteFavoritoService.delete(id);
        response.put("status", 204);
        response.put("mensaje", "vacante removida correctamente");
        return ResponseEntity.ok(response);
    }

    
@GetMapping("/listar")
public ResponseEntity<Map<String, Object>> listarVacantesFavoritasPerfil(
        HttpSession session,
        @PageableDefault(page = 0, size = 10) Pageable pageable,
        @CookieValue(name = "jwtToken", required = true) String jwtToken) {
    
    Map<String, Object> response = new HashMap<>();

    // 🔹 Validar token JWT
    if (jwtToken == null) {
        response.put("status", 401);
        response.put("mensaje", "Inicia sesión");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

 
    DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
    Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

    
    Page<VacanteDTO> paginaVacantes = vacanteFavoritoService.obtenerVacantesFavoritas(idUsuario, pageable);

     
    Map<String, Object> pageInfo = new HashMap<>();
    pageInfo.put("pageNumber", pageable.getPageNumber());
    pageInfo.put("pageSize", pageable.getPageSize());
    pageInfo.put("sort", pageable.getSort());
    pageInfo.put("offset", pageable.getOffset());
    pageInfo.put("paged", pageable.isPaged());
    pageInfo.put("unpaged", pageable.isUnpaged());

    
    response.put("status", 200);
    response.put("mensaje", "Lista de vacantes favoritas obtenida correctamente");
    response.put("vacantesFavoritas", paginaVacantes.getContent());
    response.put("totalElements", paginaVacantes.getTotalElements());
    response.put("totalPages", paginaVacantes.getTotalPages());
    response.put("pageActual", pageInfo);
    

    return ResponseEntity.ok(response);
}
    
}
