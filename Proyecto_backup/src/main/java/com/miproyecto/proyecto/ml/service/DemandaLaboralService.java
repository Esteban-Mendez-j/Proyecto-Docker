package com.miproyecto.proyecto.ml.service;

import java.time.LocalDateTime;
import java.util.IntSummaryStatistics;
import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.miproyecto.proyecto.ml.dto.demandaLaboral.CargoPrediccion;
import com.miproyecto.proyecto.ml.dto.demandaLaboral.HorizontePrediccion;
import com.miproyecto.proyecto.ml.dto.demandaLaboral.PrediccionPeriodo;
import com.miproyecto.proyecto.ml.fuente.DemandaLaboralFuente;
// import de tu excepción BadRequest (ajusta el paquete)
import com.miproyecto.proyecto.util.response.BadRequest;

@Service
public class DemandaLaboralService {

    private final DemandaLaboralFuente fuente;   // aquí se define "fuente"

    public DemandaLaboralService(DemandaLaboralFuente fuente) {
        this.fuente = fuente;                    // Spring lo inyecta
    }

    public Page<CargoPrediccion> obtenerCargos(int pagina, int limite, String cargoName) {
        if (pagina < 0 || limite < 1 || limite > 50) {
            throw new BadRequest(
                "La página debe ser mayor o igual que 0 y el límite debe estar entre 1 y 50.");
        }

        List<CargoPrediccion> cargos = fuente.obtenerCargos();

        if (cargoName != null && !cargoName.isBlank()) {
            String filtro = cargoName.trim().toLowerCase(Locale.ROOT);
            cargos = cargos.stream()
                .filter(c -> c.nombre().toLowerCase(Locale.ROOT).contains(filtro))
                .toList();
        }

        int inicio = (int) Math.min((long) pagina * limite, cargos.size());
        int fin = Math.min(inicio + limite, cargos.size());

        return new PageImpl<>(
            cargos.subList(inicio, fin), PageRequest.of(pagina, limite), cargos.size());
    }

    public HorizontePrediccion horizonte() {
        IntSummaryStatistics stats = fuente.obtenerCargos().stream()
            .flatMap(c -> c.prediccion().stream())
            .mapToInt(PrediccionPeriodo::periodo)
            .summaryStatistics();

        if (stats.getCount() == 0) {
            return null; // no hay predicciones disponibles
        }
        return new HorizontePrediccion(stats.getMin(), stats.getMax());
    }
    
    public LocalDateTime fechaGeneracion() {
    return fuente.fechaGeneracion().orElseGet(LocalDateTime::now);
}
}