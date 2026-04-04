package com.miproyecto.proyecto.prueba.pruebaTecnica.service.interfaces;

import java.security.NoSuchAlgorithmException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.PruebaTecnicaDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.PruebaTecnica;

public interface PruebaTecnicaService {
    
    PruebaTecnicaDTO findDtoById(Long id);

    PruebaTecnica findEntityById(Long id);

    Long create(PruebaTecnicaDTO pruebaTecnicaDTO) throws JsonProcessingException, NoSuchAlgorithmException;

    Long update(PruebaTecnicaDTO pruebaTecnicaDTO) throws JsonProcessingException, NoSuchAlgorithmException;

    PruebaTecnicaDTO getPruebaTecnicaById(Long id);

    PruebaTecnicaDTO getPruebaTecnicaByIdVacanteAndIsActive(Long idVacante, Boolean isActive);
}
