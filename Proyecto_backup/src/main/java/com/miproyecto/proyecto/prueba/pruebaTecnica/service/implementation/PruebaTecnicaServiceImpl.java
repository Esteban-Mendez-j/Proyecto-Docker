package com.miproyecto.proyecto.prueba.pruebaTecnica.service.implementation;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.HexFormat;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.ComparaPruebaDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.CompararOpcionesDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.CompararPreguntaDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.PreguntaDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.dto.PruebaTecnicaDTO;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.Pregunta;
import com.miproyecto.proyecto.prueba.pruebaTecnica.model.PruebaTecnica;
import com.miproyecto.proyecto.prueba.pruebaTecnica.repository.PruebaTecnicaRepository;
import com.miproyecto.proyecto.prueba.pruebaTecnica.service.interfaces.PruebaTecnicaService;
import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.util.response.BadRequest;
import com.miproyecto.proyecto.vacante.model.Vacante;
import com.miproyecto.proyecto.vacante.repository.VacanteRepository;

@Service
public class PruebaTecnicaServiceImpl implements PruebaTecnicaService{
    private final PruebaTecnicaRepository pruebaTecnicaRepository;
    private final PreguntaServiceImpl preguntaService;
    private final VacanteRepository vacanteRepository;
    private final ObjectMapper objectMapper;

    public PruebaTecnicaServiceImpl(PruebaTecnicaRepository pruebaTecnicaRepository, PreguntaServiceImpl preguntaService,
            VacanteRepository vacanteRepository, ObjectMapper objectMapper) {
        this.pruebaTecnicaRepository = pruebaTecnicaRepository;
        this.preguntaService = preguntaService;
        this.vacanteRepository = vacanteRepository;
        this.objectMapper = objectMapper;
    }
    
    @Override
    public PruebaTecnicaDTO findDtoById(Long id) {

        return mapToDTO(pruebaTecnicaRepository
                .findById(id)
                .orElseThrow(NotFoundException::new));
    }
    
