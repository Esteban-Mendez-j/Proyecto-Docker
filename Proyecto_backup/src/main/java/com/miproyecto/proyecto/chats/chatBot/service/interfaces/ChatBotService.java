package com.miproyecto.proyecto.chats.chatBot.service.interfaces;

import java.util.List;

import com.miproyecto.proyecto.chat.dto.MensajeDTO;
import com.miproyecto.proyecto.chats.chatBot.dto.ChatBotDTO;
import com.miproyecto.proyecto.chats.chatBot.dto.CreateChatBotDTO;

public interface ChatBotService {
    
    String preguntarAlModelo(String message);

    ChatBotDTO findChatBotById(String chatId);
    
    ChatBotDTO findChatBotByUsuarioId(String usuarioId);
    
    ChatBotDTO findChatBotByChatIdOrUserId(String id, String usuarioId);

    String generarIntencion(String message);

    String generarContexto(String intentType, String message);

    String buildContext(String intencion, String message);

    String create(CreateChatBotDTO createChatBotDTO);

    MensajeDTO agregarMensajeChat(MensajeDTO mensajeDTO);

    MensajeDTO stringToMensajeDTO(String message, String receiverId, String chatId);

    List<MensajeDTO> obtenerMensajesDeChatBot(String chatId);
}
