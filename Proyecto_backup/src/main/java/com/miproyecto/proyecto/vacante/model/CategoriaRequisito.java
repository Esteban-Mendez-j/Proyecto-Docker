package com.miproyecto.proyecto.vacante.model;


import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Data 
@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_categoria_requisito_nombre",
            columnNames = "nombre"
        )
    }
)
public class CategoriaRequisito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @OneToMany(mappedBy = "categoria")
    private List<Requisito> requisitos;

    public CategoriaRequisito() {}

}