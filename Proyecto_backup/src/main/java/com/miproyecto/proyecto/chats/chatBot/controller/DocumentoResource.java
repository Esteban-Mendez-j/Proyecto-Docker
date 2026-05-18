package com.miproyecto.proyecto.chats.chatBot.controller;

import org.springframework.web.bind.annotation.RestController;

import com.miproyecto.proyecto.chats.chatBot.service.interfaces.DocumentoService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/vector")
public class DocumentoResource {
    private final DocumentoService documentoService;

    @GetMapping("/documento")
    public List<String> getMethodName(@RequestParam String pregunta) {
        return documentoService.findSimilarDocuments(pregunta);
    }
    
}
