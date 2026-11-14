package com.miproyecto.proyecto.usuario.model;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UsuarioPrincipal implements UserDetails {

    private final Long idUsuario;
    private final String correo;
    private final String contrasena;
    private final Boolean isActive;
    private final String rolPrincipal;
    private final Collection<? extends GrantedAuthority> authorities;

    public UsuarioPrincipal(
            Long idUsuario,
            String correo,
            String contrasena,
            Boolean isActive,
            String rolPrincipal,
            Collection<? extends GrantedAuthority> authorities) {

        this.idUsuario = idUsuario;
        this.correo = correo;
        this.contrasena = contrasena;
        this.isActive = isActive;
        this.rolPrincipal = rolPrincipal;
        this.authorities = authorities;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public String getRolPrincipal() {
        return rolPrincipal;
    }

    @Override
    public String getUsername() {
        return correo;
    }

    @Override
    public String getPassword() {
        return contrasena;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(isActive);
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

}