package com.miproyecto.proyecto.chats.chatBot.model;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Document("vector_store")
public class Documento {

    @Id
    private String id;

    private String content;

    private Metadata metadata;

    private List<Double> embedding;
}