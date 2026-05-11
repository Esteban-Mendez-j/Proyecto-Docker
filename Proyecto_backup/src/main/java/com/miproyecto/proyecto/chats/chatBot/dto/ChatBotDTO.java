package com.miproyecto.proyecto.chats.chatBot.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatBotDTO {
    private String id;
    private String usuarioId;
    private String usuarioRol;
    private Boolean isActive;
    private LocalDateTime fechaCreacion;
    private List<String> nameFiles;
}
