package com.miproyecto.proyecto.chats.chatBot.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Metadata {
    private String filePath;
    private String fileName;
    private String fileHash;
}
