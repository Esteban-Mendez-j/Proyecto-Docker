package com.miproyecto.proyecto.domain;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.miproyecto.proyecto.dataType.EstadoEnvio;

@Document
public class Notificacion {
    
    @Id
    private String id;
    private String asunto;
    private String cuerpo;
    private LocalDateTime fechaEnvio;
    private String destinatario;
    private String remitente;
    private String nameRemitente; 
    private Boolean isVisible;
    private EstadoEnvio estadoEnvio;
    
    public Notificacion() {
    }

    public Notificacion(String id, String asunto, String destinatario, Boolean isVisible, EstadoEnvio estadoEnvio) {
        this.id = id;
        this.asunto = asunto;
        this.destinatario = destinatario;
        this.isVisible = isVisible;
        this.estadoEnvio = estadoEnvio;
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    
    public String getAsunto() {
        return asunto;
    }
    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }
    public String getCuerpo() {
        return cuerpo;
    }
    public void setCuerpo(String cuerpo) {
        this.cuerpo = cuerpo;
    }
    public LocalDateTime getFechaEnvio() {
        return fechaEnvio;
    }
    public void setFechaEnvio(LocalDateTime fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }
    public String getDestinatario() {
        return destinatario;
    }
    public void setDestinatario(String destinatario) {
        this.destinatario = destinatario;
    }
    public String getRemitente() {
        return remitente;
    }
    public void setRemitente(String remitente) {
        this.remitente = remitente;
    }
    public String getNameRemitente() {
        return nameRemitente;
    }
    public void setNameRemitente(String nameRemitente) {
        this.nameRemitente = nameRemitente;
    }
    public Boolean getIsVisible() {
        return isVisible;
    }
    public void setIsVisible(Boolean isVisible) {
        this.isVisible = isVisible;
    }
    public EstadoEnvio getEstadoEnvio() {
        return estadoEnvio;
    }
    public void setEstadoEnvio(EstadoEnvio estadoEnvio) {
        this.estadoEnvio = estadoEnvio;
    }

}
