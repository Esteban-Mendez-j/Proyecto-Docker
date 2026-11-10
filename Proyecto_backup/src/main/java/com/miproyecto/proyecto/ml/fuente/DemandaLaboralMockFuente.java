package com.miproyecto.proyecto.ml.fuente;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.miproyecto.proyecto.ml.dto.demandaLaboral.CargoPrediccion;
import com.miproyecto.proyecto.ml.dto.demandaLaboral.DemandaHistorica;
import com.miproyecto.proyecto.ml.dto.demandaLaboral.PrediccionPeriodo;
import com.miproyecto.proyecto.ml.dto.demandaLaboral.RequisitoPrediccion;

@Component
@ConditionalOnProperty(name = "prediccion.fuente", havingValue = "mock", matchIfMissing = true)
public class DemandaLaboralMockFuente implements DemandaLaboralFuente {

    private static final int ANIO_PREDICCION = 2027;

    @Override
    public List<CargoPrediccion> obtenerCargos() {
        return List.of(
            crearCargo(1, "Desarrollador de software", 850, 15.29, List.of("Python", "Java", "Spring Boot"), 1),
            crearCargo(2, "Analista de datos", 620, 18.50, List.of("Python", "SQL", "Power BI"), 3),
            crearCargo(3, "Desarrollador web", 720, 14.20, List.of("JavaScript", "React", "Git"), 2),
            crearCargo(4, "Ingeniero de datos", 480, 20.10, List.of("SQL", "Python", "Apache Spark"), 4),
            crearCargo(5, "Desarrollador de aplicaciones móviles", 390, 17.30, List.of("Flutter", "Dart", "Firebase"), 5),
            crearCargo(6, "Especialista en ciberseguridad", 350, 22.40, List.of("Linux", "Redes", "SIEM"), 6)
        );
    }

    private CargoPrediccion crearCargo(int id, String nombre, int demanda2026,
            double crecimiento, List<String> nombresRequisitos, int posicion) {

        List<DemandaHistorica> historico = List.of(
            new DemandaHistorica(2024, redondear(demanda2026 * 0.61)),
            new DemandaHistorica(2025, redondear(demanda2026 * 0.76)),
            new DemandaHistorica(2026, demanda2026));

        List<RequisitoPrediccion> requisitos = new ArrayList<>();
        for (int i = 0; i < nombresRequisitos.size(); i++) {
            int demandaRequisito = redondear(demanda2026 * (0.85 - i * 0.12));
            requisitos.add(crearRequisito(id * 100 + i + 1, nombresRequisitos.get(i),
                    demandaRequisito, crecimiento + (i * 1.5)));
        }

        return new CargoPrediccion(id, nombre, posicion, true, "", historico,
                List.of(crearPrediccion(demanda2026, crecimiento)), crecimiento, requisitos);
    }

    private RequisitoPrediccion crearRequisito(int id, String nombre, int demanda2026, double crecimiento) {
        List<DemandaHistorica> historico = List.of(
            new DemandaHistorica(2024, redondear(demanda2026 * 0.60)),
            new DemandaHistorica(2025, redondear(demanda2026 * 0.78)),
            new DemandaHistorica(2026, demanda2026));

        return new RequisitoPrediccion(id, nombre, "TECNOLOGIA", true, "", historico,
                List.of(crearPrediccion(demanda2026, crecimiento)), crecimiento);
    }

    private PrediccionPeriodo crearPrediccion(int demandaBase, double crecimiento) {
        int cantidad = redondear(demandaBase * (1 + crecimiento / 100.0));
        return new PrediccionPeriodo(ANIO_PREDICCION, cantidad,
                redondear(cantidad * 0.92), redondear(cantidad * 1.08));
    }

    private int redondear(double valor) {
        return (int) Math.round(valor);
    }
}