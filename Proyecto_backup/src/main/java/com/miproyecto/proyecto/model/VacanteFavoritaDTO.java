package com.miproyecto.proyecto.model;

import java.time.LocalDate;

import com.miproyecto.proyecto.domain.Usuario;
import com.miproyecto.proyecto.domain.Vacante;

public class VacanteFavoritaDTO {
    private Long id; 
    private Vacante vacante;
    private Usuario Usuario;
    private LocalDate fechaAgregada;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Vacante getVacante() {
        return vacante;
    }
    public void setVacante(Vacante vacante) {
        this.vacante = vacante;
    }
    public Usuario getUsuario() {
        return Usuario;
    }
    public void setUsuario(Usuario usuario) {
        Usuario = usuario;
    }
    public LocalDate getFechaAgregada() {
        return fechaAgregada;
    }
    public void setFechaAgregada(LocalDate fechaAgregada) {
        this.fechaAgregada = fechaAgregada;
    }
}
