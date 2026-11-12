package com.miproyecto.proyecto.notificacion.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.firebase.messaging.AndroidConfig;
import com.google.firebase.messaging.ApnsConfig;
import com.google.firebase.messaging.Aps;
import com.google.firebase.messaging.BatchResponse;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.MessagingErrorCode;
import com.google.firebase.messaging.MulticastMessage;
import com.google.firebase.messaging.Notification;
import com.google.firebase.messaging.SendResponse;

import com.miproyecto.proyecto.usuario.model.DispositivoUsuario;
import com.miproyecto.proyecto.usuario.repository.DispositivoUsuarioRepository;

@Service
public class NotificacionPushService {

    private static final int MAX_TOKENS = 500;

    private final FirebaseMessaging firebaseMessaging;
    private final DispositivoUsuarioRepository dispositivoRepository;

    public NotificacionPushService(
            FirebaseMessaging firebaseMessaging,
            DispositivoUsuarioRepository dispositivoRepository) {

        this.firebaseMessaging = firebaseMessaging;
        this.dispositivoRepository = dispositivoRepository;
    }

    public Map<String, Integer> notificarNuevaPrediccion(
            String ejecucionId,
            Integer anioPredicho) {

        List<DispositivoUsuario> dispositivos = dispositivoRepository.findByActivoTrue();

        List<String> tokens = dispositivos.stream()
                .map(DispositivoUsuario::getTokenFcm)
                .distinct()
                .toList();

        int totalEnviados = 0;
        int totalFallidos = 0;

        for (int inicio = 0; inicio < tokens.size(); inicio += MAX_TOKENS) {

            int fin = Math.min(inicio + MAX_TOKENS, tokens.size());

            List<String> grupo = tokens.subList(inicio, fin);

            try {

                BatchResponse respuesta = enviarGrupo(
                        grupo,
                        ejecucionId,
                        anioPredicho);

                totalEnviados += respuesta.getSuccessCount();
                totalFallidos += respuesta.getFailureCount();

                procesarTokensInvalidos(grupo, respuesta);

            } catch (FirebaseMessagingException e) {

                totalFallidos += grupo.size();

                System.err.println(
                        "Error enviando notificaciones FCM: "
                                + e.getMessage());
            }
        }

        Map<String, Integer> resultado = new HashMap<>();

        resultado.put("totalDispositivos", tokens.size());
        resultado.put("enviados", totalEnviados);
        resultado.put("fallidos", totalFallidos);

        return resultado;
    }

    private BatchResponse enviarGrupo(
            List<String> tokens,
            String ejecucionId,
            Integer anioPredicho)
            throws FirebaseMessagingException {

        Notification notification = Notification.builder()
                .setTitle("Nueva predicción disponible")
                .setBody(
                        "Ya puedes consultar la nueva predicción "
                                + "de demanda laboral para "
                                + anioPredicho + ".")
                .build();

        Map<String, String> data = new HashMap<>();

        data.put("tipo", "NUEVA_PREDICCION");
        data.put("ejecucion_id", ejecucionId);
        data.put("anio_predicho", String.valueOf(anioPredicho));

        MulticastMessage message = MulticastMessage.builder()
                .addAllTokens(tokens)
                .setNotification(notification)
                .putAllData(data)

                // Configuración Android.
                .setAndroidConfig(
                        AndroidConfig.builder()
                                .setPriority(AndroidConfig.Priority.HIGH)
                                .setNotification(
                                        com.google.firebase.messaging.AndroidNotification
                                                .builder()
                                                .setChannelId("high_importance_channel")
                                                .setSound("default")
                                                .build())
                                .build())

                // Configuración iOS.
                .setApnsConfig(
                        ApnsConfig.builder()
                                .putHeader("apns-priority", "10")
                                .setAps(
                                        Aps.builder()
                                                .setSound("default")
                                                .build())
                                .build())

                .build();

        return firebaseMessaging.sendEachForMulticast(message);
    }

    private void procesarTokensInvalidos(
            List<String> tokens,
            BatchResponse respuesta) {

        List<SendResponse> respuestas = respuesta.getResponses();

        for (int i = 0; i < respuestas.size(); i++) {

            SendResponse sendResponse = respuestas.get(i);

            if (!sendResponse.isSuccessful()) {

                FirebaseMessagingException exception = sendResponse.getException();

                if (exception != null
                        && exception.getMessagingErrorCode() == MessagingErrorCode.UNREGISTERED) {

                    desactivarToken(tokens.get(i));
                }
            }
        }
    }

    @Transactional
    public void desactivarToken(String token) {

        dispositivoRepository.findByTokenFcm(token)
                .ifPresent(dispositivo -> {
                    dispositivo.setActivo(false);
                    dispositivoRepository.save(dispositivo);
                });
    }
}
