package com.miproyecto.proyecto.chats.chatBot.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.miproyecto.proyecto.chat.dto.MensajeDTO;
import com.miproyecto.proyecto.chats.chatBot.service.interfaces.ChatBotService;
import com.miproyecto.proyecto.usuario.dto.UsuarioDTO;
import com.miproyecto.proyecto.usuario.service.UsuarioService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class ChatBotSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final UsuarioService usuarioService;
    private final ChatBotService chatBotService;
    
    @MessageMapping("/chat/modelo/enviar/mensaje")
    public void sendPrivateMessage(MensajeDTO mensajeDTO) {

        UsuarioDTO usuario = usuarioService.get(Long.parseLong(mensajeDTO.getSenderId())); 
        String senderId = usuario.getCorreo() ;
        
        if (senderId == null) {
            throw new SecurityException("El usuario no está autenticado");
        } 

        MensajeDTO mensajeGuardado = chatBotService.agregarMensajeChat(mensajeDTO);

        messagingTemplate.convertAndSendToUser(
            senderId,
            "/queue/chatBot/messages",
            mensajeGuardado
        );
        
        String response = chatBotService.preguntarAlModelo(mensajeDTO.getContent(), usuario.getRolPrinciapl());

        MensajeDTO modelResponse = chatBotService.stringToMensajeDTO(response, senderId, mensajeGuardado.getChatId());

        MensajeDTO saveModelResponse = chatBotService.agregarMensajeChat(modelResponse);
        
        messagingTemplate.convertAndSendToUser(
            senderId,
            "/queue/chatBot/response",
            saveModelResponse
        );

    }
    
}
