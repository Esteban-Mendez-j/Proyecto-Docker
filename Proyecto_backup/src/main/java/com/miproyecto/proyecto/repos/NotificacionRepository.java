package com.miproyecto.proyecto.repos;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.miproyecto.proyecto.dataType.EstadoEnvio;
import com.miproyecto.proyecto.domain.Notificacion;
import java.util.List;


public interface NotificacionRepository extends MongoRepository<Notificacion, String> {

    Page<Notificacion> findAllByDestinatarioAndIsVisibleOrderByFechaEnvioDesc(String Destinatario, Boolean isVisible , Pageable Pageable);

    Page<Notificacion> findAllByRemitenteAndIsVisibleOrderByFechaEnvioDesc(String remitente, Boolean isVisible , Pageable Pageable);

    List<Notificacion> findTop5ByRemitenteAndIsVisibleOrderByFechaEnvioDesc(String destinatario, Boolean isVisible );
    
    List<Notificacion> findTop5ByDestinatarioAndIsVisibleAndEstadoEnvioOrderByFechaEnvioDesc(String Destinatario, Boolean isVisible, EstadoEnvio estado );
    
    Notificacion findByDestinatario(String Destinatario);
    
} 