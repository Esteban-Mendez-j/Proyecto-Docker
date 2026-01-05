package com.miproyecto.proyecto.vacante.service;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.miproyecto.proyecto.usuario.model.Usuario;
import com.miproyecto.proyecto.usuario.repository.UsuarioRepository;
import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.vacante.dto.VacanteDTO;
import com.miproyecto.proyecto.vacante.dto.VacanteFavoritaDTO;
import com.miproyecto.proyecto.vacante.model.Vacante;
import com.miproyecto.proyecto.vacante.model.VacanteFavorita;
import com.miproyecto.proyecto.vacante.repository.VacanteFavoritaRepository;
import com.miproyecto.proyecto.vacante.repository.VacanteRepository;


@Service
@Transactional
public class VacanteFavoritoService {

    private final VacanteRepository vacanteRepository;
    private final UsuarioRepository usuarioRepository;
    private final VacanteFavoritaRepository vacanteFavoritaRepository;
    private final VacanteService vacanteService;

    public VacanteFavoritoService(VacanteRepository vacanteRepository, UsuarioRepository usuarioRepository,VacanteService vacanteService, 
            VacanteFavoritaRepository vacanteFavoritaRepository) {
        this.vacanteRepository = vacanteRepository;
        this.usuarioRepository = usuarioRepository;
        this.vacanteFavoritaRepository = vacanteFavoritaRepository;
        this.vacanteService = vacanteService;
    }

    public VacanteFavoritaDTO findById(Long id){
        return vacanteFavoritaRepository.findById(id)
        .map(vacanteFavorita ->  mapToVacantefavoritaDTO( vacanteFavorita , new VacanteFavoritaDTO()))
        .orElseThrow(NotFoundException::new);

    }

    public VacanteFavorita findByIdVacanteAndIdUsuario(Vacante vacante, Usuario usuario){
        return vacanteFavoritaRepository.findByVacanteFavoritaAndUsuarioFavorita(vacante, usuario)
        .orElse(null);
    }

    public Map<String, Object> CreateOrRemove(Long idVacante, Long idUsuario){
        Map<String,Object> response = new HashMap<>();
        Vacante vacante = new Vacante();
        Usuario usuario = new Usuario();
        VacanteFavorita vacanteFavorita = new VacanteFavorita();
        VacanteFavorita vacanteBuscada = new VacanteFavorita();

        vacante = vacanteRepository.findById(idVacante).orElseThrow(NotFoundException::new);
        usuario = usuarioRepository.findById(idUsuario).orElseThrow(NotFoundException::new);

        vacanteBuscada = findByIdVacanteAndIdUsuario(vacante, usuario);
        if (vacanteBuscada != null) {
            delete(vacanteBuscada.getId());
            response.put("status", 204);
            response.put("mensaje", "vacante removida correctamente");
            return response;
        }

        vacanteFavorita.setVacanteFavorita(vacante);
        vacanteFavorita.setUsuarioFavorita(usuario);
        vacanteFavorita.setFechaAgregada(LocalDate.now());
        vacanteFavoritaRepository.save(vacanteFavorita);
        response.put("status", 201);
        response.put("mensaje", "vacante guardada correctamente");
        return response;
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
        vacanteFaVacanteFavoritaDTO.setId(vacanteFavorita.getId());
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
    
    public Page<VacanteDTO> obtenerVacantesFavoritas(Long idUsuario, Pageable pageable) {
        Usuario usuario = new Usuario();
        usuario = usuarioRepository.findById(idUsuario).orElseThrow(NotFoundException::new);

        Page<VacanteFavorita> favoritasPage = vacanteFavoritaRepository
                .findVacantesFavoritasByUsuarioFavorita(usuario, pageable);

        return favoritasPage.map(favorita -> vacanteService.mapToDTO(
                0L,
                idUsuario,
                favorita.getVacanteFavorita(),
                new VacanteDTO()));
    }
}
