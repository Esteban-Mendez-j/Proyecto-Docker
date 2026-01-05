package com.miproyecto.proyecto.vacante.model;

import java.time.LocalDate;

import com.miproyecto.proyecto.usuario.model.Usuario;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class VacanteFavorita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_Fav_vacante", nullable = false)
    private Vacante vacanteFavorita;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_Fav_usuario", nullable = false)
    private Usuario usuarioFavorita;

    private LocalDate fechaAgregada;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Vacante getVacanteFavorita() {
        return vacanteFavorita;
    }

    public void setVacanteFavorita(Vacante vacanteFavorita) {
        this.vacanteFavorita = vacanteFavorita;
    }
//chat gpt recomendo cambairla a miniscula la primera letra, Comentar a esteban y verificar al preguntarle a esteban el porqué esta asi
    public Usuario getUsuarioFavorita() {
        return usuarioFavorita;
    }

    public void setUsuarioFavorita(Usuario usuarioFavorita) {
        this.usuarioFavorita = usuarioFavorita;
    }

    public LocalDate getFechaAgregada() {
        return fechaAgregada;
    }

    public void setFechaAgregada(LocalDate fechaAgregada) {
        this.fechaAgregada = fechaAgregada;
    }

}
