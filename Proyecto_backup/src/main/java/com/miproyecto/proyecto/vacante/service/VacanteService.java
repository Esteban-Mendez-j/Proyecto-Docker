package com.miproyecto.proyecto.vacante.service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.miproyecto.proyecto.aptitudes.model.Aptitudes;
import com.miproyecto.proyecto.aptitudes.service.AptitudesService;
import com.miproyecto.proyecto.candidato.model.Candidato;
import com.miproyecto.proyecto.candidato.repository.CandidatoRepository;
import com.miproyecto.proyecto.empresa.model.Empresa;
import com.miproyecto.proyecto.empresa.repository.EmpresaRepository;
import com.miproyecto.proyecto.ml.service.PrediccionService;
import com.miproyecto.proyecto.optimizacion.dto.OptimizationResponse;
import com.miproyecto.proyecto.optimizacion.dto.VacanteOptimizacionDTO;
import com.miproyecto.proyecto.optimizacion.service.OptimizationService;
import com.miproyecto.proyecto.postulacion.model.Postulado;
import com.miproyecto.proyecto.postulacion.repository.PostuladoRepository;
import com.miproyecto.proyecto.usuario.service.SupabaseStorageService;
import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.util.response.ApiResponseBody;
import com.miproyecto.proyecto.util.response.Meta;
import com.miproyecto.proyecto.util.response.Pagination;
import com.miproyecto.proyecto.vacante.dto.FiltroVacanteDTO;
import com.miproyecto.proyecto.vacante.dto.VacanteDTO;
import com.miproyecto.proyecto.vacante.dto.VacanteResumenDTO;
import com.miproyecto.proyecto.vacante.model.Requisito;
import com.miproyecto.proyecto.vacante.model.Vacante;
import com.miproyecto.proyecto.vacante.model.VacanteFavorita;
import com.miproyecto.proyecto.vacante.repository.VacanteFavoritaRepository;
import com.miproyecto.proyecto.vacante.repository.VacanteRepository;
import com.miproyecto.proyecto.vacante.repository.VacanteSpecifications;

@Service
@Transactional
public class VacanteService {

    private final VacanteFavoritaRepository vacanteFavoritaRepository;
    private final VacanteRepository vacanteRepository;
    private final EmpresaRepository empresaRepository;
    private final PostuladoRepository postuladoRepository;
    private final CandidatoRepository candidatoRepository;
    private final AptitudesService aptitudesService;
    private final PrediccionService prediccionService;
    private final OptimizationService optimizationService;
    private final CargoService cargoService;
    private final RequisitoService requisitoService;
    private final SupabaseStorageService supabaseStorageService;

    public VacanteService(VacanteFavoritaRepository vacanteFavoritaRepository, VacanteRepository vacanteRepository,
            EmpresaRepository empresaRepository, PostuladoRepository postuladoRepository,
            AptitudesService aptitudesService, PrediccionService prediccionService,
            OptimizationService optimizationService, RequisitoService requisitoService,
            CargoService cargoService, SupabaseStorageService supabaseStorageService,
            CandidatoRepository candidatoRepository) {
        this.vacanteFavoritaRepository = vacanteFavoritaRepository;
        this.vacanteRepository = vacanteRepository;
        this.empresaRepository = empresaRepository;
        this.postuladoRepository = postuladoRepository;
        this.aptitudesService = aptitudesService;
        this.prediccionService = prediccionService;
        this.optimizationService = optimizationService;
        this.requisitoService = requisitoService;
        this.cargoService = cargoService;
        this.supabaseStorageService = supabaseStorageService;
        this.candidatoRepository = candidatoRepository;
    }

