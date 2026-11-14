package com.miproyecto.proyecto.usuario.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miproyecto.proyecto.usuario.model.DispositivoUsuario;
import com.miproyecto.proyecto.usuario.model.Usuario;

public interface DispositivoUsuarioRepository
        extends JpaRepository<DispositivoUsuario, Long> {

    Optional<DispositivoUsuario> findByTokenFcm(String tokenFcm);

    List<DispositivoUsuario> findByUsuarioAndActivoTrue(Usuario usuario);

    List<DispositivoUsuario> findByActivoTrue();

}