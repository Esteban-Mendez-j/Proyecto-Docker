package com.miproyecto.proyecto.unitarias;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.miproyecto.proyecto.dataType.EstadoEnvio;
import com.miproyecto.proyecto.domain.Notificacion;
import com.miproyecto.proyecto.domain.Usuario;
import com.miproyecto.proyecto.model.NotificacionDTO;
import com.miproyecto.proyecto.repos.NotificacionRepository;
import com.miproyecto.proyecto.repos.UsuarioRepository;
import com.miproyecto.proyecto.service.NotificacionService;


/**
 * Pruebas unitarias para la clase NotificacionService.
 * 
 * Estas pruebas verifican el comportamiento de los métodos principales del servicio de notificaciones,
 * incluyendo la creación de notificaciones, la búsqueda por destinatario/remitente y
 * la actualización de visibilidad o estado de envío.
 */
@ExtendWith(MockitoExtension.class)
class NotificacionServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private NotificacionRepository notificacionRepository;

    @InjectMocks
    private NotificacionService notificacionService;

    /**
     * Verifica que el método findByDestinatarioAndVisible devuelva un mapa con notificaciones
     * cuando existen notificaciones visibles para un usuario.
     * 
     * Caso de prueba: El repositorio devuelve una página con una notificación.
     * Resultado esperado: El mapa de respuesta contiene la lista "Notificaciones" con tamaño 1.
     */
    @Test
    void findByDestinatarioAndVisible_ShouldReturnNotificaciones() {
        Long userId = 1L;
        Usuario usuario = new Usuario();
        usuario.setCorreo("test@correo.com");

        when(usuarioRepository.findById(userId)).thenReturn(Optional.of(usuario));

        Notificacion notificacion = new Notificacion("1", "Notificacion de prueba", "test@correo.com", true, EstadoEnvio.ENVIADO);
        Page<Notificacion> page = new PageImpl<>(List.of(notificacion));
        when(notificacionRepository.findAllByDestinatarioAndIsVisibleOrderByFechaEnvioDesc(
                anyString(), anyBoolean(), any(Pageable.class)))
            .thenReturn(page);

        Map<String, Object> response = notificacionService.findByDestinatarioAndVisible(userId, PageRequest.of(0,10), true);

        assertTrue(response.containsKey("Notificaciones"));
        List<?> notificaciones = (List<?>) response.get("Notificaciones");
        assertEquals(1, notificaciones.size());
    }

    /**
     * Verifica que el método Create devuelva un NotificacionDTO correctamente mapeado
     * con los datos del remitente, estado de envío y visibilidad.
     * 
     * Caso de prueba: Se crea una notificación con remitente válido.
     * Resultado esperado: Se devuelve un DTO con ID asignado, correo y nombre del remitente,
     * estado de envío ENVIADO y visibilidad true.
     */
    @Test
    void create_ShouldReturnNotificacionDTO() {
        NotificacionDTO dto = new NotificacionDTO();
        dto.setRemitente("1");
        dto.setAsunto("Hola");
        dto.setCuerpo("Cuerpo del mensaje");

        Usuario remitente = new Usuario();
        remitente.setCorreo("remitente@correo.com");
        remitente.setNombre("Juan");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(remitente));
        when(notificacionRepository.save(any(Notificacion.class)))
                .thenAnswer(invocation -> {
                    Notificacion n = invocation.getArgument(0);
                    n.setId("123");
                    return n;
                });

        NotificacionDTO result = notificacionService.Create(dto);

        assertEquals("123", result.getId());
        assertEquals("remitente@correo.com", result.getRemitente());
        assertEquals("Juan", result.getNameRemitente());
        assertEquals(EstadoEnvio.ENVIADO, result.getEstadoEnvio());
        assertTrue(result.getIsVisible());
    }

    /**
     * Verifica que el método cambiarVisible actualice correctamente la propiedad isVisible
     * de una notificación existente.
     * 
     * Caso de prueba: La notificación inicial tiene isVisible = true.
     * Resultado esperado: Después de llamar al método con false, la notificación tiene isVisible = false.
     */
    @Test
    void cambiarVisible_ShouldUpdateIsVisible() {
        Notificacion notificacion = new Notificacion();
        notificacion.setId("123");
        notificacion.setIsVisible(true);

        when(notificacionRepository.findById("123")).thenReturn(Optional.of(notificacion));
        when(notificacionRepository.save(any(Notificacion.class))).thenReturn(notificacion);

        notificacionService.cambiarVisible(false, "123");

        assertFalse(notificacion.getIsVisible());
    }

    /**
     * Verifica que el método cambiarEstadoEnvio actualice correctamente el estado de envío
     * de una notificación existente.
     * 
     * Caso de prueba: La notificación inicial tiene estado ENVIADO.
     * Resultado esperado: Después de llamar al método con EstadoEnvio.RECIBIDO, la notificación tiene estado RECIBIDO.
     */
    @Test
    void cambiarEstadoEnvio_ShouldUpdateEstado() {
        Notificacion notificacion = new Notificacion();
        notificacion.setId("123");
        notificacion.setEstadoEnvio(EstadoEnvio.ENVIADO);

        when(notificacionRepository.findById("123")).thenReturn(Optional.of(notificacion));
        when(notificacionRepository.save(any(Notificacion.class))).thenReturn(notificacion);

        notificacionService.cambiarEstadoEnvio(EstadoEnvio.RECIBIDO, "123");

        assertEquals(EstadoEnvio.RECIBIDO, notificacion.getEstadoEnvio());
    }
}