package com.miproyecto.proyecto.ml.fuente;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.miproyecto.proyecto.ml.dto.demandaLaboral.CargoPrediccion;

public interface DemandaLaboralFuente {
    List<CargoPrediccion> obtenerCargos();

    default Optional<LocalDateTime> fechaGeneracion() {
        return Optional.empty();
    }
}