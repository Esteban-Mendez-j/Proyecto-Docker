package com.miproyecto.proyecto.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.miproyecto.proyecto.enums.ResponseCode;
import com.miproyecto.proyecto.usuario.dto.UsuarioDTO;
import com.miproyecto.proyecto.usuario.service.UsuarioService;
import com.miproyecto.proyecto.util.response.ApiError;
import com.miproyecto.proyecto.util.response.ApiResponseBody;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Autowired
    private UsuarioService usuarioService;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) throws IOException {

        String correo = request.getParameter("username");
        UsuarioDTO usuario = usuarioService.findByCorreo(correo);

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        
        ApiError error = new ApiError();
        if (usuario != null && !usuario.getIsActive()) {
            error.setCode(ResponseCode.BANNED);
            error.setMessage("Tu cuenta esta desabilitada");
        } else {
            error.setCode(ResponseCode.UNAUTORIZED);
            error.setMessage("Correo o contraseña incorrecta");
        }
        ApiResponseBody<ApiError> responseBody = new ApiResponseBody<>(null, null, error);
        new ObjectMapper().writeValue(response.getOutputStream(), responseBody);
    }

}
