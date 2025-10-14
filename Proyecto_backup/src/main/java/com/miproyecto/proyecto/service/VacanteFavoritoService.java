package com.miproyecto.proyecto.service;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.miproyecto.proyecto.domain.Usuario;
import com.miproyecto.proyecto.domain.Vacante;
import com.miproyecto.proyecto.domain.VacanteFavorita;
import com.miproyecto.proyecto.model.VacanteDTO;
import com.miproyecto.proyecto.model.VacanteFavoritaDTO;
import com.miproyecto.proyecto.repos.UsuarioRepository;
import com.miproyecto.proyecto.repos.VacanteFavoritaRepository;
import com.miproyecto.proyecto.repos.VacanteRepository;
import com.miproyecto.proyecto.util.NotFoundException;


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
    
        public List<VacanteDTO> obtenerVacantesFavoritas(Long idUsuario) {
        Usuario usuario = new Usuario(); 
        usuario = usuarioRepository.findById(idUsuario).orElseThrow(NotFoundException::new);

        return vacanteFavoritaRepository.findVacantesFavoritasByUsuarioFavorita(usuario).stream()
            .map(vacante -> vacanteService.mapToDTO(0L, vacante.getVacanteFavorita(), new VacanteDTO()))
            .collect(Collectors.toList());
    }
}
