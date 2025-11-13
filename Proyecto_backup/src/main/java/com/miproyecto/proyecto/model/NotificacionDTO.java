package com.miproyecto.proyecto.model;

import java.time.LocalDateTime;

import com.miproyecto.proyecto.dataType.EstadoEnvio;

public class NotificacionDTO {
    
    private String Id;
    private String asunto;
    private String cuerpo;
    private LocalDateTime fechaEnvio;
    private String destinatario;
    private String remitente;
    private String nameRemitente; 
    private Boolean isVisible;
    private EstadoEnvio estadoEnvio;
    
    public String getId() {
        return Id;
    }
    public void setId(String id) {
        Id = id;
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
