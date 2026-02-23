package com.miproyecto.proyecto.vacante.dto;

import java.time.LocalDate;

import com.miproyecto.proyecto.usuario.model.Usuario;
import com.miproyecto.proyecto.vacante.model.Vacante;

public class VacanteFavoritaDTO {
    private Long id; 
    private Vacante vacante;
    private Usuario usuario;
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
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    public LocalDate getFechaAgregada() {
        return fechaAgregada;
    }
    public void setFechaAgregada(LocalDate fechaAgregada) {
        this.fechaAgregada = fechaAgregada;
    }
}
