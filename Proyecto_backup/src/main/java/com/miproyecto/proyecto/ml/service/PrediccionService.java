package com.miproyecto.proyecto.ml.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.miproyecto.proyecto.aptitudes.model.Aptitudes;
import com.miproyecto.proyecto.candidato.model.Candidato;
import com.miproyecto.proyecto.candidato.repository.CandidatoRepository;
import com.miproyecto.proyecto.ml.dto.demandaLaboral.CargoPrediccion;
import com.miproyecto.proyecto.ml.dto.demandaLaboral.DemandaHistorica;
import com.miproyecto.proyecto.ml.dto.demandaLaboral.PrediccionPeriodo;
import com.miproyecto.proyecto.ml.dto.demandaLaboral.RequisitoPrediccion;
import com.miproyecto.proyecto.postulacion.model.Postulado;
import com.miproyecto.proyecto.postulacion.repository.PostuladoRepository;
import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.vacante.model.Vacante;
import com.miproyecto.proyecto.vacante.repository.VacanteRepository;

@Service
@Transactional
public class PrediccionService {

    private CandidatoRepository candidatoRepository;
    private VacanteRepository vacanteRepository;
    private PostuladoRepository postuladoRepository;
    private final int ANIO_PREDICCION = 2027;

    public PrediccionService(CandidatoRepository candidatoRepository, VacanteRepository vacanteRepository,
            PostuladoRepository postuladoRepository) {
        this.candidatoRepository = candidatoRepository;
        this.vacanteRepository = vacanteRepository;
        this.postuladoRepository = postuladoRepository;
    }

    public void ActualizarAfinidad(Long idUsuario) throws Exception {
        Candidato candidato = candidatoRepository.findById(idUsuario)
                .orElseThrow(NotFoundException::new);

        List<Postulado> listPostulados = postuladoRepository.findAllByCandidato(candidato);
        if (listPostulados == null || listPostulados.isEmpty()) {
            return;
        }

        Set<String> nombresCandidato = candidato.getAptitudes() != null
                ? candidato.getAptitudes().stream()
                        .map(Aptitudes::getNombreAptitud)
                        .collect(Collectors.toSet())
                : Collections.emptySet();

        for (Postulado postulacion : listPostulados) {
            Vacante vacante = postulacion.getVacante();
            if (vacante != null && vacante.getAptitudes() != null && !vacante.getAptitudes().isEmpty()) {
                List<String> nombresVacante = vacante.getAptitudes().stream()
                        .map(Aptitudes::getNombreAptitud)
                        .collect(Collectors.toList());
                double match = calcularPorcentajeMatch(nombresCandidato, nombresVacante);
                postulacion.setPorcentajePrediccion(match);
            } else {
                postulacion.setPorcentajePrediccion(0.0);
            }
        }

        postuladoRepository.saveAll(listPostulados);
    }

    public double calcularPorcentajeMatch(Set<String> aptitudesCandidato, List<String> aptitudesVacante) {
        if (aptitudesCandidato == null || aptitudesCandidato.isEmpty()
                || aptitudesVacante == null || aptitudesVacante.isEmpty()) {
            return 0.0;
        }
        int totalAptitudes = aptitudesVacante.size();
        long coincidencias = aptitudesVacante.stream()
                .filter(aptitudesCandidato::contains)
                .count();
        return totalAptitudes > 0 ? (coincidencias * 100.0 / totalAptitudes) : 0.0;
    }

    public Map<String, Integer> comparacion(Vacante vacante, Candidato candidato) {

        if (candidato == null || vacante == null) {
            throw new IllegalArgumentException("Candidato o vacante no encontrados.");
        }

        // Obtener las listas de aptitudes del candidato y de la vacante
        List<Aptitudes> aptitudesCandidato = candidato.getAptitudes();
        List<Aptitudes> aptitudesVacante = vacante.getAptitudes();

        // Convertirlas a conjuntos de nombres para comparar fácilmente
        Set<String> nombresCandidato = aptitudesCandidato != null
                ? aptitudesCandidato.stream().map(Aptitudes::getNombreAptitud).collect(Collectors.toSet())
                : Collections.emptySet();

        Set<String> nombresVacante = aptitudesVacante != null
                ? aptitudesVacante.stream().map(Aptitudes::getNombreAptitud).collect(Collectors.toSet())
                : Collections.emptySet();

        // Resultado con todas las aptitudes en formato { "PensamientoCritico" = 1/0 }
        Map<String, Integer> resultado = new HashMap<>();

        // Lista de todas las aptitudes posibles
        List<String> todasLasAptitudes = List.of(
                "PensamientoCritico", "Creatividad", "AtencionDetalle", "AprendizajeContinuo",
                "EticaProfesional", "Autonomia", "Responsabilidad", "Liderazgo",
                "Adaptabilidad", "ResolucionProblemas", "ComunicacionAfectiva", "TrabajoEquipo");

        int coincidencias = 0;

        for (String nombre : todasLasAptitudes) {
            int valor = (nombresCandidato.contains(nombre) && nombresVacante.contains(nombre)) ? 1 : 0;
            resultado.put(nombre, valor);
            if (valor == 1)
                coincidencias++;
        }

        resultado.put("CantidadAptitudes", coincidencias);

        return resultado;
    }

