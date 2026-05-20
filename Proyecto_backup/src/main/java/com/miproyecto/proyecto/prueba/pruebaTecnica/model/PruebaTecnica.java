package com.miproyecto.proyecto.prueba.pruebaTecnica.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.miproyecto.proyecto.prueba.PruebaResuelta.model.PruebaResuelta;
import com.miproyecto.proyecto.vacante.model.Vacante;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class PruebaTecnica {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    private String descripcion;
    private LocalTime tiempoParaResponder;
    private Integer version;
    private Boolean isActive;
    private LocalDate fechaCreacion;
    private String hash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Vacante_id")
    private Vacante vacante;
    
    @OneToMany( mappedBy = "prueba", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pregunta> preguntas;

    @OneToMany(mappedBy = "pruebaTecnica")
    private List<PruebaResuelta> pruebasResueltas;

    
}
