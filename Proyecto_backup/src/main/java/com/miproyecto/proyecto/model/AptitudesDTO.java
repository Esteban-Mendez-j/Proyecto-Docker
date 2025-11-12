package com.miproyecto.proyecto.model;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class AptitudesDTO {

    private Long idAptitud;

    @NotNull
    @Size(max = 80)
    private String nombreAptitud;

    private Long idUsuario;

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

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    @Override
    public String toString() {
        return "AptitudesDTO [idAptitud=" + idAptitud + ", nombreAptitud=" + nombreAptitud + ", idUsuario=" + idUsuario
                + "]";
    }

}
