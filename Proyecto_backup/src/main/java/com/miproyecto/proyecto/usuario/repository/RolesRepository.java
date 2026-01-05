package com.miproyecto.proyecto.usuario.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miproyecto.proyecto.usuario.model.Roles;



public interface RolesRepository extends JpaRepository<Roles, Long> {
    Roles findByRol(String rol);

} 
