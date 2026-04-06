package com.miproyecto.proyecto.chats.chatBot.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miproyecto.proyecto.chats.chatBot.service.ChatBotService;
import com.miproyecto.proyecto.util.response.ApiResponseBody;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

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
}
