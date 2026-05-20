package com.miproyecto.proyecto.chats.chatBot.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.miproyecto.proyecto.chats.chatBot.model.ChatBot;
import java.util.Optional;


public interface ChatBotRepository extends MongoRepository<ChatBot, String> {
    
    Optional<ChatBot> findByUsuarioId(String usuarioId);

    Optional<ChatBot> findByUsuarioIdOrId(String usuarioId, String id);
}
