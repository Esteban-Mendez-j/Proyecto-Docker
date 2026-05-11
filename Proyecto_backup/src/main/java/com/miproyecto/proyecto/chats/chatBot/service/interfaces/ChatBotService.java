package com.miproyecto.proyecto.chats.chatBot.service.interfaces;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.miproyecto.proyecto.chat.dto.MensajeDTO;
import com.miproyecto.proyecto.chats.chatBot.dto.ChatBotDTO;
import com.miproyecto.proyecto.chats.chatBot.dto.CreateChatBotDTO;

public interface ChatBotService {
    
    String preguntarAlModelo(String message, String user);

    ChatBotDTO findChatBotById(String chatId);
    
    ChatBotDTO findChatBotByUsuarioId(String usuarioId);
    
    ChatBotDTO findChatBotByChatIdOrUserId(String id, String usuarioId);

    String create(CreateChatBotDTO createChatBotDTO);

    MensajeDTO agregarMensajeChat(MensajeDTO mensajeDTO);

    MensajeDTO stringToMensajeDTO(String message, String receiverId, String chatId);

    List<MensajeDTO> obtenerMensajesDeChatBot(String chatId);

    String guardarArchivosChatBot(MultipartFile file,  Long idUsuario, String chatId) throws IOException;

    void eliminarArchivosChatBot(String chatId, String nameFile) throws IOException;
}
