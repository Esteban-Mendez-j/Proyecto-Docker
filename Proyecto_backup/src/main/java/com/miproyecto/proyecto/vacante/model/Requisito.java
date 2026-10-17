package com.miproyecto.proyecto.vacante.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.Data;

@Data 
@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_requisito_nombre",
            columnNames = "nombre"
        )
    }
)
public class Requisito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_categoria", nullable = false)
    private CategoriaRequisito categoria;

    @ManyToMany(mappedBy = "requisitos")
    private Set<Vacante> vacantes = new HashSet<>();
   
    public Requisito() {}

}
