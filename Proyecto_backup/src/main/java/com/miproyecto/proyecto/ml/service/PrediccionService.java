package com.miproyecto.proyecto.ml.service;


import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.miproyecto.proyecto.aptitudes.model.Aptitudes;
import com.miproyecto.proyecto.aptitudes.repository.AptitudesRepository;
import com.miproyecto.proyecto.candidato.model.Candidato;
import com.miproyecto.proyecto.candidato.repository.CandidatoRepository;
import com.miproyecto.proyecto.ml.WekaWrapper;
import com.miproyecto.proyecto.postulacion.model.Postulado;
import com.miproyecto.proyecto.postulacion.repository.PostuladoRepository;
import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.vacante.model.Vacante;

@Service
@Transactional
public class PrediccionService {

    private CandidatoRepository candidatoRepository;
    private AptitudesRepository aptitudesRepository;
    private PostuladoRepository postuladoRepository;

    public PrediccionService(CandidatoRepository candidatoRepository, AptitudesRepository aptitudesRepository,
            PostuladoRepository postuladoRepository) {
        this.candidatoRepository = candidatoRepository;
        this.aptitudesRepository = aptitudesRepository;
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

    public Map<String, Integer> comparacion(List<String> aptitudesVacante, Candidato candidato) {

        if (candidato == null || aptitudesVacante.isEmpty()) {
            throw new IllegalArgumentException("Candidato o vacante no encontrados.");
        }
        
        // Obtener las listas de aptitudes del candidato y de la vacante
        List<Aptitudes> aptitudesCandidato = candidato.getAptitudes();

        // Convertirlas a conjuntos de nombres para comparar fácilmente
        Set<String> nombresCandidato = aptitudesCandidato != null
                ? aptitudesCandidato.stream().map(Aptitudes::getNombreAptitud).collect(Collectors.toSet())
                : Collections.emptySet();

        Set<String> nombresVacante = aptitudesVacante.stream()
            .collect(Collectors.toSet());

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

        Candidato candidato = candidatoRepository.findById(idCandidato)
                .orElse(null);

        List<String> aptitudesVacante = aptitudesRepository
                .findNombresAptitudesByVacanteId(nvacantes);

        
        aptitudesVacante = aptitudesVacante.stream()
                .filter(Objects::nonNull)
                .toList();
        if (candidato == null || aptitudesVacante.isEmpty()) {
            throw new IllegalArgumentException("Candidato o vacante no encontrados.");
        }

        // 2. COMPARAR APTITUDES
        Map<String, Integer> comparacion = comparacion(aptitudesVacante, candidato);

        // 3. CALCULAR AFINIDAD
        int cantidadMatch = comparacion.getOrDefault("CantidadAptitudes", 0);

        int totalAptitudes = aptitudesVacante.size();

        double porcentajeMatch = 0.0;

        if (totalAptitudes > 0) {
            porcentajeMatch = (cantidadMatch / (double) totalAptitudes) * 100.0;
        }

        // 4. EJECUTAR PREDICCION CON WEKA
        String resultadoPrediccion = predecir(candidato, comparacion);

        // 5. CONSTRUIR RESPUESTA
        Map<String, Object> respuesta = new HashMap<>();

        respuesta.put("resultadoPrediccion", resultadoPrediccion);
        respuesta.put("porcentajeMatch", porcentajeMatch);
        respuesta.put("cantidadCoincidencias", cantidadMatch);
        respuesta.put("totalAptitudes", totalAptitudes);

        return respuesta;
    }


    /**
     * Ejecuta el modelo de clasificacion generado por Weka.
     */
    private String predecir(Candidato candidato, Map<String, Integer> comparacion) throws Exception {

        // 1. DEFINIR ATRIBUTOS
        ArrayList<Attribute> atributos = new ArrayList<>();

        atributos.add(new Attribute("NivelEducativo",
                new ArrayList<>(List.of(
                        "Postgrado ",
                        "Técnico ",
                        "Bachiller ",
                        "Doctorado "))));

        atributos.add(new Attribute("class",
                new ArrayList<>(List.of("0", "1"))));

        atributos.add(new Attribute("AñosExperiencia"));

        atributos.add(new Attribute("PensamientoCritico",
                new ArrayList<>(List.of("0", "1"))));

        atributos.add(new Attribute("Creatividad",
                new ArrayList<>(List.of("0", "1"))));

        atributos.add(new Attribute("AtencionDetalle",
                new ArrayList<>(List.of("0", "1"))));

        atributos.add(new Attribute("AprendizajeContinuo",
                new ArrayList<>(List.of("0", "1"))));

        atributos.add(new Attribute("EticaProfesional",
                new ArrayList<>(List.of("0", "1"))));

        atributos.add(new Attribute("Autonomia",
                new ArrayList<>(List.of("0", "1"))));

        atributos.add(new Attribute("Responsabilidad",
                new ArrayList<>(List.of("0", "1"))));

        atributos.add(new Attribute("Liderazgo",
                new ArrayList<>(List.of("0", "1"))));

        atributos.add(new Attribute("Adaptabilidad",
                new ArrayList<>(List.of("0", "1"))));

        atributos.add(new Attribute("ResolucionProblemas",
                new ArrayList<>(List.of("0", "1"))));

        atributos.add(new Attribute("ComunicacionAfectiva",
                new ArrayList<>(List.of("0", "1"))));

        atributos.add(new Attribute("TrabajoEquipo",
                new ArrayList<>(List.of("0", "1"))));

        atributos.add(new Attribute("CantidadAptitudes"));
        
        // 2. CREAR DATASET
        Instances dataset = new Instances("TestInstances", atributos, 0);
        dataset.setClassIndex(1);
       
        // 3. CREAR INSTANCIA
        Instance nueva = new DenseInstance(dataset.numAttributes());
        nueva.setDataset(dataset);

        // Nivel educativo: normalizar espacios para coincidir
        // exactamente con los valores esperados por Weka.
        String nivelEducativo = candidato.getNivelEducativo();

        if (nivelEducativo != null) {

            String nivelNormalizado = nivelEducativo.trim();

            int indiceNivel = dataset.attribute(0).indexOfValue(nivelNormalizado + " ");

            if (indiceNivel >= 0) {
                nueva.setValue(atributos.get(0), nivelNormalizado + " ");
            } else {
                nueva.setMissing(0);
            }

        } else {
            nueva.setMissing(0);
        }

        // La clase objetivo se deja sin valor.
        nueva.setMissing(1);

        // Experiencia
        String experiencia = candidato.getExperiencia();

        if (experiencia != null && !experiencia.isBlank()) {

            try {
                nueva.setValue(atributos.get(2), Integer.parseInt(experiencia.trim()));
            } catch (NumberFormatException e) {
                nueva.setMissing(2);
            }

        } else {
            nueva.setMissing(2);
        }

        // Aptitudes individuales
        nueva.setValue(atributos.get(3), String.valueOf(comparacion.getOrDefault("PensamientoCritico", 0)));
        nueva.setValue(atributos.get(4), String.valueOf(comparacion.getOrDefault("Creatividad", 0)));
        nueva.setValue(atributos.get(5), String.valueOf(comparacion.getOrDefault("AtencionDetalle", 0)));
        nueva.setValue(atributos.get(6), String.valueOf(comparacion.getOrDefault("AprendizajeContinuo", 0)));
        nueva.setValue(atributos.get(7), String.valueOf(comparacion.getOrDefault("EticaProfesional", 0)));
        nueva.setValue(atributos.get(8), String.valueOf(comparacion.getOrDefault("Autonomia", 0)));
        nueva.setValue(atributos.get(9), String.valueOf(comparacion.getOrDefault("Responsabilidad", 0)));
        nueva.setValue(atributos.get(10), String.valueOf(comparacion.getOrDefault("Liderazgo", 0)));
        nueva.setValue(atributos.get(11), String.valueOf(comparacion.getOrDefault("Adaptabilidad", 0)));
        nueva.setValue(atributos.get(12), String.valueOf(comparacion.getOrDefault("ResolucionProblemas", 0)));
        nueva.setValue(atributos.get(13), String.valueOf(comparacion.getOrDefault("ComunicacionAfectiva", 0)));
        nueva.setValue(atributos.get(14), String.valueOf(comparacion.getOrDefault("TrabajoEquipo", 0)));

        // Cantidad total de aptitudes coincidentes
        nueva.setValue(
                atributos.get(15),
                comparacion.getOrDefault("CantidadAptitudes", 0));

        // 4. CREAR CLASIFICADOR

        WekaWrapper modelo = new WekaWrapper();

        // 5. EJECUTAR CLASIFICACION
        double resultado = modelo.classifyInstance(nueva);

        if (Double.isNaN(resultado)) {
            throw new IllegalStateException("Weka no pudo generar una clasificación válida.");
        }

        return String.valueOf(resultado);
    }

}
