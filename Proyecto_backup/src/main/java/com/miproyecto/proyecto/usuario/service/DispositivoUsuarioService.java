package com.miproyecto.proyecto.usuario.service;

import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.miproyecto.proyecto.usuario.dto.RegistroDispositivoDTO;
import com.miproyecto.proyecto.usuario.model.DispositivoUsuario;
import com.miproyecto.proyecto.usuario.repository.DispositivoUsuarioRepository;
import com.miproyecto.proyecto.usuario.model.Usuario;
import com.miproyecto.proyecto.usuario.repository.UsuarioRepository;

@Service
public class DispositivoUsuarioService {

    private final DispositivoUsuarioRepository dispositivoRepository;
    private final UsuarioRepository usuarioRepository;

    public DispositivoUsuarioService(
            DispositivoUsuarioRepository dispositivoRepository,
            UsuarioRepository usuarioRepository) {

        this.dispositivoRepository = dispositivoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public void registrar(Long idUsuario, RegistroDispositivoDTO dto) {

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() ->
                        new IllegalArgumentException("Usuario no encontrado"));

        String token = dto.getToken().trim();

        String plataforma = dto.getPlataforma()
                .trim()
                .toUpperCase(Locale.ROOT);

        if (!plataforma.equals("ANDROID")
                && !plataforma.equals("IOS")
                && !plataforma.equals("WEB")) {

            throw new IllegalArgumentException(
                    "Plataforma no válida");
        }

        // Si el token ya existe, reutilizamos el registro.
        DispositivoUsuario dispositivo = dispositivoRepository
                .findByTokenFcm(token)
                .orElseGet(DispositivoUsuario::new);

        // Asociar el token al usuario que acaba de autenticarse.
        dispositivo.setUsuario(usuario);
        dispositivo.setTokenFcm(token);
        dispositivo.setPlataforma(plataforma);
        dispositivo.setActivo(true);

        dispositivoRepository.save(dispositivo);
    }

    @Transactional
    public void desactivar(Long idUsuario, String token) {

        dispositivoRepository.findByTokenFcm(token.trim())
                .ifPresent(dispositivo -> {

                    Long propietario = dispositivo.getUsuario()
                            .getIdUsuario();

                    // Un usuario solo puede desactivar su propio dispositivo.
                    if (propietario.equals(idUsuario)) {
                        dispositivo.setActivo(false);
                        dispositivoRepository.save(dispositivo);
                    }
                });
    }
}