    public String guardarVideo(MultipartFile file) throws IOException {

        String tipo = file.getContentType();

        if (tipo == null || !tipo.equalsIgnoreCase("video/mp4")) {
            throw new IllegalArgumentException(
                    "Solo se permiten archivos de video MP4");
        }

        if (file.isEmpty()) {
            throw new IllegalArgumentException(
                    "El archivo de video está vacío");
        }

        String nombreOriginal = supabaseStorageService.obtenerNombreSeguro(
                file.getOriginalFilename());

        String nombreArchivo = System.currentTimeMillis()
                + "_"
                + UUID.randomUUID()
                + "_"
                + nombreOriginal;

        supabaseStorageService.subirArchivo(
                "video",
                nombreArchivo,
                file.getBytes(),
                "video/mp4");

        return nombreArchivo;
    }

    public void eliminarVideo(String fileName) throws IOException {

        if (fileName == null || fileName.isBlank()
                || fileName.contains("/")
                || fileName.contains("\\")) {
            throw new IllegalArgumentException(
                    "Nombre de archivo no válido");
        }

        supabaseStorageService.eliminarArchivo(
                "video",
                fileName);
    }

    // Método para incrementar visitas
    public void incrementarVisitas(final Long nvacantes) {
        final Vacante vacante = vacanteRepository.findById(nvacantes)
                .orElseThrow(NotFoundException::new);
        vacante.incrementarVisitas();
        vacanteRepository.save(vacante);
    }

    // filtrado autocompletado
    public List<String> findSugerencias(String query) {
        return vacanteRepository.findTituloByTitulo(query.toLowerCase());
    }

    // listado de todas las vacantes activas
    public ApiResponseBody<List<VacanteDTO>> findAllByEstado(boolean estado, Pageable pageable) {
        Page<Vacante> vacantes = vacanteRepository.findByIsActiveOrderByFechaPublicacionDesc(
                estado, pageable);
        Page<VacanteDTO> vacantesDTO = mapPageVacanteToDTO(vacantes, 0L, 0L);
        return mapResponse(vacantesDTO);
    }

    public ApiResponseBody<List<VacanteDTO>> mapResponse(Page<VacanteDTO> pageableResponse) {
        Pagination pagination = new Pagination(
                pageableResponse.getTotalElements(),
                pageableResponse.getPageable(),
                pageableResponse.getTotalPages());
        Meta meta = new Meta(pagination);
        ApiResponseBody<List<VacanteDTO>> response = new ApiResponseBody<>(
                pageableResponse.getContent(),
                meta,
                null);
        return response;
    }

    // listado de las vacantes que esten relacionados con el idUsuario
    public ApiResponseBody<List<VacanteDTO>> findByIdUsuario(Long idUsuario, Pageable pageable) {
        Empresa empresa = empresaRepository.findById(idUsuario)
                .orElseThrow(() -> new NotFoundException("Empresa no encontrada"));

        Page<Vacante> vacantes = vacanteRepository.findByIdUsuario(empresa, pageable);
        Page<VacanteDTO> vacantesDTO = mapPageVacanteToDTO(vacantes, 0L, idUsuario);
        return mapResponse(vacantesDTO);
    }

    public VacanteDTO findByIdUsuarioAndNvacante(Long idUsuario, Long nVacante) {
        Empresa empresa = empresaRepository.findById(idUsuario)
                .orElse(null);

        return vacanteRepository.findByIdUsuarioAndNvacantes(empresa, nVacante)
                .map(vacante -> mapToDTO(0L, idUsuario, vacante, new VacanteDTO()))
                .orElse(null);
    }

    public ApiResponseBody<List<VacanteDTO>> buscarVacantesConFiltros(Long idPsotulacion, FiltroVacanteDTO filtro,
            Pageable pageable) {

        Page<VacanteDTO> page = null;

        if (Boolean.TRUE.equals(filtro.getIsFavorita())) {
            Specification<VacanteFavorita> specFav = VacanteSpecifications.favoritaConFiltros(idPsotulacion, filtro);
            Page<VacanteFavorita> favPage = vacanteFavoritaRepository.findAll(specFav, pageable);
            page = mapPageVacanteFavoritaToDTO(favPage, idPsotulacion, idPsotulacion);
        } else {
            Specification<Vacante> specification = VacanteSpecifications.conFiltros(idPsotulacion, filtro);
            Page<Vacante> vacPage = vacanteRepository.findAll(specification, pageable);
            page = mapPageVacanteToDTO(vacPage, idPsotulacion, idPsotulacion);
        }
        return mapResponse(page);
    }

