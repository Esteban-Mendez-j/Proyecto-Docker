package com.miproyecto.proyecto.util;

import org.springframework.stereotype.Component;

import com.miproyecto.proyecto.enums.IntentType;

@Component
public class IntentDetector {
    
    public String detector(String message){

        if(message == null || message.isBlank()) return IntentType.DESCONOCIDO.name();

        String m = message.toLowerCase().trim()
                .replaceAll("\\s+", " ")
                .replaceAll("[^a-zA-Z0-9áéíóúñ ]", "");

        if(m.contains("que es searchjobs") || m.contains("qué es searchjobs") ){
            return IntentType.DESCRIPCION_PLATAFORMA.name();
        }

        return IntentType.DESCONOCIDO.name();
    }
}
