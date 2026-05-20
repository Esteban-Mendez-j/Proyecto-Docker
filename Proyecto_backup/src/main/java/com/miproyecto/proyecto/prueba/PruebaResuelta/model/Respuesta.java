package com.miproyecto.proyecto.prueba.PruebaResuelta.model;


import com.miproyecto.proyecto.prueba.pruebaTecnica.model.Pregunta;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Respuesta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private Long id;
    private Boolean esCorrecta;
    private String respuestaTexto;
    
    @ManyToOne
    @JoinColumn(name = "pruebaResuelta_id")
    private PruebaResuelta pruebaResuelta;

    @ManyToOne
    @JoinColumn(name = "pregunta_id")
    private Pregunta pregunta;
}
