package com.miproyecto.proyecto.model;

import jakarta.validation.constraints.Size;


public class EmpresaDTO extends UsuarioDTO  {

    @Size(max = 50)
    private String sectorEmpresarial;

    @Size(max = 255)
    private String sitioWeb;

    @Size(max = 500)
    private String videoLink;


    

    @Size(max = 9)
    @EmpresaNitUnique(message = "Este NIT ya esta registrado")
    private String nit;

    private int numeroVacantes;

    private int numeroVacantesActivas;

    private int candidatosAceptados;

    private double porcentajeAceptacion;

    private boolean isVerified;

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }

    public int getNumeroVacantes() {
        return numeroVacantes;
    }

    public void setNumeroVacantes(int numeroVacantes) {
        this.numeroVacantes = numeroVacantes;
    }

    public int getNumeroVacantesActivas() {
        return numeroVacantesActivas;
    }

    public void setNumeroVacantesActivas(int numeroVacantesActivas) {
        this.numeroVacantesActivas = numeroVacantesActivas;
    }

    public int getCandidatosAceptados() {
        return candidatosAceptados;
    }

    public void setCandidatosAceptados(int candidatosAceptados) {
        this.candidatosAceptados = candidatosAceptados;
    }

    public double getPorcentajeAceptacion() {
        return porcentajeAceptacion;
    }

    public void setPorcentajeAceptacion(double porcentajeAceptacion) {
        this.porcentajeAceptacion = porcentajeAceptacion;
    }

    public String getSectorEmpresarial() {
        return sectorEmpresarial;
    }

    public void setSectorEmpresarial(final String sectorEmpresarial) {
        this.sectorEmpresarial = sectorEmpresarial;
    }

    public String getSitioWeb() {
        return sitioWeb;
    }

    public void setSitioWeb(final String sitioWeb) {
        this.sitioWeb = sitioWeb;
    }

    public String getVideoLink() {
    return videoLink;
}

    public void setVideoLink(String videoLink) {
        this.videoLink = videoLink;
}

    public String getNit() {
        return nit;
    }

    public void setNit(final String nit) {
        this.nit = nit;
    }

    @Override
    public String toString() {
        return "EmpresaDTO [sectorEmpresarial=" + sectorEmpresarial + ", sitioWeb=" + sitioWeb + ", nit=" + nit + "]";
    }


}
