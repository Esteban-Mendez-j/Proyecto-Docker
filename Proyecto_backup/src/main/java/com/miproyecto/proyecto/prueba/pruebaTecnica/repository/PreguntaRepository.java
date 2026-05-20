package com.miproyecto.proyecto.prueba.pruebaTecnica.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miproyecto.proyecto.prueba.pruebaTecnica.model.Pregunta;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.PruebaTecnica;

import java.util.List;


public interface PreguntaRepository extends JpaRepository<Pregunta, Long >{

    List<Pregunta> findByPrueba(PruebaTecnica prueba);
}
