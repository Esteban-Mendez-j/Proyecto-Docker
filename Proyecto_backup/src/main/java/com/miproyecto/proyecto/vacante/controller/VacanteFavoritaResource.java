package com.miproyecto.proyecto.vacante.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.enums.ResponseCode;
import com.miproyecto.proyecto.util.JwtUtils;
import com.miproyecto.proyecto.util.response.ApiError;
import com.miproyecto.proyecto.util.response.ApiResponseBody;
import com.miproyecto.proyecto.util.response.Meta;
import com.miproyecto.proyecto.util.response.Pagination;
import com.miproyecto.proyecto.vacante.dto.VacanteDTO;
import com.miproyecto.proyecto.vacante.service.VacanteFavoritoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;


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
    public ResponseEntity<ApiResponseBody<Long>> AgregarVacanteFavorita(
        @PathVariable Long idVacante, 
        @CookieValue(required = true) String jwtToken) {
        
        ApiResponseBody<Long> response = new ApiResponseBody<>();
        if(jwtToken == null){
            ApiError error = new ApiError(ResponseCode.UNAUTORIZED,"Debes iniciar sesion para esta acción");
            response.setError(error);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        response = vacanteFavoritoService.CreateOrRemove(idVacante, idUsuario);
        return ResponseEntity.ok(response);
    }
     
    @Operation(
        summary = "vacantes favoritas de un usuario ",
        description = "Lista todas vacantes favoritas de un usuario",
        responses = {
            @ApiResponse(responseCode = "200", description = "Vacantes obtenidas correctamente" ), 
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado" )       
        }
    )
    @GetMapping("/listar")
    public ResponseEntity<ApiResponseBody<List<VacanteDTO>>> listarVacantesFavoritasPerfil(
            @PageableDefault(page = 0, size = 10) Pageable pageable,
            @CookieValue(name = "jwtToken", required = true) String jwtToken) {
        
        ApiResponseBody<List<VacanteDTO>> response = new ApiResponseBody<>();

        if(jwtToken == null){
            ApiError error = new ApiError(ResponseCode.UNAUTORIZED,"Debes iniciar sesion para esta acción");
            response.setError(error);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        
        Page<VacanteDTO> paginaVacantes = vacanteFavoritoService.obtenerVacantesFavoritas(idUsuario, pageable);
    
        Pagination pagination = new Pagination(
            paginaVacantes.getTotalElements(),
            paginaVacantes.getPageable(),
            paginaVacantes.getTotalPages()
        );
        Meta meta = new Meta(pagination);
        response.setData(paginaVacantes.getContent());
        response.setMeta(meta);
        return ResponseEntity.ok(response);
    }
    
}
