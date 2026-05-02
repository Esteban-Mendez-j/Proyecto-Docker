package com.miproyecto.proyecto.prueba.pruebaTecnica.dto;



public class OpcionesDTO {
    private Long id;
    private String texto;
    private Integer orden;
    
    public Integer getOrden() {
        return orden;
    }
    public void setOrden(Integer orden) {
        this.orden = orden;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getTexto() {
        return texto;
    }
    public void setTexto(String texto) {
        this.texto = texto;
    }
}
