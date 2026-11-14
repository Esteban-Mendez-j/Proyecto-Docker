package com.miproyecto.proyecto.usuario.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.miproyecto.proyecto.usuario.model.Usuario;
import com.miproyecto.proyecto.usuario.model.UsuarioPrincipal;
import com.miproyecto.proyecto.util.NotFoundException;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UsuarioService usuarioService;

    public CustomUserDetailsService(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        try {
            if (correo == null || correo.isBlank()) {
                throw new UsernameNotFoundException("Correo no puede ser nulo o vacío");
            }
            
            Usuario usuario = usuarioService.findByCorreo(correo, true).orElseThrow(() -> {
                return new UsernameNotFoundException("Usuario no encontrado");
            });
            
            List<GrantedAuthority> authorities = usuario.getRoles()
            .stream()
            .map(rol -> new SimpleGrantedAuthority("ROLE_" + rol.getRol()))
            .collect(Collectors.toList());

            return new UsuarioPrincipal(
                    usuario.getIdUsuario(),
                    usuario.getCorreo(),
                    usuario.getContrasena(),
                    usuario.getIsActive(),
                    usuario.getRoles().get(0).getRol(),
                    authorities);

        } catch (NotFoundException e) {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }
            

    }
}