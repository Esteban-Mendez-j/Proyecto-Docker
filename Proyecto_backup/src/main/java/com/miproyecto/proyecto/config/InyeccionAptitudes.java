package com.miproyecto.proyecto.config;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.miproyecto.proyecto.aptitudes.model.Aptitudes;
import com.miproyecto.proyecto.aptitudes.repository.AptitudesRepository;

@Component
public class InyeccionAptitudes implements CommandLineRunner {

    private final AptitudesRepository aptitudesRepository;

    public InyeccionAptitudes(AptitudesRepository aptitudesRepository) {
        this.aptitudesRepository = aptitudesRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        List<String> aptitudes = List.of("PensamientoCritico", "Creatividad",
            "AtencionDetalle", "AprendizajeContinuo", "EticaProfesional" , "Autonomia",
            "Responsabilidad", "Liderazgo" , "Adaptabilidad", "ResolucionProblemas" ,
            "ComunicacionAfectiva", "TrabajoEquipo");

        for (String nombreAptitud : aptitudes) {
            if (aptitudesRepository.findByNombreAptitud(nombreAptitud) == null) {
                Aptitudes aptitud = new Aptitudes();
                aptitud.setNombreAptitud(nombreAptitud);
                aptitudesRepository.save(aptitud);
            }
        }
    }
}