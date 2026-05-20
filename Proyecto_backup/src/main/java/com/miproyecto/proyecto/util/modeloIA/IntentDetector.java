package com.miproyecto.proyecto.util.modeloIA;

import java.text.Normalizer;

import org.springframework.stereotype.Component;

import com.miproyecto.proyecto.enums.IntentType;

@Component
public class IntentDetector {
    

    private String normalizar(String texto) {
        String sinTildes = Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");

        return sinTildes.toLowerCase()
                .trim()
                .replaceAll("\\s+", " ")
                .replaceAll("[^a-z0-9 ]", "");
    }

    public String detector(String message) {

        if (message == null || message.isBlank()) {
            return IntentType.DESCONOCIDO.name();
        }

        String m = normalizar(message);

        if (m.contains("que es searchjobs") || m.contains("searchjobs que es")) {
            return IntentType.DESCRIPCION_PLATAFORMA.name();
        }

        if (m.contains("quien eres") || m.contains("que haces") || m.contains("eres un bot")) {
            return IntentType.DESCRIPCION_ASISTENTE.name();
        }

        if (m.contains("postular") || m.contains("postulacion") || m.contains("aplicar")) {
            if (m.contains("requisito") || m.contains("necesito") || m.contains("que necesito")) {
                return IntentType.REQUISITOS_POSTULACION.name();
            }
            if (m.contains("estado") || m.contains("seguimiento") || m.contains("como saber")) {
                return IntentType.ESTADO_POSTULACION.name();
            }
            return IntentType.POSTULACION.name();
        }
        
        if (m.contains("buscar trabajo") || m.contains("como encontrar empleo")) {
            return IntentType.BUSQUEDA_EMPLEO.name();
        }
        
        if (m.contains("vacante") || m.contains("oferta") || m.contains("empleo") || m.contains("trabajo")) {
            return IntentType.VACANTES.name();
        }

        if (m.contains("perfil") || m.contains("hoja de vida") || m.contains("cv")) {
            return IntentType.PERFIL_USUARIO.name();
        }

        if (m.contains("remoto") || m.contains("presencial") || m.contains("tipo de empleo")) {
            return IntentType.TIPOS_EMPLEO.name();
        }

        return IntentType.DESCONOCIDO.name();
    }
}
