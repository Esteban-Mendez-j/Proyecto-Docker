package com.miproyecto.proyecto.admin.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.miproyecto.proyecto.postulacion.service.PostuladoService;
import com.miproyecto.proyecto.usuario.model.Roles;
import com.miproyecto.proyecto.usuario.model.Usuario;
import com.miproyecto.proyecto.usuario.repository.RolesRepository;
import com.miproyecto.proyecto.usuario.repository.UsuarioRepository;
import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.vacante.model.Vacante;
import com.miproyecto.proyecto.vacante.repository.VacanteRepository;

@Service
@Transactional
public class AdminService {
    
    @Autowired
    private RolesRepository rolesRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private VacanteRepository vacanteRepository;
    @Autowired
    private PostuladoService postuladoService;


    public void modificarRoles (Long idUsuario, boolean addRole ){
        Usuario usuario = usuarioRepository.findById(idUsuario)
            .orElseThrow(NotFoundException::new);

        Roles adminRole = rolesRepository.findByRol("ADMIN");
        if (usuario.getRoles().contains(adminRole) && addRole) {
            System.out.println("ya tiene el rol administardor"); // hay que pasar elk mensaje a la vista
            return;
        }
   
        if (addRole) {
            usuario.getRoles().add(0, adminRole);
        } else {
            usuario.getRoles().remove(adminRole);
        }
        usuarioRepository.save(usuario);
    }


    public void cambiarIsActive(Long idUsuario, boolean estado, String comentario){
        Usuario usuario = usuarioRepository.findById(idUsuario)
            .orElseThrow(NotFoundException::new);

        if(estado != usuario.getIsActive()){
            usuario.setIsActive(estado);
            usuario.setComentarioAdmin(comentario);
            usuarioRepository.save(usuario);
            postuladoService.cambiarEstadoPorUsuario(idUsuario, estado);
        }
    }

    public void cambiarEstadoVacantes (Long Nvacante, Boolean estado, String comentario ){
        Vacante vacante = vacanteRepository.findById(Nvacante)
            .orElseThrow(NotFoundException::new);

        if(estado != vacante.getIsActive()){
            vacante.setIsActive(estado);
            vacante.setComentarioAdmin(comentario);
            vacanteRepository.save(vacante);
            postuladoService.cambiarEstadoVacantes(Nvacante , estado);
        }   
    }
}