    @Override
    public PruebaTecnica findEntityById(Long id) {

        return pruebaTecnicaRepository
                .findById(id)
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public Long create(PruebaTecnicaDTO pruebaTecnicaDTO) throws JsonProcessingException, NoSuchAlgorithmException{
        Vacante vacante = vacanteRepository.findById(pruebaTecnicaDTO.getIdVacante())
                .orElseThrow(NotFoundException::new);

        PruebaTecnica pruebaAnteriror = pruebaTecnicaRepository.findFirstByVacanteOrderByVersionDesc(vacante)
            .orElse(null);

        pruebaTecnicaDTO.setVersion( pruebaAnteriror != null? pruebaAnteriror.getVersion() + 1:  pruebaTecnicaDTO.getVersion() + 1);  
        pruebaTecnicaDTO.setIsActive(true);
        pruebaTecnicaDTO.setFechaCreacion(LocalDate.now());
        pruebaTecnicaDTO.setHash(generateSHA256(pruebaTecnicaDTO));
        
        PruebaTecnica pruebaTecnica = mapToEntity(pruebaTecnicaDTO);
        pruebaTecnica.setVacante(vacante);
        return pruebaTecnicaRepository.save(pruebaTecnica).getId();
    }

    @Override
    @Transactional
    public Long update(PruebaTecnicaDTO pruebaTecnicaDTO) throws JsonProcessingException, NoSuchAlgorithmException{
        PruebaTecnica pruebaVersionAnteriror = pruebaTecnicaRepository
                .findById(pruebaTecnicaDTO.getId())
                .orElseThrow(NotFoundException::new);

        String hashPruebaEntrante = generateSHA256(pruebaTecnicaDTO);

        if(hashPruebaEntrante.equals(pruebaVersionAnteriror.getHash())){
            throw new BadRequest("No hubo nigun cambio");
            // return pruebaTecnicaDTO.getId();
        }

        pruebaVersionAnteriror.setIsActive(false); 
        pruebaVersionAnteriror.setHash(generateSHA256(mapToDTO(pruebaVersionAnteriror)));
        pruebaTecnicaRepository.save(pruebaVersionAnteriror);

        pruebaTecnicaDTO.setId(null);
        List<PreguntaDTO> preguntas = pruebaTecnicaDTO.getPreguntas()
            .stream()
            .map(pregunta -> {
                pregunta.setId(null);
                pregunta.setOpciones(
                    pregunta.getOpciones()
                    .stream()
                    .map(respuesta -> {
                        respuesta.setId(null);
                        return respuesta;
                    }).toList()
                );
                return pregunta;
            }).toList();
        pruebaTecnicaDTO.setPreguntas(preguntas);
        return create(pruebaTecnicaDTO);
    }


    public void setIsActiveById(Boolean estado, Long id){

        PruebaTecnica pruebaTecnica = pruebaTecnicaRepository.findById(id)
            .orElseThrow(NotFoundException::new);

        pruebaTecnica.setIsActive(estado);
        pruebaTecnicaRepository.save(pruebaTecnica);
    }

    @Override
    @Transactional(readOnly = true)
    public PruebaTecnicaDTO getPruebaTecnicaById(Long id) {
        return pruebaTecnicaRepository.findById(id)
                .map(pruebaTecnica -> mapToDTO(pruebaTecnica))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    @Transactional(readOnly = true)
    public PruebaTecnicaDTO getPruebaTecnicaByIdVacanteAndIsActive(Long idVacante, Boolean isActive){
        Vacante vacante = vacanteRepository.findById(idVacante)
                .orElseThrow(NotFoundException::new);
        
        return pruebaTecnicaRepository.findByVacanteAndIsActive(vacante, isActive)
                .map(pruebaTecnica -> mapToDTO(pruebaTecnica))
                .orElseThrow(NotFoundException::new);
    }


    private ComparaPruebaDTO normalizar(PruebaTecnicaDTO dto) {

        List<CompararPreguntaDTO> preguntas =  dto.getPreguntas()
        .stream()
        .map(pregunta -> preguntaService.mapDtoToCompararDTO(pregunta))
        .collect(Collectors.toList());
        
        ComparaPruebaDTO prueba = new ComparaPruebaDTO(
            dto.getTitulo(),
            dto.getDescripcion(),
            dto.getTiempoParaResponder(),
            preguntas,
            dto.getIsActive(),
            dto.getIdVacante()
        );

        prueba.getPreguntas()
                .sort(Comparator.comparing(CompararPreguntaDTO::getOrden));

        prueba.getPreguntas().forEach(p -> p.getOpciones()
                .sort(Comparator.comparing(CompararOpcionesDTO::getOrden)));

        return prueba;
    }

    public String generateSHA256(PruebaTecnicaDTO prueba ) throws JsonProcessingException, NoSuchAlgorithmException{
        
        String json = objectMapper.writeValueAsString(normalizar(prueba));
       
        MessageDigest  digest = MessageDigest.getInstance("SHA-256");
        byte [] hashByte = digest.digest(json.getBytes());
        String hashHex= HexFormat.of().formatHex(hashByte);
        
        return hashHex;
    }

    public PruebaTecnicaDTO mapToDTO(PruebaTecnica pruebaTecnica){
        PruebaTecnicaDTO pruebaTecnicaDTO = new PruebaTecnicaDTO();

        pruebaTecnicaDTO.setId(pruebaTecnica.getId());
        pruebaTecnicaDTO.setTitulo(pruebaTecnica.getTitulo());
        pruebaTecnicaDTO.setDescripcion(pruebaTecnica.getDescripcion());
        pruebaTecnicaDTO.setTiempoParaResponder(pruebaTecnica.getTiempoParaResponder());
        pruebaTecnicaDTO.setTotalPreguntas(pruebaTecnica.getPreguntas().size());
        pruebaTecnicaDTO.setVersion(pruebaTecnica.getVersion());
        pruebaTecnicaDTO.setIsActive(pruebaTecnica.getIsActive());
        pruebaTecnicaDTO.setFechaCreacion(pruebaTecnica.getFechaCreacion());
        pruebaTecnicaDTO.setHash(pruebaTecnica.getHash());
        pruebaTecnicaDTO.setIdVacante(pruebaTecnica.getVacante().getNvacantes());
        pruebaTecnicaDTO.setPreguntas(
            pruebaTecnica.getPreguntas()
            .stream()
            .map(pregunta -> preguntaService.mapToDTO(pregunta))
            .toList()
        );
        return pruebaTecnicaDTO;
    }

    public PruebaTecnica mapToEntity(PruebaTecnicaDTO pruebaTecnicaDTO){
        PruebaTecnica pruebaTecnica = new PruebaTecnica();

        pruebaTecnica.setId(pruebaTecnicaDTO.getId());
        pruebaTecnica.setTitulo(pruebaTecnicaDTO.getTitulo());
        pruebaTecnica.setDescripcion(pruebaTecnicaDTO.getDescripcion());
        pruebaTecnica.setTiempoParaResponder(pruebaTecnicaDTO.getTiempoParaResponder());
        pruebaTecnica.setVersion(pruebaTecnicaDTO.getVersion());
        pruebaTecnica.setIsActive(pruebaTecnicaDTO.getIsActive());
        pruebaTecnica.setFechaCreacion(pruebaTecnicaDTO.getFechaCreacion());
        pruebaTecnica.setHash(pruebaTecnicaDTO.getHash());
        pruebaTecnica.setPreguntas(
            pruebaTecnicaDTO.getPreguntas()
            .stream()
            .map(preguntaDTO -> {
                Pregunta pregunta = preguntaService.mapToEntity(preguntaDTO);
                pregunta.setPrueba(pruebaTecnica);
                return pregunta;
            })
            .toList()
        );
        return pruebaTecnica;
    }
}
