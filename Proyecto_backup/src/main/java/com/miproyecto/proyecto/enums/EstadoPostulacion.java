package com.miproyecto.proyecto.enums;

public enum EstadoPostulacion {
    ACEPTADA("Aceptada"),
    RECHAZADA("Rechazada"),
    ESPERA("Espera"), 
    SINPOSTULACION("Sin Postulacion"),
    CANCELADA("Cancelada");

    private final String descripcion;

 
    EstadoPostulacion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
