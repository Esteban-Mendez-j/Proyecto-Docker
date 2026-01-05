package com.miproyecto.proyecto.integracion;


import com.miproyecto.proyecto.candidato.dto.CandidatoDTO;
import com.miproyecto.proyecto.candidato.model.Candidato;
import com.miproyecto.proyecto.usuario.model.Usuario;
import com.miproyecto.proyecto.usuario.repository.UsuarioRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest(properties = "spring.profiles.active=test")
@AutoConfigureMockMvc(addFilters = false)
public class CandidatoIntegracionTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // Helper para crear un CandidatoDTO
    private CandidatoDTO crearCandidatoDTO(String nombre, String apellido, String correo) {
        CandidatoDTO candidato = new CandidatoDTO();
        candidato.setNombre(nombre);
        candidato.setApellido(apellido);
        candidato.setCorreo(correo);
        candidato.setContrasena("1234");
        candidato.setTelefono("3115624543");
        candidato.setNivelEducativo("Licenciatura");
        candidato.setRoles(List.of("ROLE_INVITADO")); // opcional
        candidato.setAptitudes(new ArrayList<>());
        return candidato;
    }

    @Test
    void crearYObtenerCandidato() throws Exception {
        // 1. Crear DTO usando helper
        CandidatoDTO candidato = crearCandidatoDTO("Juan", "Pérez", "juanDaniel@example.com");

        // 2. Guardar candidato
        mockMvc.perform(post("/api/candidatos/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(candidato)))
                .andReturn();

        // 3. Verificar existencia en la base de datos
        Optional<Usuario> optionalUsuario = usuarioRepository.getByCorreo("juanDaniel@example.com");
        assertTrue(optionalUsuario.isPresent(), "El usuario debería existir después de crear el candidato");

        Long idCreado = optionalUsuario.get().getIdUsuario();

        // 4. Obtener por GET
        mockMvc.perform(get("/api/candidatos/edit/" + idCreado))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Juan"))
                .andExpect(jsonPath("$.apellido").value("Pérez"))
                .andExpect(jsonPath("$.correo").value("juanDaniel@example.com"));
    }


    @Test
    void editarCandidato() throws Exception {
        String correoUnico = "juan@example.com";
        CandidatoDTO candidato = crearCandidatoDTO("Juan", "Pérez", correoUnico);
        // Guardar candidato
        mockMvc.perform(post("/api/candidatos/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(candidato)))
                .andReturn();

        Optional<Usuario> optionalUsuario = usuarioRepository.getByCorreo("juan@example.com");
        assertTrue(optionalUsuario.isPresent(), "El usuario debería existir después de crear el candidato");
        Long idCreado = optionalUsuario.get().getIdUsuario();

        // 2. Crear DTO con cambios
        CandidatoDTO candidatoActualizado = crearCandidatoDTO("Juan Carlos", "Pérez Gómez", "juan@example.com");
        candidatoActualizado.setTelefono("3001234567");
        candidatoActualizado.setNivelEducativo("Maestría");

        // 3. Llamar al endpoint PUT
        mockMvc.perform(put("/api/candidatos/edit/" + idCreado)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(candidatoActualizado)))
                .andExpect(status().isOk())
                .andExpect(content().string(idCreado.toString())); // devuelve el id

        // 4. Verificar cambios en DB
        Usuario actualizado = usuarioRepository.findById(idCreado).orElseThrow();
        assertEquals("Juan Carlos", actualizado.getNombre());
        assertEquals("3001234567", actualizado.getTelefono());
        assertEquals("Maestría", ((Candidato)actualizado).getNivelEducativo());
    }

}
