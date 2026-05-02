package com.miproyecto.proyecto.prueba.PruebaResuelta.service.interfaces;

import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.RespuestaDTO;

public interface RespuestaService {
    
    RespuestaDTO findById(Long id);

    Long create(RespuestaDTO respuestaDTO);

    Long update(RespuestaDTO respuestaDTO);

    void existById(Long id);
}
