package com.miproyecto.proyecto.chats.chatBot.service.interfaces;

import java.util.List;

import org.springframework.core.io.Resource;

import com.miproyecto.proyecto.chats.chatBot.model.Documento;

public interface DocumentoService {
    
    void saveDocument(Resource resource);

    Boolean existDocument(Resource resource) throws Exception;

    Documento findByFileName(String FileName);

    boolean hashIsEquals(Resource resource) throws Exception;

    void deleteDocumento(String fileName);

    List<String> findSimilarDocuments(String searchText);
}
