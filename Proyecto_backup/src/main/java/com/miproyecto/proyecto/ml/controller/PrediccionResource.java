package com.miproyecto.proyecto.ml.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.ml.dto.demandaLaboral.CargoPrediccion;
import com.miproyecto.proyecto.ml.dto.demandaLaboral.HorizontePrediccion;
import com.miproyecto.proyecto.ml.dto.demandaLaboral.PrediccionResponse;
import com.miproyecto.proyecto.ml.service.PrediccionService;
import com.miproyecto.proyecto.util.JwtUtils;
import com.miproyecto.proyecto.util.response.ApiResponseBody;
import com.miproyecto.proyecto.util.response.BadRequest;
import com.miproyecto.proyecto.util.response.Meta;
import com.miproyecto.proyecto.util.response.Pagination;

@RestController
@RequestMapping("/api/prediccion")
public class PrediccionResource {

    private final PrediccionService prediccionService;
    private final JwtUtils jwtUtils;

    PrediccionResource(JwtUtils jwtUtils, PrediccionService prediccionService) {
        this.jwtUtils = jwtUtils;
        this.prediccionService = prediccionService;
    }

    @GetMapping("/evaluar/{nvacantes}")
    public ResponseEntity<Map<String, Object>> predecirMatch(
            @PathVariable Long nvacantes,
            @CookieValue(name="jwtToken", required= true) String jwtToken) {

        try {
            Map<String, Object> resultado = new HashMap<>();
            DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
            Long idCandidato = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
            resultado = prediccionService.predecirDesdeComparacion(nvacantes, idCandidato);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("mensaje", e.getMessage() );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/demanda-laboral/simulacion")
    public ResponseEntity<ApiResponseBody<PrediccionResponse>>
    obtenerPredicciones(
        @RequestParam(defaultValue = "0") int pagina,
        @RequestParam(defaultValue = "5") int limite,
        @RequestParam(name = "cargo_name", required = false)
        String cargoName
    ) {

        // Validar parámetros.
        if (pagina < 0 || limite < 1 || limite > 50) {
            throw new BadRequest(
                    "La página debe ser mayor o igual que 0 y el límite debe estar entre 1 y 50.");
        }

        // Obtener los datos simulados.
        List<CargoPrediccion> cargos = prediccionService.crearDatosSimulados();

        // Filtrar por nombre, si se proporcionó cargo_name.
        if (cargoName != null && !cargoName.isBlank()) {
            String filtro = cargoName.trim().toLowerCase(Locale.ROOT);

            cargos = cargos.stream()
                .filter(cargo ->
                    cargo.nombre().toLowerCase(Locale.ROOT)
                        .contains(filtro)
                )
                .toList();
        }

        // Calcular la paginación.
        long totalElementos = cargos.size();

        int totalPaginas = totalElementos == 0
            ? 0
            : (int) Math.ceil(
                (double) totalElementos / limite
            );

        Pageable pageable = PageRequest.of(pagina, limite);

        int inicio = (int) Math.min(
            pageable.getOffset(),
            totalElementos
        );

        int fin = (int) Math.min(
            inicio + limite,
            totalElementos
        );

        List<CargoPrediccion> cargosPagina =
            cargos.subList(inicio, fin);

        // Construir la respuesta de predicción.
        PrediccionResponse data = new PrediccionResponse(
            true,
            "Predicción generada correctamente",
            LocalDateTime.now(),
            new HorizontePrediccion(
                prediccionService.getANIO_PREDICCION(),
                prediccionService.getANIO_PREDICCION()
            ),
            cargosPagina
        );

        // Utilizar el formato estándar del backend.
        Meta meta = new Meta(
            new Pagination(
                totalElementos,
                pageable,
                totalPaginas
            )
        );

        ApiResponseBody<PrediccionResponse> respuesta =
            new ApiResponseBody<>(
                data,
                meta,
                null
            );

        return ResponseEntity.ok(respuesta);
    }
    
}
