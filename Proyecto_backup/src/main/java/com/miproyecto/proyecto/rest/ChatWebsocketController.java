package com.miproyecto.proyecto.rest;


import java.nio.file.AccessDeniedException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.DestinationVariable;


import com.miproyecto.proyecto.model.MensajeDTO;
import com.miproyecto.proyecto.service.ChatService;
import com.miproyecto.proyecto.service.UsuarioService;

@Controller
public class ChatWebsocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private ChatService chatService;
    @Autowired
    private UsuarioService usuarioService;

    @MessageMapping("/chats.sendMessage")
    public void sendPrivateMessage(MensajeDTO mensajeDTO) {
        String senderId = usuarioService.get(Long.parseLong(mensajeDTO.getSenderId())).getCorreo();
        String receiverId = usuarioService.get(Long.parseLong(mensajeDTO.getReceiverId())).getCorreo();;
        
        if (senderId == null || receiverId == null) {
            throw new SecurityException("El usuario no está autenticado");
        }     
        MensajeDTO mensajeGuardado = chatService.agregarMensajeAChat(mensajeDTO);

        messagingTemplate.convertAndSendToUser(
            senderId,
            "/queue/messages",
            mensajeGuardado
        );
        messagingTemplate.convertAndSendToUser(
            receiverId,
            "/queue/messages",
            mensajeGuardado
        );
    }

    @MessageMapping("/vacantes/{vacanteId}/chat")
    @SendTo("/topic/vacantes/{vacanteId}/chat")
    public MensajeDTO enviarMensajeGrupo(@DestinationVariable String vacanteId, MensajeDTO mensaje) {
        // Validación: que el usuario pertenezca a la vacante (empresa o postulante)
        // if (!chatService.usuarioPerteneceAVacante(mensaje.getSenderId(), vacanteId)) {
        //     throw new AccessDeniedException("No tienes acceso a este chat grupal.");
        // }
        MensajeDTO mensajeGuardado = chatService.agregarMensajeAChat(mensaje);

        return mensajeGuardado; // se envía a todos los suscritos
    }

}
