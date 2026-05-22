package com.miproyecto.proyecto.optimizacion.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.miproyecto.proyecto.optimizacion.dto.OptimizationRequest;
import com.miproyecto.proyecto.optimizacion.dto.OptimizationResponse;
import com.miproyecto.proyecto.optimizacion.dto.VacanteOptimizacionDTO;

@Service
public class OptimizationService {
    // Aquí puedes implementar la lógica para llamar a tu API de optimización
    // y procesar los resultados según sea necesario.

@Autowired
private RestClient restClient;



@Value("${optimizer.api.url}")
private String optimizerApiUrl;

// Nuevo método: Recibe el bloque ya procesado y consulta a Pyomo
    public OptimizationResponse optimizePool(List<VacanteOptimizacionDTO> vacantesParaOptimizar) {
        OptimizationRequest request = new OptimizationRequest();
        request.setVacancies(vacantesParaOptimizar);

        return restClient.post()
                .uri(optimizerApiUrl)
                .body(request)
                .retrieve()
                .body(OptimizationResponse.class);
    }


}
