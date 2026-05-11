package com.miproyecto.proyecto.chats.chatBot.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class ChatBot {
    private String id;
    private String usuarioId;
    private String usuarioRol;
    private Boolean isActive;
    private LocalDateTime fechaCreacion;

    @Builder.Default
    private List<String> nameFiles = new ArrayList<>();

    public void addRuta(String rutaNueva){
        this.nameFiles.add(rutaNueva);
    }
    
    public void deleteRuta(String rutaNueva){
        this.nameFiles.remove(rutaNueva);
    }
}
