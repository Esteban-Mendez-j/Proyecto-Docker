package com.miproyecto.proyecto.aptitudes.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.miproyecto.proyecto.aptitudes.dto.AptitudesDTO;
import com.miproyecto.proyecto.aptitudes.model.Aptitudes;
import com.miproyecto.proyecto.aptitudes.repository.AptitudesRepository;


@Service
public class AptitudesService {
    
    private final AptitudesRepository aptitudesRepository;

    public AptitudesService(final AptitudesRepository aptitudesRepository) {
        this.aptitudesRepository = aptitudesRepository;
    }

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
