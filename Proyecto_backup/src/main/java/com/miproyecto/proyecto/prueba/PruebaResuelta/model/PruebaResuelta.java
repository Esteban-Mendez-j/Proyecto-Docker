package com.miproyecto.proyecto.prueba.PruebaResuelta.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.miproyecto.proyecto.postulacion.model.Postulado;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.PruebaTecnica;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class PruebaResuelta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
    private LocalTime tiempoDeRespuesta;
    private Double calificacion;
    private LocalDate fechaRealizacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pruebaTecnica_id")
    private PruebaTecnica pruebaTecnica;

    @OneToOne(mappedBy = "pruebaResuelta")
    private Postulado postulado;

    @OneToMany(mappedBy = "pruebaResuelta", cascade = CascadeType.ALL)
    private List<Respuesta> respuestas; 
}
