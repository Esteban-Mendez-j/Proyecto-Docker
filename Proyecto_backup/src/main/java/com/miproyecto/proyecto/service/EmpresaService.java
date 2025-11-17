package com.miproyecto.proyecto.service;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.miproyecto.proyecto.domain.Empresa;
import com.miproyecto.proyecto.domain.Postulado;
import com.miproyecto.proyecto.domain.Roles;
import com.miproyecto.proyecto.domain.Vacante;
import com.miproyecto.proyecto.model.EmpresaDTO;
import com.miproyecto.proyecto.repos.EmpresaRepository;
import com.miproyecto.proyecto.repos.RolesRepository;
import com.miproyecto.proyecto.util.NotFoundException;


@Service
@Transactional
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final PasswordEncoder passwordEncoder;
    private final RolesRepository rolesRepository;

  
    public EmpresaService(EmpresaRepository empresaRepository, 
            PasswordEncoder passwordEncoder, RolesRepository rolesRepository) {
        this.empresaRepository = empresaRepository;
        this.passwordEncoder = passwordEncoder;
        this.rolesRepository = rolesRepository;
    }

    public List<EmpresaDTO> findAll() {
        final List<Empresa> empresas = empresaRepository.findAll(Sort.by("idUsuario"));
        return empresas.stream()
                .map(empresa -> mapToDTO(empresa, new EmpresaDTO()))
                .toList();
    }

    // obtinene una empresa por el idUsuario
    public EmpresaDTO get(final Long idUsuario) {
        return empresaRepository.findById(idUsuario)
                .map(empresa -> mapToDTO(empresa, new EmpresaDTO()))
                .orElseThrow(NotFoundException::new);
    }
    
    public void create(final EmpresaDTO empresaDTO) {
        List<Roles> roles= new ArrayList<>();
        empresaDTO.setIsActive(true);
        empresaDTO.setVerified(false);
        empresaDTO.setFechaRegistro(LocalDate.now());
        roles.add(rolesRepository.findByRol("EMPRESA"));
        Empresa empresa = mapToEntity(empresaDTO, new Empresa(), true);
        empresa.setRoles(roles);
        empresaRepository.save(empresa);
    }

    public void update(final Long idUsuario, final EmpresaDTO empresaDTO) {
        final Empresa empresa = empresaRepository.findById(idUsuario)
                .orElseThrow(NotFoundException::new);
        mapToEntity(empresaDTO, empresa, false);
        empresaRepository.save(empresa);
    }

    public void delete(final Long idUsuario) {
        empresaRepository.deleteById(idUsuario);
    }

    public int contarVacantesActivas (Set<Vacante> listVacantes){
        int numVacantesActivas = 0;
        for(Vacante vacante:listVacantes ){
            if(vacante.getIsActive() && vacante.isActivaPorEmpresa()){numVacantesActivas += 1;}
        }
        return numVacantesActivas;
    }

    public Map<String, Integer> contarCandidatosAceptados(Set<Vacante> listVacantes){
        int numCandidatosAcepados = 0 , numPostulaciones = 0, porcentaje = 0;
        Map<String, Integer> response = new HashMap<String, Integer>();

        for(Vacante vacante:listVacantes ){
            for(Postulado postulacion: vacante.getLitarpostulados()){
                if(postulacion.getEstado().equals("Aceptada")){
                    numCandidatosAcepados +=1;
                }
            }
            numPostulaciones += vacante.getTotalpostulaciones();
        }
        if(numPostulaciones == 0){
            response.put("CandidatosAceptados", 0);
            response.put("PorcentajeAceptacion",  0 );
            return response;
        }
        porcentaje = (numCandidatosAcepados*100)/numPostulaciones;
        response.put("CandidatosAceptados", numCandidatosAcepados);
        response.put("PorcentajeAceptacion",  porcentaje );
        return response;
    }

    private EmpresaDTO mapToDTO(final Empresa empresa, final EmpresaDTO empresaDTO) {  
        Map<String, Integer> aceptadosPostulacion = contarCandidatosAceptados(empresa.getListarVacantes());

        empresaDTO.setIdUsuario(empresa.getIdUsuario());
        empresaDTO.setNombre(empresa.getNombre());
        empresaDTO.setContrasena(empresa.getContrasena());
        empresaDTO.setCorreo(empresa.getCorreo());
        empresaDTO.setTelefono(empresa.getTelefono());
        empresaDTO.setDescripcion(empresa.getDescripcion());
        empresaDTO.setImagen(empresa.getImagen());
        empresaDTO.setSectorEmpresarial(empresa.getSectorEmpresarial());
        empresaDTO.setSitioWeb(empresa.getSitioWeb());
        empresaDTO.setNit(empresa.getNit());
        empresaDTO.setIsActive(empresa.getIsActive());
        empresaDTO.setComentarioAdmin(empresa.getComentarioAdmin());
        empresaDTO.setVerified(empresa.isVerified());
        empresaDTO.setNumeroVacantes(empresa.getListarVacantes().size());
        empresaDTO.setNumeroVacantesActivas(contarVacantesActivas(empresa.getListarVacantes()));
        empresaDTO.setCandidatosAceptados(aceptadosPostulacion.get("CandidatosAceptados"));
        empresaDTO.setPorcentajeAceptacion(aceptadosPostulacion.get("PorcentajeAceptacion"));
        empresaDTO.setVideoLink(empresa.getVideoLink());

        empresaDTO.setRoles(
            empresa.getRoles().stream()
                    .map(roles -> roles.getRol())
                    .collect(Collectors.toList())
        );
        return empresaDTO;
    }

    private Empresa mapToEntity(final EmpresaDTO empresaDTO, final Empresa empresa, boolean create) {
        
        if (create) {
            empresa.setContrasena(passwordEncoder.encode(empresaDTO.getContrasena()));
            empresa.setIsActive(empresaDTO.getIsActive());
            empresa.setComentarioAdmin(empresaDTO.getComentarioAdmin());
        }
        empresa.setNombre(empresaDTO.getNombre());
        empresa.setCorreo(empresaDTO.getCorreo());
        empresa.setTelefono(empresaDTO.getTelefono());
        empresa.setDescripcion(empresaDTO.getDescripcion());
        empresa.setImagen(empresaDTO.getImagen());
        empresa.setSectorEmpresarial(empresaDTO.getSectorEmpresarial());
        empresa.setSitioWeb(empresaDTO.getSitioWeb());
        empresa.setNit(empresaDTO.getNit());
        empresa.setVerified(empresaDTO.isVerified());
        empresa.setVideoLink(empresaDTO.getVideoLink());

        // empresa.setRoles(
        //     empresaDTO.getRoles().stream()
        //             .map(roles -> rolesRepository.findByRol(roles))
        //             .collect(Collectors.toList())
        // );
        return empresa;
    }
    
    public boolean nitExists(final String nit) {
        return empresaRepository.existsByNitIgnoreCase(nit);
    }

    public boolean idUsuarioExists(final Long idUsuario) {
        return empresaRepository.existsByIdUsuario (idUsuario);
    }

}

