package com.miproyecto.proyecto.empresa.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;

import java.util.Set;

import com.miproyecto.proyecto.usuario.model.Usuario;
import com.miproyecto.proyecto.vacante.model.Vacante;


@Entity
@PrimaryKeyJoinColumn(name = "id_empresa")
public class Empresa  extends Usuario {

    @Column(length = 50)
    private String sectorEmpresarial;

    @Column
    private String sitioWeb;

    @Column(unique = true, length = 10)
    private String nit;

    @OneToMany(mappedBy = "idUsuario")
    private Set<Vacante> listarVacantes;

    @Column
    private boolean isVerified;


    @Column(length = 500)
    private String videoLink;

    public String getVideoLink() {
        return videoLink;
    }

    public void setVideoLink(String videoLink) {
        this.videoLink = videoLink;
    }



    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean isVerified) {
        this.isVerified = isVerified;
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


    public String getNit() {
        return nit;
    }

    public void setNit(final String nit) {
        this.nit = nit;
    }

    public Set<Vacante> getListarVacantes() {
        return listarVacantes;
    }

    public void setListarVacantes(final Set<Vacante> listarVacantes) {
        this.listarVacantes = listarVacantes;
    }

}
