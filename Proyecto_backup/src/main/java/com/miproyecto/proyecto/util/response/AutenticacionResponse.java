package com.miproyecto.proyecto.util.response;

public record AutenticacionResponse(
        Boolean success,
        String accessToken,
        String tokenType,
        Long expiresIn
) {}