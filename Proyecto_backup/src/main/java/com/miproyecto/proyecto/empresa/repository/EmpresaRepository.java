package com.miproyecto.proyecto.empresa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.miproyecto.proyecto.candidato.model.Candidato;
import com.miproyecto.proyecto.empresa.model.Empresa;


public interface EmpresaRepository extends JpaRepository<Empresa, Long>, JpaSpecificationExecutor<Empresa> {

    
    Candidato findByIdUsuario(Long idUsuario);

    boolean existsByNitIgnoreCase(String nit);

    boolean existsByIdUsuario(Long idUsuario);

}
