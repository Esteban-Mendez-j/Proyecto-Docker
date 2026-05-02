package com.miproyecto.proyecto.prueba.PruebaResuelta.service.interfaces;

import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.CreatePruebaResueltaDTO;
import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.PruebaResueltaDTO;
import com.miproyecto.proyecto.prueba.PruebaResuelta.dto.UpdatePruebaResueltaDTO;

public interface PruebaResueltaService {

    PruebaResueltaDTO findPruebaResueltaDTOById(Long id);

    Long create(CreatePruebaResueltaDTO CreatePruebaResueltaDTO);

    Long update(UpdatePruebaResueltaDTO updatePruebaResueltaDTO);

    void existById(Long id);

}
