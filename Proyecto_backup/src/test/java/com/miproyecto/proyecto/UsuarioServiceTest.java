package com.miproyecto.proyecto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.miproyecto.proyecto.domain.Usuario;
import com.miproyecto.proyecto.model.UsuarioDTO;
import com.miproyecto.proyecto.repos.UsuarioRepository;
import com.miproyecto.proyecto.service.UsuarioService;
import com.miproyecto.proyecto.util.NotFoundException;

/**
 * Pruebas unitarias para la clase UsuarioService.
 * 
 * Estas pruebas verifican el comportamiento de los métodos principales del servicio,
 */
@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    /**
     * Verifica que el método findByCorreo devuelva un UsuarioDTO
     * cuando existe un usuario con el correo especificado.
     * 
     * Caso de prueba: El repositorio devuelve un usuario válido.
     * Resultado esperado: El correo del resultado debe coincidir con el esperado.
     */
    @Test
    void testFindByCorreo_debeRetornarUsuarioDTO() {
        Usuario usuario = new Usuario();
        usuario.setCorreo("test@example.com");
        usuario.setRoles(new ArrayList<>());

        when(usuarioRepository.getByCorreo("test@example.com")).thenReturn(Optional.of(usuario));

        var resultado = usuarioService.findByCorreo("test@example.com");

        assertEquals("test@example.com", resultado.getCorreo());
    }

    /**
     * Verifica que el método findAll retorne la lista completa de usuarios.
     * 
     * Caso de prueba: El repositorio devuelve una lista con dos usuarios.
     * Resultado esperado: El tamaño del resultado debe ser 2.
     */
    @Test
    void testFindAll_debeRetornarListaDeUsuarios() {
        List<Usuario> usuarios = List.of(
            new Usuario(1L, "user1@example.com", "pass", new ArrayList<>()),
            new Usuario(2L, "user2@example.com", "pass", new ArrayList<>())
        );

        when(usuarioRepository.findAll()).thenReturn(usuarios);

        var resultado = usuarioService.findAll();

        assertEquals(2, resultado.size());
        verify(usuarioRepository).findAll();
    }

    /**
     * Verifica que el método get devuelva el usuario correspondiente al ID especificado.
     * 
     * Caso de prueba: El repositorio devuelve un usuario con ID 1.
     * Resultado esperado: El resultado debe tener el mismo ID y correo esperado.
     */
    @Test
    void testFindById_debeRetornarUsuario() {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(1L);
        usuario.setCorreo("test@example.com");
        usuario.setRoles(new ArrayList<>());

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        var resultado = usuarioService.get(1L);

        assertEquals(1L, resultado.getIdUsuario());
        assertEquals("test@example.com", resultado.getCorreo());
        verify(usuarioRepository).findById(1L);
    }

    /**
     * Verifica que el método get lance una NotFoundException
     * cuando no se encuentra un usuario con el ID especificado.
     * 
     * Caso de prueba: El repositorio devuelve un Optional vacío.
     * Resultado esperado: Se lanza una excepción NotFoundException.
     */
    @Test
    void testFindById_debeLanzarExcepcionSiNoExiste() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> usuarioService.get(1L));
        verify(usuarioRepository).findById(1L);
    }

    /**
     * Verifica que el método create guarde un nuevo usuario correctamente.
     * 
     * Caso de prueba: Se recibe un UsuarioDTO con datos válidos.
     * Resultado esperado: Se retorna un UsuarioDTO con el mismo correo que el guardado.
     */
    @Test
    void testSave_debeGuardarUsuario() {
        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setCorreo("nuevo@example.com");
        usuarioDTO.setRoles(new ArrayList<>());

        Usuario usuario = new Usuario();
        usuario.setIdUsuario(1L);
        usuario.setCorreo("nuevo@example.com");
        usuario.setRoles(new ArrayList<>());

        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        UsuarioDTO resultado = usuarioService.create(usuarioDTO);

        assertEquals("nuevo@example.com", resultado.getCorreo());
        verify(usuarioRepository).save(any(Usuario.class));
    }
}
