package com.miproyecto.proyecto.service;
import com.miproyecto.proyecto.repos.VacanteRepository;
import com.miproyecto.proyecto.util.NotFoundException;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.miproyecto.proyecto.domain.Usuario;
import com.miproyecto.proyecto.domain.Vacante;
import com.miproyecto.proyecto.domain.VacanteFavorita;
import com.miproyecto.proyecto.model.VacanteDTO;
import com.miproyecto.proyecto.model.VacanteFavoritaDTO;
import com.miproyecto.proyecto.repos.UsuarioRepository;
import com.miproyecto.proyecto.repos.VacanteFavoritaRepository;

@Service
public class VacanteFavoritoService {

    private final VacanteRepository vacanteRepository;
    private final UsuarioRepository usuarioRepository;
    private VacanteFavoritaRepository vacanteFavoritaRepository;

    public VacanteFavoritoService(VacanteRepository vacanteRepository, UsuarioRepository usuarioRepository,
            VacanteFavoritaRepository vacanteFavoritaRepository) {
        this.vacanteRepository = vacanteRepository;
        this.usuarioRepository = usuarioRepository;
        this.vacanteFavoritaRepository = vacanteFavoritaRepository;
    }

    public VacanteFavoritaDTO findById(Long id){
        return vacanteFavoritaRepository.findById(id)
        .map(vacanteFavorita ->  mapToVacantefavoritaDTO( vacanteFavorita , new VacanteFavoritaDTO()))
        .orElseThrow(NotFoundException::new);

    }

    public void Create(Long idVacante, Long idUsuario){

        Vacante vacante = new Vacante();
        Usuario usuario = new Usuario();
        VacanteFavorita vacanteFavorita = new VacanteFavorita();

        vacante = vacanteRepository.findById(idVacante).orElseThrow(NotFoundException::new);
        usuario = usuarioRepository.findById(idUsuario).orElseThrow(NotFoundException::new);

        vacanteFavorita.setVacanteFavorita(vacante);
        vacanteFavorita.setUsuarioFavorita(usuario);
        vacanteFavorita.setFechaAgregada(LocalDate.now());
        vacanteFavoritaRepository.save(vacanteFavorita);
    }

    public void delete(Long id){
        vacanteFavoritaRepository.deleteById(id);
    }
    
    public Map<String,Object> mapResponse(Page<VacanteDTO> pageableResponse, String nameList){
        Map<String,Object> response = new HashMap<>();

        response.put(nameList, pageableResponse.getContent());
        response.put("totalElements", pageableResponse.getTotalElements());
        response.put("pageActual", pageableResponse.getPageable());
        response.put("totalPage", pageableResponse.getTotalPages());
        return response;
    }

    public VacanteFavoritaDTO mapToVacantefavoritaDTO(final VacanteFavorita vacanteFavorita, final VacanteFavoritaDTO vacanteFaVacanteFavoritaDTO){
        vacanteFaVacanteFavoritaDTO.setUsuario(vacanteFavorita.getUsuarioFavorita());
        vacanteFaVacanteFavoritaDTO.setFechaAgregada(vacanteFavorita.getFechaAgregada());
        vacanteFaVacanteFavoritaDTO.setVacante(vacanteFavorita.getVacanteFavorita());
        return vacanteFaVacanteFavoritaDTO;
    }

    public VacanteFavorita mapToEntity(final VacanteFavoritaDTO vacanteFavoritaDTO, final VacanteFavorita vacanteFavorita) {
        vacanteFavorita.setUsuarioFavorita(vacanteFavoritaDTO.getUsuario());
        vacanteFavorita.setFechaAgregada(vacanteFavoritaDTO.getFechaAgregada());
        vacanteFavorita.setVacanteFavorita(vacanteFavoritaDTO.getVacante());
        return vacanteFavorita;
    }
}
