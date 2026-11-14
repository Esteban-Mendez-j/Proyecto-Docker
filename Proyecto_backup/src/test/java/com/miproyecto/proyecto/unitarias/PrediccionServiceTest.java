package com.miproyecto.proyecto.unitarias;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.miproyecto.proyecto.aptitudes.repository.AptitudesRepository;
import com.miproyecto.proyecto.candidato.repository.CandidatoRepository;
import com.miproyecto.proyecto.ml.service.PrediccionService;
import com.miproyecto.proyecto.postulacion.repository.PostuladoRepository;

class PrediccionServiceTest {

    private PrediccionService prediccionService;

    @BeforeEach
    void setUp() {
        CandidatoRepository candidatoRepo = mock(CandidatoRepository.class);
        AptitudesRepository aptitudRepo = mock(AptitudesRepository.class);
        PostuladoRepository postuladoRepo = mock(PostuladoRepository.class);
        prediccionService = new PrediccionService(candidatoRepo, aptitudRepo, postuladoRepo);
    }

    @Test
    void testCalcularPorcentajeMatch_coincidenciaTotal() {
        Set<String> candidato = Set.of("Java", "Spring Boot", "SQL");
        List<String> vacante = List.of("Java", "Spring Boot", "SQL");

        double match = prediccionService.calcularPorcentajeMatch(candidato, vacante);
        assertEquals(100.0, match, 0.001);
    }

    @Test
    void testCalcularPorcentajeMatch_coincidenciaParcial() {
        Set<String> candidato = Set.of("Java", "Python");
        List<String> vacante = List.of("Java", "Spring Boot", "SQL", "Docker");

        // 1 de 4 coincide = 25%
        double match = prediccionService.calcularPorcentajeMatch(candidato, vacante);
        assertEquals(25.0, match, 0.001);
    }

    @Test
    void testCalcularPorcentajeMatch_sinCoincidencia() {
        Set<String> candidato = Set.of("Python", "Django");
        List<String> vacante = List.of("Java", "Spring Boot");

        double match = prediccionService.calcularPorcentajeMatch(candidato, vacante);
        assertEquals(0.0, match, 0.001);
    }

    @Test
    void testCalcularPorcentajeMatch_listasVacias() {
        double match = prediccionService.calcularPorcentajeMatch(Set.of(), List.of("Java"));
        assertEquals(0.0, match, 0.001);

        double match2 = prediccionService.calcularPorcentajeMatch(Set.of("Java"), List.of());
        assertEquals(0.0, match2, 0.001);
    }
}
