package com.miproyecto.proyecto.prueba.pruebaTecnica.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Pregunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String pregunta;
    private Integer puntos;
    private String respuestaCorrecta;
    private Integer orden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prueba_id")
    private PruebaTecnica prueba;

    @OneToMany(mappedBy = "pregunta", cascade = CascadeType.ALL)
    private List<Opciones> opciones;

    public List<Opciones> getOpciones() {
        return opciones;
    }

    public void setOpciones(List<Opciones> opciones) {
        this.opciones = opciones;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPregunta() {
        return pregunta;
    }

    public void setPregunta(String pregunta) {
        this.pregunta = pregunta;
    }

    public Integer getPuntos() {
        return puntos;
    }

    public void setPuntos(Integer puntos) {
        this.puntos = puntos;
    }

    public String getRespuestaCorrecta() {
        return respuestaCorrecta;
    }

    public void setRespuestaCorrecta(String respuestaCorrecta) {
        this.respuestaCorrecta = respuestaCorrecta;
    }

    public PruebaTecnica getPrueba() {
        return prueba;
    }

    public void setPrueba(PruebaTecnica prueba) {
        this.prueba = prueba;
    }

    public Integer getOrden() {
        return orden;
    }

    public void setOrden(Integer orden) {
        this.orden = orden;
    }
}
