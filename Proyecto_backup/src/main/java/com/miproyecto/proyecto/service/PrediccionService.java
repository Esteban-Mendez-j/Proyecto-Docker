package com.miproyecto.proyecto.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.miproyecto.proyecto.ml.WekaWrapper;

import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;

@Service
public class PrediccionService {

    public String predecir(
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
        int CantidadAptitudes
    ) throws Exception {

        // --- 1. Definir atributos (en el MISMO orden del dataset original) ---
        ArrayList<Attribute> atributos = new ArrayList<>();

        atributos.add(new Attribute("NivelEducativo", new ArrayList<>(List.of("Postgrado","Técnico", "Bachiller", "Doctorado"))));
        atributos.add(new Attribute("class", new ArrayList<>(List.of("0", "1"))));
        atributos.add(new Attribute("AñosExperiencia"));
        atributos.add(new Attribute("PensamientoCritico", new ArrayList<>(List.of("0","1"))));
        atributos.add(new Attribute("Creatividad", new ArrayList<>(List.of("0","1"))));
        atributos.add(new Attribute("AtencionDetalle", new ArrayList<>(List.of("0","1"))));
        atributos.add(new Attribute("AprendizajeContinuo", new ArrayList<>(List.of("0","1"))));
        atributos.add(new Attribute("EticaProfesional", new ArrayList<>(List.of("0","1"))));
        atributos.add(new Attribute("Autonomia", new ArrayList<>(List.of("0","1"))));
        atributos.add(new Attribute("Responsabilidad", new ArrayList<>(List.of("0","1"))));
        atributos.add(new Attribute("Liderazgo", new ArrayList<>(List.of("0","1"))));
        atributos.add(new Attribute("Adaptabilidad", new ArrayList<>(List.of("0","1"))));
        atributos.add(new Attribute("ResolucionProblemas", new ArrayList<>(List.of("0","1"))));
        atributos.add(new Attribute("ComunicacionAfectiva", new ArrayList<>(List.of("0","1"))));
        atributos.add(new Attribute("TrabajoEquipo", new ArrayList<>(List.of("0","1"))));
        atributos.add(new Attribute("CantidadAptitudes"));

         // clase objetivo
        
        // --- 2. Crear dataset temporal ---
        Instances dataset = new Instances("TestInstances", atributos, 0);
        dataset.setClassIndex(1) ;

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
        return (resultado == 1.0) ? "Si Contratado" : "NO Contratado: "+ resultado + " Valores "+ nueva.toString();
    }



}
