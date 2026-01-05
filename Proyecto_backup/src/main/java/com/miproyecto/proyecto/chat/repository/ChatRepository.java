package com.miproyecto.proyecto.chat.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.miproyecto.proyecto.chat.model.Chat;

public interface ChatRepository extends MongoRepository<Chat, String> {
    Optional<Chat> findByEmpresaIdAndCandidatoId(String empresaId, String candidatoId);
    
    Optional<Chat> findByVacanteIdAndCandidatoId(String vacanteId, String candidatoId);
    
    Optional<Chat> findByVacanteIdAndEmpresaId(String vacanteId, String empresaId);

    Optional<Chat> findByVacanteIdAndCandidatoId(Long vacanteId, Long candidatoId);

    Page<Chat> findByEmpresaId(String empresaId,Pageable pageable);

    Page<Chat> findByCandidatoId(String candidatoId,Pageable pageable);
}
