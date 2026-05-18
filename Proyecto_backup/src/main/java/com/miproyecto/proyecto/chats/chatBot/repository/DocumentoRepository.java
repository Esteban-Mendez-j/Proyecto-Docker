package com.miproyecto.proyecto.chats.chatBot.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.miproyecto.proyecto.chats.chatBot.model.Documento;

public interface DocumentoRepository extends MongoRepository<Documento, String> {

    Optional<Documento> findFirstByMetadataFileName(String fileName);
    
    @Query(value = "{ 'metadata.fileName': ?0 }", exists = true)
    Boolean existByFileName(String fileName);

    void deleteByMetadataFileName(String fileName);

}
