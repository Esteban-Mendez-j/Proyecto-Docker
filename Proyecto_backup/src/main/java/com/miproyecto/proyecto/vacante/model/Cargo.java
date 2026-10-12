package com.miproyecto.proyecto.vacante.model;


import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;


@Data 
@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_cargo_codigo_cuoc",
            columnNames = "codigo_cuoc"
        )
    }
)
public class Cargo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_cuoc", length = 5, nullable = false)
    private String codigoCuoc;

    private String nombre;

    @Column(name = "codigo_subgrupo_cuoc", length = 3)
    private String codigoSubgrupoCuoc;

    @OneToMany(mappedBy = "cargo", fetch = FetchType.LAZY)
    private List<Vacante> vacantes = new ArrayList<>();

}