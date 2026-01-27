package com.miproyecto.proyecto.util;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException.Forbidden;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.miproyecto.proyecto.enums.ResponseCode;
import com.miproyecto.proyecto.util.response.ApiError;
import com.miproyecto.proyecto.util.response.ApiFieldError;
import com.miproyecto.proyecto.util.response.ApiResponseBody;


@RestControllerAdvice // nota la diferencia con @ControllerAdvice
public class GlobalException {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<?> handleNotFoundException(NotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "No se encontró ningún valor", ResponseCode.NOT_FOUND);
    }

    @ExceptionHandler(Forbidden.class)
    public ResponseEntity<?> handleForbidden(Forbidden ex) {
        return buildResponse(HttpStatus.FORBIDDEN, "No tienes permiso para acceder", ResponseCode.FORBIDDEN);
    }

    @ExceptionHandler(JWTVerificationException.class)
    public ResponseEntity<?> handleJWT(JWTVerificationException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "El token es inválido", ResponseCode.UNAUTORIZED);
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<?> handleExpiredJWT(JWTVerificationException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Sesion expirada, inicia nuevamente", ResponseCode.EXPIRED_TOKEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneric(Exception ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor", ResponseCode.ERROR);
    }

    // @ExceptionHandler(TokenExpiredException.class)
    // public String handleExpiredTokenException() {
    //     return "redirect:/?expired=1"; 
    // }

    private ResponseEntity<ApiResponseBody<ApiError>> buildResponse(HttpStatus status, String message, ResponseCode code) {
        ApiError error = new ApiError(code, message);
        ApiResponseBody<ApiError> response = new ApiResponseBody<>(null, null, error);
        return new ResponseEntity<>(response, status);
    }
    
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        List<ApiFieldError> errores = new ArrayList<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->{
            ApiFieldError fieldError = new ApiFieldError(error.getField(), error.getDefaultMessage());
            errores.add(fieldError);
        });
        ApiError error = new ApiError(ResponseCode.VALIDATION_ERROR, "Error de validacion, verifique los datos ingresados", errores);
        ApiResponseBody<List<ApiFieldError>> response  = new ApiResponseBody<>(null, null,error);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

}
