package com.miproyecto.proyecto.util.exception;

import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class WebSocketExceptionHandler {

    @MessageExceptionHandler(NonTransientAiException.class)
    @SendToUser("/queue/errors")
    public String handleRateLimit(NonTransientAiException ex) {
        return "Excediste el limite de peticiones, intentalo mas tarde";
    }

    @MessageExceptionHandler(Exception.class)
    @SendToUser("/queue/errors")
    public String handleGeneral(Exception ex) {
        System.out.println("""
                ========================
                        ERROR
                ========================    
                """ + "\n" +ex.getMessage()+ "\n");
        return "Error interno del servidor";
    }
}