    // Obtiene 200 vacantes, calcula la afinidad y ordena usando Pyomo
    public ApiResponseBody<List<VacanteDTO>> buscarVacantesConFiltrosAndOrdenByOptimizacion(
            Long idPsotulacion, FiltroVacanteDTO filtro, Pageable pageableFront) {

        // 1. Definir el número de bloque del backend (cada bloque = 200 vacantes)
        int pageNumber = pageableFront.getPageNumber() / 10;
        Pageable pageableBackend = PageRequest.of(pageNumber, 200);

        // 2. Consultar vacantes del bloque de forma eficiente en lote
        Page<VacanteDTO> page;

        if (Boolean.TRUE.equals(filtro.getIsFavorita())) {
            Specification<VacanteFavorita> specFav = VacanteSpecifications.favoritaConFiltros(idPsotulacion, filtro);
            Page<VacanteFavorita> favPage = vacanteFavoritaRepository.findAll(specFav, pageableBackend);
            page = mapPageVacanteFavoritaToDTO(favPage, idPsotulacion, idPsotulacion);
        } else {
            Specification<Vacante> specification = VacanteSpecifications.conFiltros(idPsotulacion, filtro);
            Page<Vacante> vacPage = vacanteRepository.findAll(specification, pageableBackend);
            page = mapPageVacanteToDTO(vacPage, idPsotulacion, idPsotulacion);
        }

        List<VacanteDTO> vacantes = new ArrayList<>(page.getContent());
        long totalResultados = page.getTotalElements();

        if (vacantes.isEmpty()) {
            return mapResponse(new PageImpl<>(Collections.emptyList(), pageableFront, totalResultados));
        }

        // 3. Obtener aptitudes del candidato UNA SOLA VEZ antes del bucle
        Set<String> aptitudesCandidato = Collections.emptySet();
        if (idPsotulacion != null && idPsotulacion > 0) {
            Candidato candidato = candidatoRepository.findById(idPsotulacion).orElse(null);
            if (candidato != null && candidato.getAptitudes() != null) {
                aptitudesCandidato = candidato.getAptitudes().stream()
                        .map(Aptitudes::getNombreAptitud)
                        .collect(Collectors.toSet());
            }
        }

        // 4. Calcular afinidad directamente en memoria para las 200 vacantes (sin Weka ni queries redundantes)
        List<VacanteOptimizacionDTO> vacantesParaOptimizar = new ArrayList<>();
        LocalDate hoy = LocalDate.now();

        for (VacanteDTO v : vacantes) {
            double prediccion = prediccionService.calcularPorcentajeMatch(aptitudesCandidato, v.getAptitudes());
            v.setPrediccion(prediccion);

            // Armar el DTO para la API en Python
            VacanteOptimizacionDTO optDto = new VacanteOptimizacionDTO();
            optDto.setId(v.getNvacantes());
            optDto.setCompatibility(prediccion / 100.0); // Ajuste a escala 0-1
            optDto.setSalary(v.getSueldo() != null ? v.getSueldo() : 0.0);
            optDto.setTipo(v.getTipo());

            if (v.getFechaPublicacion() != null) {
                optDto.setDays((int) ChronoUnit.DAYS.between(v.getFechaPublicacion(), hoy));
            } else {
                optDto.setDays(0);
            }
            optDto.setPostulations(v.getTotalpostulaciones());

            vacantesParaOptimizar.add(optDto);
        }

        // 5. Llamar al optimizador Pyomo
        OptimizationResponse optResponse = optimizationService.optimizePool(vacantesParaOptimizar);

        Map<Long, VacanteDTO> vacantesMap = vacantes.stream()
                .collect(Collectors.toMap(VacanteDTO::getNvacantes, vac -> vac));

        List<VacanteDTO> vacantesOptimizadas = new ArrayList<>();

        if (optResponse != null && optResponse.getVacantes_recomendadas() != null) {
            for (VacanteOptimizacionDTO dtoPyomo : optResponse.getVacantes_recomendadas()) {
                Long id = dtoPyomo.getId();

                if (vacantesMap.containsKey(id)) {
                    VacanteDTO vacanteDto = vacantesMap.get(id);
                    vacanteDto.setRecomendado(dtoPyomo.isIs_optimized());
                    vacantesOptimizadas.add(vacanteDto);
                }
            }
            vacantes = vacantesOptimizadas;
        }

        // 6. Si el total es MENOR a 200, paginar normalmente
        if (totalResultados < 200) {
            int start = (int) pageableFront.getOffset();
            int end = Math.min(start + pageableFront.getPageSize(), vacantes.size());

            if (start >= end) {
                return mapResponse(new PageImpl<>(Collections.emptyList(), pageableFront, totalResultados));
            }

            List<VacanteDTO> manualPage = vacantes.subList(start, end);
            return mapResponse(new PageImpl<>(manualPage, pageableFront, totalResultados));
        }

        // 7. Paginación normal para bloques de 200 (más de 200 resultados totales)
        int pageInsideBlock = pageableFront.getPageNumber() % 10;
        int start = pageInsideBlock * pageableFront.getPageSize();
        int end = Math.min(start + pageableFront.getPageSize(), vacantes.size());

        if (start >= end) {
            return mapResponse(new PageImpl<>(Collections.emptyList(), pageableFront, totalResultados));
        }

        List<VacanteDTO> pageContent = vacantes.subList(start, end);
        return mapResponse(new PageImpl<>(pageContent, pageableFront, totalResultados));
    }

