package com.miproyecto.proyecto.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.miproyecto.proyecto.model.NotificacionDTO;
import com.miproyecto.proyecto.service.NotificacionService;

@Controller
public class NotificacioSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private NotificacionService notificacionService;


    @MessageMapping("/enviar/notificacion")
    public void sendNotificacion (NotificacionDTO notificacionDTO){
        
        notificacionDTO = notificacionService.Create(notificacionDTO);
        messagingTemplate.convertAndSendToUser(
            notificacionDTO.getDestinatario(),
            "/queue/notificacion",
            notificacionDTO
        );
    }

    @MessageMapping("/enviar/evento")
    public void sendEvento(NotificacionDTO notificacionDTO) {

        String user = notificacionDTO.getDestinatario();

        // Enviar a la bandeja de notificaciones principal
        messagingTemplate.convertAndSendToUser(
            user,
            "/queue/notificacion",
            notificacionDTO
        );

        // Enviar también al canal de eventos
        messagingTemplate.convertAndSendToUser(
            user,
            "/queue/notificacion/evento",
            notificacionDTO
        );
    }

}
