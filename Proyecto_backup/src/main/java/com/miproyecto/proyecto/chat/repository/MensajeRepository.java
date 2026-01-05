package com.miproyecto.proyecto.chat.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.miproyecto.proyecto.chat.model.Mensaje;

public interface MensajeRepository extends MongoRepository<Mensaje, String> {
    Page<Mensaje> findByChatIdOrderByTimeAsc(String chatId, Pageable pageable);
}
