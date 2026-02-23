package com.miproyecto.proyecto.ml.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.miproyecto.proyecto.aptitudes.model.Aptitudes;
import com.miproyecto.proyecto.candidato.model.Candidato;
import com.miproyecto.proyecto.candidato.repository.CandidatoRepository;
import com.miproyecto.proyecto.ml.WekaWrapper;
import com.miproyecto.proyecto.postulacion.model.Postulado;
import com.miproyecto.proyecto.postulacion.repository.PostuladoRepository;
import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.vacante.model.Vacante;
import com.miproyecto.proyecto.vacante.repository.VacanteRepository;

import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;

@Service
@Transactional
public class PrediccionService {

    @Autowired
    private CandidatoRepository candidatoRepository;
    @Autowired
    private VacanteRepository vacanteRepository;
    @Autowired
    private PostuladoRepository postuladoRepository;


    public void ActualizarAfinidad(Long idUsuario) throws Exception {
        Candidato candidato = candidatoRepository.findById(idUsuario)
                .orElseThrow(NotFoundException::new);

        List<Postulado> listPostulados = postuladoRepository.findAllByCandidato(candidato);

        for (Postulado postulacion : listPostulados) {

            Map<String, Object> resultado = predecirDesdeComparacion(
                    postulacion.getVacante().getNvacantes(), idUsuario);

            Object valor = resultado.get("porcentajeMatch");

            if (valor != null) {
                postulacion.setPorcentajePrediccion(Double.parseDouble(valor.toString()));
            }
        }

        postuladoRepository.saveAll(listPostulados);
    }

    public Map<String, Integer> comparacion(Vacante vacante, Candidato candidato) {

        if (candidato == null || vacante == null) {
            throw new IllegalArgumentException("Candidato o vacante no encontrados.");
        }

        // Obtener las listas de aptitudes del candidato y de la vacante
        List<Aptitudes> aptitudesCandidato = candidato.getAptitudes();
        List<Aptitudes> aptitudesVacante = vacante.getAptitudes();

        // Convertirlas a conjuntos de nombres para comparar fácilmente
        Set<String> nombresCandidato = aptitudesCandidato.stream()
                .map(Aptitudes::getNombreAptitud)
                .collect(Collectors.toSet());

        Set<String> nombresVacante = aptitudesVacante.stream()
                .map(Aptitudes::getNombreAptitud)
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
        Candidato candidato = candidatoRepository.findById(idCandidato).orElse(null);
        Vacante vacante = vacanteRepository.findById(nvacantes).orElse(null);

        Map<String, Integer> comparacion = comparacion(vacante, candidato);

        String nivelEducativo = candidato.getNivelEducativo(); 
        int añosExperiencia = Integer.parseInt(candidato.getExperiencia()); 

        // --- Calcular porcentaje de coincidencia ---
        int cantidadMatch = comparacion.get("CantidadAptitudes");
        int totalAptitudes = vacante.getAptitudes().size();
        double porcentajeMatch = 0;
        if(totalAptitudes != 0 ){
            porcentajeMatch = (cantidadMatch / (double) totalAptitudes) * 100; // hay 5 aptitudes en total
        }

        // --- Llamar al método que hace la predicción ---
        String resultadoPrediccion = predecir(
            nivelEducativo,
            añosExperiencia,
            comparacion.get("PensamientoCritico").toString(),
            comparacion.get("Creatividad").toString(),
            comparacion.get("AtencionDetalle").toString(),
            comparacion.get("AprendizajeContinuo").toString(),
            comparacion.get("EticaProfesional").toString(),
            comparacion.get("Autonomia").toString(),
            comparacion.get("Responsabilidad").toString(),
            comparacion.get("Liderazgo").toString(),
            comparacion.get("Adaptabilidad").toString(),
            comparacion.get("ResolucionProblemas").toString(),
            comparacion.get("ComunicacionAfectiva").toString(),
            comparacion.get("TrabajoEquipo").toString(),
            comparacion.get("CantidadAptitudes")
        );

        // --- Crear respuesta con ambos valores ---
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("resultadoPrediccion", resultadoPrediccion);
        respuesta.put("porcentajeMatch", porcentajeMatch);
        respuesta.put("cantidadCoincidencias", cantidadMatch);
        respuesta.put("totalAptitudes", totalAptitudes);

        return respuesta;
    }


