package com.miproyecto.proyecto.usuario.dto;

import java.util.List;

public record DataResponse(
    Long id,
    String rolPrincipal, 
    List<String> roles,
    String nombre,
    String imagen 
) {}
