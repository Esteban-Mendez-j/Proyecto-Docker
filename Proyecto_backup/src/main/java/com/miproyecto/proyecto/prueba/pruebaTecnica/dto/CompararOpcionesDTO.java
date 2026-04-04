package com.miproyecto.proyecto.prueba.pruebaTecnica.dto;

public class CompararOpcionesDTO {
    private String texto;
    private Integer orden;
    
    public CompararOpcionesDTO(String texto, Integer orden) {
        this.texto = texto;
        this.orden = orden;
    }
    public String getTexto() {
        return texto;
    }
    public void setTexto(String texto) {
        this.texto = texto;
    }
    public Integer getOrden() {
        return orden;
    }
    public void setOrden(Integer orden) {
        this.orden = orden;
    }
    @Override
    public String toString() {
        return "CompararRespuestaDTO [texto=" + texto + ", orden=" + orden + "]";
    }
}