    public List<VacanteDTO> TopVacantesPorPostulados(Long idEmpresa) {
        Empresa empresa = empresaRepository.findById(idEmpresa)
                .orElse(null);

        return vacanteRepository.findTop6ByIdUsuarioOrderByTotalpostulacionesDesc(empresa).stream()
                .map(v -> mapToDTO(0L, idEmpresa, v, new VacanteDTO()))
                .collect(Collectors.toList());
    }

    public List<VacanteDTO> TopVacantesPorFechaSueldoExperiencia(Long idLogin) {
        Set<Vacante> topVacantes = new HashSet<>();

        topVacantes.addAll(vacanteRepository.findTop2ByIsActiveOrderByFechaPublicacionDesc(true));
        topVacantes.addAll(vacanteRepository.findTop2ByIsActiveOrderByExperienciaAsc(true));
        topVacantes.addAll(vacanteRepository.findTop2ByIsActiveOrderBySueldoDesc(true));

        return topVacantes.stream()
                .filter(vacante -> vacante != null)
                .map(vacante -> mapToDTO(idLogin, idLogin, vacante, new VacanteDTO()))
                .collect(Collectors.toList());
    }

    public VacanteDTO get(Long idLogin, final Long nvacantes) {
        return vacanteRepository.findById(nvacantes)
                .map(vacante -> mapToDTO(idLogin, idLogin, vacante, new VacanteDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public VacanteResumenDTO findVacanteResumenById(final Long nvacantes) {
        return vacanteRepository.findById(nvacantes)
                .map(vacante -> mapToResumenDTO(vacante, new VacanteResumenDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final VacanteDTO vacanteDTO) {
        final Vacante vacante = new Vacante();
        vacanteDTO.setFechaPublicacion(LocalDate.now());
        vacanteDTO.setActive(true);
        vacanteDTO.setActivaPorEmpresa(true);
        mapToEntity(vacanteDTO, vacante);
        return vacanteRepository.save(vacante).getNvacantes();
    }

    public void update(final Long nvacantes, final VacanteDTO vacanteDTO) {
        final Vacante vacante = vacanteRepository.findById(nvacantes)
                .orElseThrow(NotFoundException::new);
        vacanteDTO.setIdUsuario(vacante.getIdUsuario().getIdUsuario());
        vacanteDTO.setFechaPublicacion(vacante.getFechaPublicacion());
        vacanteDTO.setActive(vacante.getIsActive());
        vacanteDTO.setActivaPorEmpresa(vacante.isActivaPorEmpresa());
        mapToEntity(vacanteDTO, vacante);
        vacanteRepository.save(vacante);
    }

    public void updateNumCompartidos(Long nVacantes) {
        final Vacante vacante = vacanteRepository.findById(nVacantes)
                .orElseThrow(NotFoundException::new);
        vacante.setIncrementNumCompartidos(1);
        vacanteRepository.save(vacante);
    }

    public void cambiarEstado(final Long nvacantes, boolean estado) {
        final Vacante vacante = vacanteRepository.findById(nvacantes)
                .orElseThrow(NotFoundException::new);
        vacante.setActivaPorEmpresa(estado);
        vacanteRepository.save(vacante);
    }

    /**
     * Mapea campos básicos de una entidad Vacante hacia VacanteDTO sin forzar
     * la carga de colecciones pesadas como litarpostulados o listaVacnatesFavoritas.
     */
    public void mapBasicFields(
        final Vacante vacante, 
        final VacanteDTO vacanteDTO,
        final Map<Long, List<String>> aptitudesPorVacante,
        final Map<Long, List<String>> requisitosPorVacante
    ) {
        vacanteDTO.setNvacantes(vacante.getNvacantes());
        vacanteDTO.setCargo(vacante.getCargo() != null ? vacante.getCargo().getNombre() : "");
        vacanteDTO.setFechaPublicacion(vacante.getFechaPublicacion());
        vacanteDTO.setSueldo(vacante.getSueldo());
        vacanteDTO.setModalidad(vacante.getModalidad());
        vacanteDTO.setExperiencia(vacante.getExperiencia());
        vacanteDTO.setCiudad(vacante.getCiudad());
        vacanteDTO.setDepartamento(vacante.getDepartamento());
        vacanteDTO.setTitulo(vacante.getTitulo());
        vacanteDTO.setTipo(vacante.getTipo());
        vacanteDTO.setDescripcion(vacante.getDescripcion());
        vacanteDTO.setRequerimientos(vacante.getRequerimientos());
        vacanteDTO.setActive(Boolean.TRUE.equals(vacante.getIsActive()));
        vacanteDTO.setComentarioAdmin(vacante.getComentarioAdmin());
        vacanteDTO.setIdUsuario(vacante.getIdUsuario() == null ? null : vacante.getIdUsuario().getIdUsuario());
        vacanteDTO.setNameEmpresa(
                vacante.getIdUsuario() != null ? vacante.getIdUsuario().getNombre() : "Empresa Desconocida");
        vacanteDTO.setImagenEmpresa(vacante.getIdUsuario() != null ? vacante.getIdUsuario().getImagen() : "null");
        vacanteDTO.setTotalpostulaciones(vacante.getTotalpostulaciones());
        vacanteDTO.setActivaPorEmpresa(vacante.isActivaPorEmpresa());
        vacanteDTO.setNumCompartidos(vacante.getNumCompartidos());
        vacanteDTO.setnPostulados(vacante.getTotalpostulaciones());
        vacanteDTO.setVisitas(vacante.getVisitas());
        vacanteDTO.setVideoLink(vacante.getVideoLink());

        // Aptitudes: obtenemos los nombres desde el mapa.
        if (aptitudesPorVacante != null) {
            vacanteDTO.setAptitudes(
                    aptitudesPorVacante.getOrDefault(
                            vacante.getNvacantes(),
                            Collections.emptyList()));
        } else {
            vacanteDTO.setAptitudes(Collections.emptyList());
        }
        // Requisitos: obtenemos los nombres desde el mapa.
        if (requisitosPorVacante != null) {
            vacanteDTO.setRequisitos(
                    requisitosPorVacante.getOrDefault(
                            vacante.getNvacantes(),
                            Collections.emptyList()));
        } else {
            // Compatibilidad con otros métodos que usan el mapeo original.
            vacanteDTO.setRequisitos(
                    vacante.getRequisitos() == null
                            ? Collections.emptyList()
                            : vacante.getRequisitos().stream()
                                    .map(Requisito::getNombre)
                                    .toList());
        }
    }

    /**
     * Mapea de forma optimizada una página completa de Vacante a VacanteDTO,
     * precargando en lote postulaciones y favoritos del usuario para evitar N+1 queries.
     */
    public Page<VacanteDTO> mapPageVacanteToDTO(Page<Vacante> vacantesPage, Long idPostulaciones, Long idUsuarioAut) {
        List<Vacante> content = vacantesPage.getContent();

        if (content.isEmpty()) {
            return vacantesPage.map(v -> new VacanteDTO());
        }

        List<Long> idsVacantes = content.stream().map(Vacante::getNvacantes).toList();

        // 1. Consulta de requisitos
        Map<Long, List<String>> requisitosPorVacante = requisitoService.obtenerRequisitosPorVacante(idsVacantes);

        // 2. Consulta masiva de aptitudes
        Map<Long, List<String>> aptitudesPorVacante = aptitudesService.obtenerAptitudesPorVacante(idsVacantes);

        // 3. Consulta y agrupación de postulaciones
        Map<Long, Postulado> postulacionesPorVacante = new HashMap<>();

        if (idPostulaciones != null && idPostulaciones > 0L) {
            List<Postulado> postulaciones = postuladoRepository.findByCandidatoIdAndVacanteIds(idPostulaciones, idsVacantes);
            for (Postulado p : postulaciones) {
                if (p.getVacante() != null) {
                    postulacionesPorVacante.put(
                            p.getVacante().getNvacantes(), p);
                }
            }
        }

        // 3. Consulta y agrupación de favoritas
        Set<Long> favoritasIds = Collections.emptySet();
        if (idUsuarioAut != null && idUsuarioAut > 0L) {
            List<Long> favs = vacanteFavoritaRepository.findVacanteIdsFavoritasByUsuarioAndVacanteIds(idUsuarioAut, idsVacantes);
            favoritasIds = new HashSet<>(favs);
        }

        final Set<Long> finalFavoritas = favoritasIds;

        return vacantesPage.map(vacante -> {
            VacanteDTO dto = new VacanteDTO();
            mapBasicFields(vacante, dto, aptitudesPorVacante, requisitosPorVacante);

            Postulado p = postulacionesPorVacante.get(vacante.getNvacantes());
            if (p != null) {
                dto.setCandidatoPostulado(true);
                dto.setEstadoPostulacion(p.getEstado());
            } else {
                dto.setCandidatoPostulado(false);
                dto.setEstadoPostulacion(null);
            }

            dto.setVacanteGuardada(finalFavoritas.contains(vacante.getNvacantes()));
            dto.setNumeroGuardadosFavoritos(0);

            return dto;
        });
    }

    /**
     * Mapea de forma optimizada una página de VacanteFavorita a VacanteDTO.
     */
    public Page<VacanteDTO> mapPageVacanteFavoritaToDTO(Page<VacanteFavorita> favPage, Long idPostulaciones, Long idUsuarioAut) {
        List<VacanteFavorita> content = favPage.getContent();
        if (content.isEmpty()) {
            return favPage.map(vf -> new VacanteDTO());
        }

        List<Long> idsVacantes = content.stream()
                .map(vf -> vf.getVacanteFavorita().getNvacantes())
                .toList();
        // 1. Consulta masiva de requisitos
        Map<Long, List<String>> requisitosPorVacante = requisitoService.obtenerRequisitosPorVacante(idsVacantes);

        // 2. Consulta masiva de aptitudes
        Map<Long, List<String>> aptitudesPorVacante = aptitudesService.obtenerAptitudesPorVacante(idsVacantes);

        Map<Long, Postulado> postulacionesPorVacante = new HashMap<>();
        if (idPostulaciones != null && idPostulaciones > 0L) {
            List<Postulado> postulaciones = postuladoRepository.findByCandidatoIdAndVacanteIds(idPostulaciones, idsVacantes);
            for (Postulado p : postulaciones) {
                if (p.getVacante() != null) {
                    postulacionesPorVacante.put(p.getVacante().getNvacantes(), p);
                }
            }
        }

        return favPage.map(vf -> {
            Vacante vacante = vf.getVacanteFavorita();
            VacanteDTO dto = new VacanteDTO();
            mapBasicFields(vacante, dto, aptitudesPorVacante ,requisitosPorVacante);

            Postulado p = postulacionesPorVacante.get(vacante.getNvacantes());
            if (p != null) {
                dto.setCandidatoPostulado(true);
                dto.setEstadoPostulacion(p.getEstado());
            } else {
                dto.setCandidatoPostulado(false);
                dto.setEstadoPostulacion(null);
            }

            dto.setVacanteGuardada(true);
            dto.setNumeroGuardadosFavoritos(0);

            return dto;
        });
    }

    /**
     * Método público mapToDTO tradicional, optimizado para no generar N+1 queries.
     * Mantiene compatibilidad total con cualquier método que lo invoque.
     */
    public VacanteDTO mapToDTO(Long idPostulaciones, Long idUsuarioAut, final Vacante vacante,
            final VacanteDTO vacanteDTO) {

        List<Long> idsVacantes = Collections.singletonList(
                vacante.getNvacantes());

        Map<Long, List<String>> aptitudesPorVacante = aptitudesService.obtenerAptitudesPorVacante(idsVacantes);

        mapBasicFields(vacante, vacanteDTO, aptitudesPorVacante, null);

        // Postulación del candidato:
        if (idPostulaciones != null && idPostulaciones > 0L) {
            if (vacante.getLitarpostulados() != null && Hibernate.isInitialized(vacante.getLitarpostulados())) {
                vacante.getLitarpostulados().stream()
                        .filter(p -> p.getCandidato() != null && idPostulaciones.equals(p.getCandidato().getIdUsuario()))
                        .findFirst()
                        .ifPresentOrElse(p -> {
                            vacanteDTO.setCandidatoPostulado(true);
                            vacanteDTO.setEstadoPostulacion(p.getEstado());
                        }, () -> {
                            vacanteDTO.setCandidatoPostulado(false);
                            vacanteDTO.setEstadoPostulacion(null);
                        });
            } else {
                postuladoRepository.findByCandidato_IdUsuarioAndVacante_Nvacantes(idPostulaciones, vacante.getNvacantes())
                        .ifPresentOrElse(p -> {
                            vacanteDTO.setCandidatoPostulado(true);
                            vacanteDTO.setEstadoPostulacion(p.getEstado());
                        }, () -> {
                            vacanteDTO.setCandidatoPostulado(false);
                            vacanteDTO.setEstadoPostulacion(null);
                        });
            }
        } else {
            vacanteDTO.setCandidatoPostulado(false);
            vacanteDTO.setEstadoPostulacion(null);
        }

        // Vacante guardada en favoritos:
        if (idUsuarioAut != null && idUsuarioAut > 0L) {
            if (vacante.getListaVacnatesFavoritas() != null && Hibernate.isInitialized(vacante.getListaVacnatesFavoritas())) {
                boolean guardada = vacante.getListaVacnatesFavoritas().stream()
                        .anyMatch(vf -> vf.getUsuarioFavorita() != null && idUsuarioAut.equals(vf.getUsuarioFavorita().getIdUsuario()));
                vacanteDTO.setVacanteGuardada(guardada);
            } else {
                vacanteDTO.setVacanteGuardada(
                        vacanteFavoritaRepository.existsByVacanteFavorita_NvacantesAndUsuarioFavorita_IdUsuario(vacante.getNvacantes(), idUsuarioAut)
                );
            }
        } else {
            vacanteDTO.setVacanteGuardada(false);
        }

        if (vacante.getListaVacnatesFavoritas() != null && Hibernate.isInitialized(vacante.getListaVacnatesFavoritas())) {
            vacanteDTO.setNumeroGuardadosFavoritos(vacante.getListaVacnatesFavoritas().size());
        } else {
            vacanteDTO.setNumeroGuardadosFavoritos(0);
        }

        return vacanteDTO;
    }

    public VacanteResumenDTO mapToResumenDTO(final Vacante vacante, final VacanteResumenDTO vacanteResumenDTO) {
        vacanteResumenDTO.setId(vacante.getNvacantes());
        vacanteResumenDTO.setCiudad(vacante.getCiudad());
        vacanteResumenDTO.setTitulo(vacante.getTitulo());
        vacanteResumenDTO.setTipo(vacante.getTipo());
        vacanteResumenDTO.setActivaPorEmpresa(vacante.isActivaPorEmpresa());
        vacanteResumenDTO.setIsActive(vacante.getIsActive());
        vacanteResumenDTO.setNameEmpresa(vacante.getIdUsuario() != null ? vacante.getIdUsuario().getNombre() : "Empresa Desconocida");
        vacanteResumenDTO.setModalidad(vacante.getModalidad());
        return vacanteResumenDTO;
    }

    public Vacante mapToEntity(final VacanteDTO vacanteDTO, final Vacante vacante) {
        vacante.setCargo(cargoService.getCargoByNombre(vacanteDTO.getCargo()));
        vacante.setFechaPublicacion(vacanteDTO.getFechaPublicacion());
        vacante.setSueldo(vacanteDTO.getSueldo());
        vacante.setModalidad(vacanteDTO.getModalidad());
        vacante.setExperiencia(vacanteDTO.getExperiencia());
        vacante.setCiudad(vacanteDTO.getCiudad());
        vacante.setDepartamento(vacanteDTO.getDepartamento());
        vacante.setTitulo(vacanteDTO.getTitulo());
        vacante.setTipo(vacanteDTO.getTipo());
        vacante.setDescripcion(vacanteDTO.getDescripcion());
        vacante.setRequerimientos(vacanteDTO.getRequerimientos());
        vacante.setIsActive(vacanteDTO.isActive());
        vacante.setActivaPorEmpresa(vacanteDTO.isActivaPorEmpresa());
        vacante.setComentarioAdmin(vacanteDTO.getComentarioAdmin());
        vacante.setNumCompartidos(vacanteDTO.getNumCompartidos());
        vacante.setVideoLink(vacanteDTO.getVideoLink());
        vacante.setRequisitos(requisitoService.findSetRequisitoByNombre(vacanteDTO.getRequisitos())); 
        vacante.setVisitas(vacanteDTO.getVisitas());
        final Empresa idUsuario = vacanteDTO.getIdUsuario() == null ? null
                : empresaRepository.findById(vacanteDTO.getIdUsuario())
                        .orElseThrow(() -> new NotFoundException("idUsuario not found"));
        vacante.setIdUsuario(idUsuario);
        vacante.setAptitudes(aptitudesService.mapToListEntity(vacanteDTO.getAptitudes()));
        return vacante;
    }

}
