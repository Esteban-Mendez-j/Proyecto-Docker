package com.miproyecto.proyecto.chats.chatBot.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miproyecto.proyecto.chat.dto.MensajeDTO;
import com.miproyecto.proyecto.chats.chatBot.dto.ChatBotDTO;
import com.miproyecto.proyecto.chats.chatBot.dto.CreateChatBotDTO;
import com.miproyecto.proyecto.chats.chatBot.service.interfaces.ChatBotService;
import com.miproyecto.proyecto.util.response.ApiResponseBody;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/chatBot")
public class ChatBotResource {

    private final ChatBotService chatBotService;

    @GetMapping("/pregunta")
    public ResponseEntity<ApiResponseBody<String>> getMessage(@RequestParam String message) {
        
        ApiResponseBody<String> response = new ApiResponseBody<String>(
                chatBotService.preguntarAlModelo(message), null, null);

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/info")
    public ResponseEntity<ApiResponseBody<ChatBotDTO>> getChatBotByUsuarioID(
        @RequestParam(required = false) String usuarioId
    ) {

        ApiResponseBody<ChatBotDTO> response = new ApiResponseBody<ChatBotDTO>(
                chatBotService.findChatBotByUsuarioId(usuarioId), null, null);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponseBody<String>> crearChatBot(@RequestBody CreateChatBotDTO createChatBotDTO) {
        
        ApiResponseBody<String> response = new ApiResponseBody<String>(
                chatBotService.create(createChatBotDTO) , null, null);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{chatId}/mensajes")
    public ResponseEntity<ApiResponseBody<List<MensajeDTO>>> listarMensajes(@PathVariable String chatId) {
        List<MensajeDTO> mensajes = chatBotService.obtenerMensajesDeChatBot(chatId);
        ApiResponseBody<List<MensajeDTO>> response = new ApiResponseBody<>(mensajes, null, null);
        return ResponseEntity.ok(response);
    }
}
