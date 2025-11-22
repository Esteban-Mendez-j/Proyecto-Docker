package com.miproyecto.proyecto.rest;

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

    /**
     * Envía un mensaje privado entre dos usuarios mediante WebSocket.
     *
     * <p>Canal de envío: <b>/app/chats.sendMessage</b></p>
     * <p>Destinos de recepción:</p>
     * <ul>
     *     <li>/user/{correoRemitente}/queue/messages</li>
     *     <li>/user/{correoDestinatario}/queue/messages</li>
     * </ul>
     *
     * @param mensajeDTO Objeto que contiene el ID del remitente, ID del receptor, contenido y metadatos del mensaje.
     * @throws SecurityException si el remitente o receptor no están autenticados.
     *
     * <b>Flujo:</b>
     * <ol>
     *     <li>Valida que el remitente y el receptor existan y tengan correo asignado.</li>
     *     <li>Guarda el mensaje en la base de datos mediante {@link chatService#agregarMensajeAChat}.</li>
     *     <li>Envía el mensaje a ambos usuarios de forma privada usando {@link messagingTemplate#convertAndSendToUser}.</li>
     * </ol>
    */

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

    /**
     * Envía un mensaje a un chat grupal asociado a una vacante.
     *
     * <p>Canal de envío: <b>/app/vacantes/{vacanteId}/chat</b></p>
     * <p>Destino de recepción: <b>/topic/vacantes/{vacanteId}/chat</b></p>
     *
     * @param vacanteId Identificador de la vacante.
     * @param mensaje Objeto con la información del mensaje.
     * @return El mensaje guardado que se difundirá a todos los suscriptores del chat grupal.
     *
     * <b>Notas:</b>
     * <ul>
     *     <li>Se podría validar que el remitente pertenezca a la vacante (empresa o postulante) antes de permitir el envío.</li>
     *     <li>Todos los usuarios suscritos a <b>/topic/vacantes/{vacanteId}/chat</b> recibirán el mensaje.</li>
     * </ul>
    */
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
