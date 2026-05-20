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


// public OptimizationResponse optimize(Long idCandidato) {

//     List<Vacante> vacantes = vacanteRepository.findAll();

//      Candidato candidato =
//     candidatoRepository.findById(idCandidato)
//     .orElseThrow(NotFoundException::new); 

//     List<VacanteOptimizacionDTO> vacantesOptimizacion = vacantes.stream().map(vacante -> {

//         VacanteOptimizacionDTO dto = new VacanteOptimizacionDTO();

//         dto.setId(vacante.getNvacantes());
//         try {
//             Map<String, Object> resultado = prediccionService.predecirDesdeComparacion(
//                 vacante.getNvacantes(), idCandidato);
//             double comp = Double.parseDouble(resultado.get("porcentajeMatch").toString())/100.0;
//             dto.setCompatibility(comp);
//         } catch (Exception e) {
//             dto.setCompatibility(0.0);
//         }

//         // try {
//         //     Map<String, Object> prediccion = prediccionService.predecirDesdeComparacion(
//         //         vacante.getNvacantes(), candidatoRepository.findById())))
//         // }

//         // dto.setCompatibility(0.7);

//         dto.setSalary(vacante.getSueldo());

//         dto.setDays(
//             (int) ChronoUnit.DAYS.between(
//                 vacante.getFechaPublicacion(),
//                 LocalDate.now()
//             )
//         );

//         dto.setPostulations(vacante.getTotalpostulaciones());

//         return dto;

//     }).toList();

//    OptimizationRequest request = new OptimizationRequest();
//    request.setVacancies(vacantesOptimizacion);
//    OptimizationResponse response = restClient.post()
//    .uri(optimizerApiUrl)
//    .body(request)
//    .retrieve()
//    .body(OptimizationResponse.class);

//    return response;
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
