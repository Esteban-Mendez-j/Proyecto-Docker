package com.miproyecto.proyecto.chats.chatBot.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateChatBotDTO {
    private String usuarioId;
    private String usuarioRol;
}
