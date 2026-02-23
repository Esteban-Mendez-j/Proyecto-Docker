package com.miproyecto.proyecto.aptitudes.model;

import java.util.List;

import com.miproyecto.proyecto.candidato.model.Candidato;
import com.miproyecto.proyecto.vacante.model.Vacante;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "aptitudes")
public class Aptitudes {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_aptitud", nullable = false, updatable = false)
    private Long idAptitud;

    @Column(name = "nombre_aptitud", nullable = false, unique = true, length = 100)
    private String nombreAptitud;

    @ManyToMany(mappedBy = "aptitudes")
    private List<Candidato> candidato;

    @ManyToMany(mappedBy = "aptitudes")
    private List<Vacante> vacantes;
    
    public Aptitudes() {
    }

    public Aptitudes(Long idAptitud, String nombreAptitud) {
        this.idAptitud = idAptitud;
        this.nombreAptitud = nombreAptitud;
    }

    public List<Vacante> getVacantes() {
        return vacantes;
    }

    public void setVacantes(List<Vacante> vacantes) {
        this.vacantes = vacantes;
    }

    public List<Candidato> getCandidato() {
        return candidato;
    }

    public void setCandidato(List<Candidato> candidato) {
        this.candidato = candidato;
    }

    // --- Getters y Setters ---
    public Long getIdAptitud() {
        return idAptitud;
    }

    public void setIdAptitud(Long idAptitud) {
        this.idAptitud = idAptitud;
    }

    public String getNombreAptitud() {
        return nombreAptitud;
    }

    public void setNombreAptitud(String nombreAptitud) {
        this.nombreAptitud = nombreAptitud;
    }
}
