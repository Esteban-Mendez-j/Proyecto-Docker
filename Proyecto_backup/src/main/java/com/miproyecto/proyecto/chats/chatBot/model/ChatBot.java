package com.miproyecto.proyecto.chats.chatBot.model;

import java.time.LocalDateTime;

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
}
