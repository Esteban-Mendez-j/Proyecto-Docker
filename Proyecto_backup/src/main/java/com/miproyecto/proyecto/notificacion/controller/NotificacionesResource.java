package com.miproyecto.proyecto.notificacion.controller;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.enums.EstadoEnvio;
import com.miproyecto.proyecto.enums.ResponseCode;
import com.miproyecto.proyecto.notificacion.dto.NotificacionDTO;
import com.miproyecto.proyecto.notificacion.service.NotificacionService;
import com.miproyecto.proyecto.util.JwtUtils;
import com.miproyecto.proyecto.util.response.ApiError;
import com.miproyecto.proyecto.util.response.ApiResponseBody;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping(value = "/api/notificaciones", produces = MediaType.APPLICATION_JSON_VALUE)
public class NotificacionesResource {

    private final NotificacionService notificacionService;
    private final JwtUtils jwtUtils;

    public NotificacionesResource(NotificacionService notificacionService, JwtUtils jwtUtils) {
        this.notificacionService = notificacionService;
        this.jwtUtils = jwtUtils;
    }

    @Operation(
        summary = "Todas las notificaciones recibidas",
        description = "Lista de todas las notificaciones recibidas en la cuenta",
        responses = {
            @ApiResponse(responseCode = "200", description = "Notificaciones obtenidas correctamente" ), 
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado" )       
        }
    )
    @GetMapping("/recibidas")
    public ResponseEntity<ApiResponseBody<List<NotificacionDTO>>> obtenerNotificacionesRecibidas (
            @CookieValue(name = "jwtToken") String jwtToken,
            @PageableDefault(page = 0, size = 10) Pageable pageable){
        
        ApiResponseBody<List<NotificacionDTO>> response = new ApiResponseBody<>(); 

        if(jwtToken == null){
            ApiError error = new ApiError(ResponseCode.UNAUTORIZED,"Debes iniciar sesion para esta acción");
            response.setError(error);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

        response = notificacionService.findByDestinatarioAndVisible(idUsuario, pageable, true);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "las notificaciones recibidas recientemente ",
        description = "Lista de maximo 5 notificaciones recibidas recientemente",
        responses = {
            @ApiResponse(responseCode = "200", description = "Notificaciones obtenidas correctamente" ), 
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado" )       
        }
    )
    @GetMapping("/recibidas/recientes")
    public ResponseEntity<ApiResponseBody<List<NotificacionDTO>>> obtenerNotificacionesRecibidasRecientes (
            @CookieValue(name = "jwtToken") String jwtToken){
        
        ApiResponseBody<List<NotificacionDTO>> response = new ApiResponseBody<>(); 

        if(jwtToken == null){
            ApiError error = new ApiError(ResponseCode.UNAUTORIZED,"Debes iniciar sesion para esta acción");
            response.setError(error);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

        response.setData(notificacionService.findByDestinatarioRecientes(idUsuario, true, EstadoEnvio.ENVIADO));
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Todas las notificaciones enviadas",
        description = "Lista de todas las notificaciones enviadas por la cuenta",
        responses = {
            @ApiResponse(responseCode = "200", description = "Notificaciones obtenidas correctamente" ), 
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado" )       
        }
    )
    @GetMapping("/enviadas")
    public ResponseEntity<ApiResponseBody<List<NotificacionDTO>>> obtenerNotificacionesEnviadas(
            @CookieValue(name = "jwtToken") String jwtToken,
            @PageableDefault(page = 0, size = 10) Pageable pageable){
        
        ApiResponseBody<List<NotificacionDTO>> response = new ApiResponseBody<>();

        if(jwtToken == null){
            ApiError error = new ApiError(ResponseCode.UNAUTORIZED,"Debes iniciar sesion para esta acción");
            response.setError(error);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));

        response = notificacionService.findByRemitenteAndVisible(idUsuario, pageable, true);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Cambiar el estado de envio",
        description = "Se modifica el valor del estado de envio de una notificacion",
        responses = {
            @ApiResponse( responseCode = "200", description = "Valor modificado correctamente"),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado" )       
        }
    )
    @PutMapping("/edit/estadoEnvio/{id}") 
    public ResponseEntity<ApiResponseBody<String>> editEstadoEnvio(
        @PathVariable(name = "id", required = true) String idNotificacion){
            
        String id =  notificacionService.cambiarEstadoEnvio(EstadoEnvio.RECIBIDO, idNotificacion);
        ApiResponseBody<String> response = new ApiResponseBody<>(id ,null ,null);
        return ResponseEntity.ok().body(response);
    }

    /*TODO: verificar si es correcto que solo tenag un solo atributo de visibilidad 
      porque donde alguno de los dos oculte la notificacion el otro no la va a poder ver
    */ 
   @Operation(
        summary = "Cambiar el estado de visibilidad",
        description = "Se modifica el valor del estado de visibilidad de una notificacion",
        responses = {
            @ApiResponse( responseCode = "200", description = "Valor modificado correctamente"),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado" )       
        }
    )
    @PutMapping("/edit/visibilidad/{id}") 
    public ResponseEntity<ApiResponseBody<String>> editVisibilidad(
        @PathVariable(name = "id", required = true) String idNotificacion,
        @RequestParam(name = "visibilidad") boolean visibilidad){

        String id = notificacionService.cambiarVisible(visibilidad, idNotificacion);
        ApiResponseBody<String> response = new ApiResponseBody<>( id , null, null);
        return ResponseEntity.ok().body(response);
    }

}
