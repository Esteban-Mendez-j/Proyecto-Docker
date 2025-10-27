package com.miproyecto.proyecto.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.miproyecto.proyecto.dataType.EstadoEnvio;
import com.miproyecto.proyecto.domain.Notificacion;
import com.miproyecto.proyecto.domain.Usuario;
import com.miproyecto.proyecto.model.NotificacionDTO;
import com.miproyecto.proyecto.repos.NotificacionRepository;
import com.miproyecto.proyecto.repos.UsuarioRepository;
import com.miproyecto.proyecto.util.NotFoundException;

@Service
public class NotificacionService {

    private final UsuarioRepository usuarioRepository;
    private final NotificacionRepository notificacionRepository;

    public NotificacionService(UsuarioRepository usuarioRepository, NotificacionRepository notificacionRepository) {
        this.usuarioRepository = usuarioRepository;
        this.notificacionRepository = notificacionRepository;
    }

    public  Map<String, Object> findByDestinatarioAndVisible (Long idUsuario, Pageable pageable, Boolean isVisible){
        String Destinatario = usuarioRepository.findById(idUsuario).orElseThrow(NotFoundException::new).getCorreo();
        
        Page<NotificacionDTO> notificaciones =  notificacionRepository.findAllByDestinatarioAndIsVisibleOrderByFechaEnvioDesc(Destinatario, isVisible, pageable)
            .map(notificacion -> mapToDTO(notificacion, new NotificacionDTO()));

        return mapResponse(notificaciones, "Notificaciones");
    }

    public  Map<String, Object> findByRemitenteAndVisible (Long idUsuario, Pageable pageable, Boolean isVisible){
        String remitente = usuarioRepository.findById(idUsuario).orElseThrow(NotFoundException::new).getCorreo();
        
        Page<NotificacionDTO> notificaciones =  notificacionRepository.findAllByRemitenteAndIsVisibleOrderByFechaEnvioDesc(remitente, isVisible, pageable)
            .map(notificacion -> mapToDTO(notificacion, new NotificacionDTO()));

        return mapResponse(notificaciones, "Notificaciones");
    }

    public  List<NotificacionDTO> findByRemitenteRecientes (Long idUsuario, Boolean isVisible){
        String remitente = usuarioRepository.findById(idUsuario).orElseThrow(NotFoundException::new).getCorreo();
        
        List<NotificacionDTO> notificaciones =  notificacionRepository.findTop5ByRemitenteAndIsVisibleOrderByFechaEnvioDesc(remitente, isVisible)
            .stream()
            .map(notificacion -> mapToDTO(notificacion, new NotificacionDTO()))
            .toList();

        return notificaciones;
    }

    public  List<NotificacionDTO> findByDestinatarioRecientes (Long idUsuario, Boolean isVisible){
        String remitente = usuarioRepository.findById(idUsuario).orElseThrow(NotFoundException::new).getCorreo();
        
        List<NotificacionDTO> notificaciones =  notificacionRepository.findTop5ByDestinatarioAndIsVisibleOrderByFechaEnvioDesc(remitente, isVisible)
            .stream()
            .map(notificacion -> mapToDTO(notificacion, new NotificacionDTO()))
            .toList();
        return notificaciones;
    }

    public NotificacionDTO Create (NotificacionDTO notificacionDTO){

        Usuario remitente = usuarioRepository.findById(Long.parseLong(notificacionDTO.getRemitente())).orElseThrow(NotFoundException::new);

        notificacionDTO.setFechaEnvio(LocalDateTime.now());
        notificacionDTO.setIsVisible(true);
        notificacionDTO.setRemitente(remitente.getCorreo());
        notificacionDTO.setNameRemitente(remitente.getNombre());
        notificacionDTO.setEstadoEnvio(EstadoEnvio.ENVIADO);

        Notificacion notificacion = mapToEntity(notificacionDTO, new Notificacion());

        Long id = notificacionRepository.save(notificacion).getId();
        notificacionDTO.setId(id);
        return notificacionDTO;
    }

    public void  cambiarVisible ( Boolean isVisible,  Long idUsuario){
        String Destinatario = usuarioRepository.findById(idUsuario)
            .orElseThrow(NotFoundException::new).getCorreo();

        Notificacion notificacion = notificacionRepository.findByDestinatario(Destinatario);
        notificacion.setIsVisible(isVisible);

        notificacionRepository.save(notificacion);
    }

    public void  cambiarEstadoEnvio ( EstadoEnvio estado,  Long idUsuario){
        String Destinatario = usuarioRepository.findById(idUsuario)
            .orElseThrow(NotFoundException::new).getCorreo();

        Notificacion notificacion = notificacionRepository.findByDestinatario(Destinatario);
        notificacion.setEstadoEnvio(estado);

        notificacionRepository.save(notificacion);
    }

    public Map<String,Object> mapResponse(Page<NotificacionDTO> pageableResponse, String nameList){
        Map<String,Object> response = new HashMap<>();

        response.put(nameList, pageableResponse.getContent());
        response.put("totalElements", pageableResponse.getTotalElements());
        response.put("pageActual", pageableResponse.getPageable());
        response.put("totalPage", pageableResponse.getTotalPages());
        return response;
    }
    
    public NotificacionDTO mapToDTO (final Notificacion notificacion, final NotificacionDTO notificacionDTO ){
        
        notificacionDTO.setId(notificacion.getId());
        notificacionDTO.setAsunto(notificacion.getAsunto());
        notificacionDTO.setCuerpo(notificacion.getCuerpo());
        notificacionDTO.setFechaEnvio(notificacion.getFechaEnvio());
        notificacionDTO.setDestinatario(notificacion.getDestinatario());
        notificacionDTO.setRemitente(notificacion.getRemitente());
        notificacionDTO.setNameRemitente(notificacion.getNameRemitente());
        notificacionDTO.setIsVisible(notificacion.getIsVisible());
        notificacionDTO.setEstadoEnvio(notificacion.getEstadoEnvio());
        return notificacionDTO;
    }
    
    public Notificacion mapToEntity (final NotificacionDTO notificacionDTO, final Notificacion notificacion ){
        
        notificacion.setId(notificacionDTO.getId());
        notificacion.setAsunto(notificacionDTO.getAsunto());
        notificacion.setCuerpo(notificacionDTO.getCuerpo());
        notificacion.setFechaEnvio(notificacionDTO.getFechaEnvio());
        notificacion.setDestinatario(notificacionDTO.getDestinatario());
        notificacion.setRemitente(notificacionDTO.getRemitente());
        notificacion.setNameRemitente(notificacionDTO.getNameRemitente());
        notificacion.setIsVisible(notificacionDTO.getIsVisible());
        notificacion.setEstadoEnvio(notificacionDTO.getEstadoEnvio());
        return notificacion;
    }

}