    public Map<String, Object> predecirDesdeComparacion(Long nvacantes, Long idCandidato) throws Exception {
        Candidato candidato = candidatoRepository.findById(idCandidato).orElse(null);
        Vacante vacante = vacanteRepository.findById(nvacantes).orElse(null);

        if (candidato == null || vacante == null) {
            throw new IllegalArgumentException("Candidato o vacante no encontrados.");
        }

        Map<String, Integer> comparacion = comparacion(vacante, candidato);

        // --- Calcular porcentaje de coincidencia ---
        int cantidadMatch = comparacion.getOrDefault("CantidadAptitudes", 0);
        int totalAptitudes = vacante.getAptitudes() != null ? vacante.getAptitudes().size() : 0;
        double porcentajeMatch = 0.0;
        if (totalAptitudes != 0) {
            porcentajeMatch = (cantidadMatch / (double) totalAptitudes) * 100.0;
        }

        // --- Crear respuesta con ambos valores (sin Weka) ---
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("resultadoPrediccion", String.format(java.util.Locale.US, "%.2f", porcentajeMatch / 100.0));
        respuesta.put("porcentajeMatch", porcentajeMatch);
        respuesta.put("cantidadCoincidencias", cantidadMatch);
        respuesta.put("totalAptitudes", totalAptitudes);

        return respuesta;
    }

    /* 
        PREDICCION DEMANDA DE CARGOS MOCK
    */

    // =====================================================
    // DATOS SIMULADOS
    // =====================================================

    public List<CargoPrediccion> crearDatosSimulados() {
        return List.of(
            crearCargo(
                1, "Desarrollador de software",
                850, 15.29,
                List.of("Python", "Java", "Spring Boot"), 1,
                true, ""
            ),
            crearCargo(
                2, "Analista de datos",
                620, 18.50,
                List.of("Python", "SQL", "Power BI"), 3,
                true, ""
            ),
            crearCargo(
                3, "Desarrollador web",
                720, 14.20,
                List.of("JavaScript", "React", "Git"), 2,
                true, ""
            ),
            crearCargo(
                4, "Ingeniero de datos",
                480, 20.10,
                List.of("SQL", "Python", "Apache Spark"), 4,
                true, ""
            ),
            crearCargo(
                5, "Desarrollador de aplicaciones móviles",
                390, 17.30,
                List.of("Flutter", "Dart", "Firebase"), 5,
                true, "" 
            ),
            crearCargo(
                6, "Especialista en ciberseguridad",
                350, 22.40,
                List.of("Linux", "Redes", "SIEM"), 6,
                true, ""
            )
        );
    }

    private CargoPrediccion crearCargo(
        int id,
        String nombre,
        int demanda2026,
        double crecimiento,
        List<String> nombresRequisitos,
        int posicion,
        Boolean success,
        String motivoSinPrediccion
    ) {
        List<DemandaHistorica> historico = List.of(
            new DemandaHistorica(
                2024, redondear(demanda2026 * 0.61)
            ),
            new DemandaHistorica(
                2025, redondear(demanda2026 * 0.76)
            ),
            new DemandaHistorica(
                2026, demanda2026
            )
        );

        int cantidadPredicha = redondear(
            demanda2026 * (1 + crecimiento / 100.0)
        );

        List<PrediccionPeriodo> prediccion = List.of(
            new PrediccionPeriodo(
                ANIO_PREDICCION,
                cantidadPredicha
            )
        );

        List<RequisitoPrediccion> requisitos =
            new ArrayList<>();

        for (int i = 0; i < nombresRequisitos.size(); i++) {
            int demandaRequisito = redondear(
                demanda2026 * (0.85 - i * 0.12)
            );

            requisitos.add(
                crearRequisito(
                    id * 100 + i + 1,
                    nombresRequisitos.get(i),
                    demandaRequisito,
                    crecimiento + (i * 1.5),
                    true,
                    ""
                )
            );
        }

        return new CargoPrediccion(
            id,
            nombre,
            posicion,
            success,
            motivoSinPrediccion,
            historico,
            prediccion,
            crecimiento,
            requisitos
        );
    }

    private RequisitoPrediccion crearRequisito(
        int id,
        String nombre,
        int demanda2026,
        double crecimiento,
        Boolean success,
        String motivoSinPrediccion
    ) {
        List<DemandaHistorica> historico = List.of(
            new DemandaHistorica(
                2024, redondear(demanda2026 * 0.60)
            ),
            new DemandaHistorica(
                2025, redondear(demanda2026 * 0.78)
            ),
            new DemandaHistorica(
                2026, demanda2026
            )
        );

        int cantidadPredicha = redondear(
            demanda2026 * (1 + crecimiento / 100.0)
        );

        List<PrediccionPeriodo> prediccion = List.of(
            new PrediccionPeriodo(
                ANIO_PREDICCION,
                cantidadPredicha
            )
        );

        return new RequisitoPrediccion(
            id,
            nombre,
            "TECNOLOGIA",
            success,
            motivoSinPrediccion,
            historico,
            prediccion,
            crecimiento
        );
    }

    private int redondear(double valor) {
        return (int) Math.round(valor);
    }

    public int getANIO_PREDICCION() {
        return ANIO_PREDICCION;
    }

}
