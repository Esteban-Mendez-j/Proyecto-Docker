package com.miproyecto.proyecto.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.miproyecto.proyecto.domain.Aptitudes;
import com.miproyecto.proyecto.model.AptitudesDTO;
import com.miproyecto.proyecto.repos.AptitudesRepository;
import com.miproyecto.proyecto.repos.CandidatoRepository;


@Service
public class AptitudesService {
    
    private final AptitudesRepository aptitudesRepository;
    private final CandidatoRepository candidatoRepository;

    public AptitudesService(final AptitudesRepository aptitudesRepository,
            final CandidatoRepository candidatoRepository) {
        this.aptitudesRepository = aptitudesRepository;
        this.candidatoRepository = candidatoRepository;
    }
// //listar todos las aptitudes
//     public List<AptitudesDTO> findAll() {
//         final List<Aptitudes> aptitudes = aptitudesRepository.findAll(Sort.by("idAptitud"));
//         return aptitudes.stream()
//                 .map(aptitud -> mapToDTO(aptitud, new AptitudesDTO()))
//                 .toList();
//     }
//  //borrar y reemplazar aptitudes
//     @Transactional
//     public void replaceAptitudes(Long candidatoId, List<AptitudesDTO> nuevosDTO) {
//         aptitudesRepository.deleteByIdUsuario_IdUsuario(candidatoId);
//         List<Aptitudes> nuevos = nuevosDTO.stream()
//                 .map(dto -> mapToEntity(dto, new Aptitudes()))
//                 .toList();
//         aptitudesRepository.saveAll(nuevos);

//     } 


//         //Aptitudes por idUsuario
//     public List<AptitudesDTO> getAptitudesByIdUsuario(final Long idUsuario) {
//         final Candidato candidato = candidatoRepository.findById(idUsuario)
//         .orElseThrow(NotFoundException::new);
//         final List<Aptitudes> idUsuarioAptitudes = aptitudesRepository.findByCandidato(candidato);
//         if (idUsuarioAptitudes != null) {
//             return idUsuarioAptitudes.stream()
//             .map(aptitudes -> mapToDTO(aptitudes, new AptitudesDTO()))
//             .toList();
//         }
//         return null;
//     }


//     public AptitudesDTO get(final Long idAptitud){
//         return aptitudesRepository.findById(idAptitud)
//                 .map(aptitudes -> mapToDTO(aptitudes, new AptitudesDTO()))
//                 .orElseThrow(NotFoundException::new);

//     }

//         public Long create(final AptitudesDTO aptitudesDTO) {
//         final Aptitudes aptitudes = new Aptitudes();
//         mapToEntity(aptitudesDTO, aptitudes);
//         return aptitudesRepository.save(aptitudes).getIdAptitud();
//     }

//     public void update(final Long idAptitudes, final AptitudesDTO aptitudesDTO) {
//         final Aptitudes aptitudes = aptitudesRepository.findById(idAptitudes)
//                 .orElseThrow(NotFoundException::new);
//         mapToEntity(aptitudesDTO, aptitudes);
//         aptitudesRepository.save(aptitudes);
//     }

//     public void delete(final Long idAptitudes) {
//         aptitudesRepository.deleteById(idAptitudes);
//     }

    public List<Aptitudes> mapToListEntity(final List<String> listAptitudesDTO) {
        List<Aptitudes> listAptitudes = new ArrayList<>();
        if (!listAptitudesDTO.isEmpty()) {
            for (String aptitudes : listAptitudesDTO) {
                listAptitudes.add(aptitudesRepository.findByNombreAptitud(aptitudes));
            }
        }
        return listAptitudes;
    }  

    public AptitudesDTO mapToDTO(final Aptitudes aptitudes, final AptitudesDTO aptitudesDTO) {
        aptitudesDTO.setIdAptitud(aptitudes.getIdAptitud());
        aptitudesDTO.setNombreAptitud(aptitudes.getNombreAptitud());
        return aptitudesDTO;
    }   


    public Aptitudes mapToEntity(final AptitudesDTO aptitudesDTO, final Aptitudes aptitudes) {
        aptitudes.setIdAptitud(aptitudesDTO.getIdAptitud());
        aptitudes.setNombreAptitud(aptitudesDTO.getNombreAptitud());
        return aptitudes;
    }

}