    public  String predecir(
            String NivelEducativo,
            int AñosExperiencia,
            String PensamientoCritico,
            String Creatividad,
            String AtencionDetalle,
            String AprendizajeContinuo,
            String EticaProfesional,
            String Autonomia,
            String Responsabilidad,
            String Liderazgo,
            String Adaptabilidad,
            String ResolucionProblemas,
            String ComunicacionAfectiva,
            String TrabajoEquipo,
            int CantidadAptitudes) throws Exception {

        // --- 1. Definidos los atributos (en el MISMO orden del dataset original) ---
        ArrayList<Attribute> atributos = new ArrayList<>();

        atributos.add(new Attribute("NivelEducativo",
                new ArrayList<>(List.of("Postgrado", "Técnico", "Bachiller", "Doctorado"))));
        atributos.add(new Attribute("class", new ArrayList<>(List.of("0", "1"))));
        atributos.add(new Attribute("AñosExperiencia"));
        atributos.add(new Attribute("PensamientoCritico", new ArrayList<>(List.of("0", "1"))));
        atributos.add(new Attribute("Creatividad", new ArrayList<>(List.of("0", "1"))));
        atributos.add(new Attribute("AtencionDetalle", new ArrayList<>(List.of("0", "1"))));
        atributos.add(new Attribute("AprendizajeContinuo", new ArrayList<>(List.of("0", "1"))));
        atributos.add(new Attribute("EticaProfesional", new ArrayList<>(List.of("0", "1"))));
        atributos.add(new Attribute("Autonomia", new ArrayList<>(List.of("0", "1"))));
        atributos.add(new Attribute("Responsabilidad", new ArrayList<>(List.of("0", "1"))));
        atributos.add(new Attribute("Liderazgo", new ArrayList<>(List.of("0", "1"))));
        atributos.add(new Attribute("Adaptabilidad", new ArrayList<>(List.of("0", "1"))));
        atributos.add(new Attribute("ResolucionProblemas", new ArrayList<>(List.of("0", "1"))));
        atributos.add(new Attribute("ComunicacionAfectiva", new ArrayList<>(List.of("0", "1"))));
        atributos.add(new Attribute("TrabajoEquipo", new ArrayList<>(List.of("0", "1"))));
        atributos.add(new Attribute("CantidadAptitudes"));

        // clase objetivo

        // --- 2. Crear dataset temporal ---
        Instances dataset = new Instances("TestInstances", atributos, 0);
        dataset.setClassIndex(1);

        // --- 3. Crear instancia de prueba ---
        Instance nueva = new DenseInstance(dataset.numAttributes());
        nueva.setDataset(dataset);

        nueva.setValue(atributos.get(0), NivelEducativo);
        nueva.setValue(atributos.get(2), AñosExperiencia);
        nueva.setValue(atributos.get(3), PensamientoCritico);
        nueva.setValue(atributos.get(4), Creatividad);
        nueva.setValue(atributos.get(5), AtencionDetalle);
        nueva.setValue(atributos.get(6), AprendizajeContinuo);
        nueva.setValue(atributos.get(7), EticaProfesional);
        nueva.setValue(atributos.get(8), Autonomia);
        nueva.setValue(atributos.get(9), Responsabilidad);
        nueva.setValue(atributos.get(10), Liderazgo);
        nueva.setValue(atributos.get(11), Adaptabilidad);
        nueva.setValue(atributos.get(12), ResolucionProblemas);
        nueva.setValue(atributos.get(13), ComunicacionAfectiva);
        nueva.setValue(atributos.get(14), TrabajoEquipo);
        nueva.setValue(atributos.get(15), CantidadAptitudes);

        // --- 4. Clasificar ---
        WekaWrapper modelo = new WekaWrapper();
        double resultado = modelo.classifyInstance(nueva);

        // --- 5. Retornar resultado ---
        return String.valueOf(resultado) ; 
    }

}
