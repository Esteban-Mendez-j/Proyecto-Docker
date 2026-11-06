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
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Cache;
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
import com.miproyecto.proyecto.vacante.dto.BloqueVacantesCache;
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

    private final VacantesCacheService vacantesCacheService;
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
    @Qualifier("vacantesOptimizadasCache")
    private final Cache<String, BloqueVacantesCache> vacantesOptimizadasCache;
    private final ObjectMapper objectMapper;
    private static final Logger log = LoggerFactory.getLogger(VacanteService.class);

    public VacanteService(VacanteFavoritaRepository vacanteFavoritaRepository, VacanteRepository vacanteRepository,
            EmpresaRepository empresaRepository, PostuladoRepository postuladoRepository,
            CandidatoRepository candidatoRepository, AptitudesService aptitudesService,
            PrediccionService prediccionService, OptimizationService optimizationService, CargoService cargoService,
            RequisitoService requisitoService, SupabaseStorageService supabaseStorageService,
            Cache<String, BloqueVacantesCache> vacantesOptimizadasCache, ObjectMapper objectMapper, VacantesCacheService vacantesCacheService) {
        this.vacanteFavoritaRepository = vacanteFavoritaRepository;
        this.vacanteRepository = vacanteRepository;
        this.empresaRepository = empresaRepository;
        this.postuladoRepository = postuladoRepository;
        this.candidatoRepository = candidatoRepository;
        this.aptitudesService = aptitudesService;
        this.prediccionService = prediccionService;
        this.optimizationService = optimizationService;
        this.cargoService = cargoService;
        this.requisitoService = requisitoService;
        this.supabaseStorageService = supabaseStorageService;
        this.vacantesOptimizadasCache = vacantesOptimizadasCache;
        this.objectMapper = objectMapper;
        this.vacantesCacheService = vacantesCacheService;
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
                .map(vacante -> mapToDTO(0L, idUsuario, vacante, new VacanteDTO(), true, true,Collections.emptySet()))
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
        Long idPsotulacion,
        FiltroVacanteDTO filtro,
        Pageable pageableFront) {

        final int TAMANO_BLOQUE = 200;

        // Este cálculo funciona si el tamaño de página divide exactamente 200.
        int pageSize = pageableFront.getPageSize();

        if (TAMANO_BLOQUE % pageSize != 0) {
            throw new IllegalArgumentException("El tamaño de página debe dividir exactamente el bloque de 200 vacantes.");
        }

        // Posición global de la primera vacante solicitada.
        long posicionInicial = pageableFront.getOffset();

        // Determinar el bloque que contiene la página solicitada.
        int numeroBloque = (int) (posicionInicial / TAMANO_BLOQUE);

        // Obtener las vacantes optimizadas del bloque.
        BloqueVacantesCache bloque = obtenerBloqueOptimizado( idPsotulacion, filtro, numeroBloque);

        // Estadísticas de Caffeine
        log.info("========== ESTADÍSTICAS DE CACHÉ ==========");
        log.info("Entradas almacenadas: {}", vacantesOptimizadasCache.estimatedSize());
        log.info("Hits: {}", vacantesOptimizadasCache.stats().hitCount());
        log.info("Misses: {}", vacantesOptimizadasCache.stats().missCount());
        log.info("Hit Rate: {}", vacantesOptimizadasCache.stats().hitRate());
        log.info("Cargas exitosas: {}", vacantesOptimizadasCache.stats().loadSuccessCount());
        log.info("Cargas fallidas: {}", vacantesOptimizadasCache.stats().loadFailureCount());
        log.info("Eliminaciones: {}", vacantesOptimizadasCache.stats().evictionCount());
        log.info("============================================");

        List<VacanteDTO> vacantes = bloque.vacantes();

        // Calcular qué posiciones del bloque corresponden a esta página.
        int inicio = (int) (posicionInicial % TAMANO_BLOQUE);
        int fin = Math.min(inicio + pageSize, vacantes.size());

        if (inicio >= fin) {
            return mapResponse(new PageImpl<>( Collections.emptyList(), pageableFront, bloque.totalResultados()));
        }

        List<VacanteDTO> contenido = new ArrayList<>(vacantes.subList(inicio, fin));

        return mapResponse(new PageImpl<>( contenido, pageableFront, bloque.totalResultados()));
    }

    private List<VacanteDTO> optimizarVacantes(
            Long idPsotulacion,
            List<VacanteDTO> vacantes) {

        // 1. Obtener las aptitudes del candidato una sola vez.
        Set<String> aptitudesCandidato = Collections.emptySet();

        if (idPsotulacion != null && idPsotulacion > 0) {

            Candidato candidato = candidatoRepository
                    .findById(idPsotulacion)
                    .orElse(null);

            if (candidato != null && candidato.getAptitudes() != null) {

                aptitudesCandidato = candidato.getAptitudes()
                        .stream()
                        .map(Aptitudes::getNombreAptitud)
                        .collect(Collectors.toSet());
            }
        }

        // 2. Calcular afinidad y preparar los datos para Pyomo.
        List<VacanteOptimizacionDTO> vacantesParaOptimizar = new ArrayList<>();

        LocalDate hoy = LocalDate.now();

        for (VacanteDTO v : vacantes) {

            double prediccion = prediccionService.calcularPorcentajeMatch( aptitudesCandidato, v.getAptitudes());

            v.setPrediccion(prediccion);

            VacanteOptimizacionDTO optDto = new VacanteOptimizacionDTO();

            optDto.setId(v.getNvacantes());
            optDto.setCompatibility(prediccion / 100.0);
            optDto.setSalary(v.getSueldo() != null ? v.getSueldo() : 0.0);
            optDto.setTipo(v.getTipo());

            if (v.getFechaPublicacion() != null) {
                optDto.setDays((int) ChronoUnit.DAYS.between( v.getFechaPublicacion(), hoy));
            } else {
                optDto.setDays(0);
            }

            optDto.setPostulations(v.getTotalpostulaciones());

            vacantesParaOptimizar.add(optDto);
        }

        // 3. Ejecutar la optimización con Pyomo.
        OptimizationResponse optResponse = optimizationService.optimizePool(vacantesParaOptimizar);

        // 4. Relacionar los resultados de Pyomo con los DTO originales.
        Map<Long, VacanteDTO> vacantesMap = vacantes.stream()
                .collect(Collectors.toMap( VacanteDTO::getNvacantes, vac -> vac));

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
            return vacantesOptimizadas;
        }

        // Si Pyomo no devuelve resultados, conservamos las vacantes
        // con su afinidad calculada, como hacía tu método original.
        return vacantes;
    }

    private BloqueVacantesCache cargarYOptimizarBloque(
            Long idPsotulacion,
            FiltroVacanteDTO filtro,
            int numeroBloque) {

        log.info("EJECUTANDO CONSULTA Y OPTIMIZACIÓN");
        log.info("Bloque solicitado: {}", numeroBloque);

        final int TAMANO_BLOQUE = 200;

        Pageable pageableBackend = PageRequest.of( numeroBloque, TAMANO_BLOQUE);

        Page<VacanteDTO> page;

        // Consultar vacantes favoritas o todas las vacantes filtradas.
        if (Boolean.TRUE.equals(filtro.getIsFavorita())) {

            Specification<VacanteFavorita> specFav = VacanteSpecifications.favoritaConFiltros(
                    idPsotulacion,
                    filtro);

            Page<VacanteFavorita> favPage = vacanteFavoritaRepository.findAll(
                    specFav,
                    pageableBackend);

            page = mapPageVacanteFavoritaToDTO( favPage, idPsotulacion, idPsotulacion);

        } else {

            Specification<Vacante> specification = VacanteSpecifications.conFiltros(
                    idPsotulacion,
                    filtro);

            Page<Vacante> vacPage = vacanteRepository.findAll(
                    specification,
                    pageableBackend);

            page = mapPageVacanteToDTO( vacPage, idPsotulacion, idPsotulacion);
        }

        List<VacanteDTO> vacantes = new ArrayList<>(page.getContent());

        long totalResultados = page.getTotalElements();

        if (vacantes.isEmpty()) {
            return new BloqueVacantesCache( Collections.emptyList(), totalResultados);
        }

        // Optimizar las vacantes del bloque.
        List<VacanteDTO> vacantesOptimizadas = optimizarVacantes(idPsotulacion, vacantes);

        return new BloqueVacantesCache( vacantesOptimizadas, totalResultados);
    }

    private BloqueVacantesCache obtenerBloqueOptimizado(
            Long idPsotulacion,
            FiltroVacanteDTO filtro,
            int numeroBloque) {

        try {
            // Convertimos los filtros a JSON para construir una clave estable.
            String filtrosJson = objectMapper.writeValueAsString(filtro);

            // La caché se diferencia por usuario, bloque y filtros.
            String cacheKey = idPsotulacion+ "|" + numeroBloque + "|" + filtrosJson;

            log.info("`\n========== DEBUG CACHÉ ==========");
            log.info("Usuario: {}", idPsotulacion);
            log.info("Número de bloque: {}", numeroBloque);
            log.info("Filtros JSON: {}", filtrosJson);
            log.info("Clave de caché: {}", cacheKey);
            log.info("================================");

            // Si existe, devuelve el resultado.
            // Si no existe, ejecuta la consulta y optimización.
            return vacantesCacheService.obtenerBloque(
                    idPsotulacion,
                    cacheKey,
                    () -> cargarYOptimizarBloque( idPsotulacion, filtro, numeroBloque)
            );

        } catch (JsonProcessingException e) {
            throw new IllegalStateException(
                    "No fue posible generar la clave de caché de las vacantes.", e);
        }
    }

    public List<VacanteDTO> TopVacantesPorPostulados(Long idEmpresa) {
        Empresa empresa = empresaRepository.findById(idEmpresa)
                .orElse(null);

        return vacanteRepository.findTop6ByIdUsuarioOrderByTotalpostulacionesDesc(empresa).stream()
                .map(v -> mapToDTO(0L, idEmpresa, v, new VacanteDTO(), false, false,Collections.emptySet()))
                .collect(Collectors.toList());
    }

    public List<VacanteDTO> TopVacantesPorFechaSueldoExperiencia(Long idLogin) {
        List<Vacante> topVacantes = vacanteRepository.findTopVacantesCombinadas(true);

        List<Long> idsVacantes = topVacantes.stream()
                .filter(Objects::nonNull)
                .map(Vacante::getNvacantes)
                .toList();

        // 2. Consultar favoritos una sola vez.
        Set<Long> favoritasIds = Collections.emptySet();

        if (idLogin != null && idLogin > 0L && !idsVacantes.isEmpty()) {
            favoritasIds = new HashSet<>(
                    vacanteFavoritaRepository.findVacanteIdsFavoritasByUsuarioAndVacanteIds(idLogin,idsVacantes));
        }

        // 3. Mapear las vacantes reutilizando el resultado.
        final Set<Long> favoritasFinal = favoritasIds;

        return topVacantes.stream()
                .filter(vacante -> vacante != null)
                .map(vacante -> mapToDTO(idLogin, idLogin, vacante, new VacanteDTO(), false, false, favoritasFinal))
                .collect(Collectors.toList());
    }

    public VacanteDTO get(Long idLogin, final Long nvacantes) {
        return vacanteRepository.findById(nvacantes)
                .map(vacante -> mapToDTO(idLogin, idLogin, vacante, new VacanteDTO(),true, true, null))
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
            vacanteDTO.setRequisitos(Collections.emptyList());
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
            final VacanteDTO vacanteDTO, Boolean searchAptitudes, Boolean searchRequisitos, Set<Long> favoritasIds ) {

        List<Long> idsVacantes = Collections.singletonList(
                vacante.getNvacantes());

        Map<Long, List<String>> aptitudesPorVacante = Collections.emptyMap();
        Map<Long, List<String>> requisitosPorVacante = Collections.emptyMap();

        if (searchAptitudes) {
            aptitudesPorVacante = aptitudesService.obtenerAptitudesPorVacante(idsVacantes);
        }

        if (searchRequisitos) {
            requisitosPorVacante = requisitoService.obtenerRequisitosPorVacante(idsVacantes);
        }

        mapBasicFields(vacante, vacanteDTO, aptitudesPorVacante, requisitosPorVacante);

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

            if (favoritasIds != null) {
                // Utiliza el conjunto previamente consultado.
                vacanteDTO.setVacanteGuardada(favoritasIds.contains(vacante.getNvacantes()));

            } else if (vacante.getListaVacnatesFavoritas() != null && Hibernate.isInitialized(vacante.getListaVacnatesFavoritas())) {
                // Utiliza la colección si ya está inicializada.
                boolean guardada = vacante.getListaVacnatesFavoritas().stream()
                        .anyMatch(vf -> vf.getUsuarioFavorita() != null && idUsuarioAut.equals(vf.getUsuarioFavorita().getIdUsuario()));

                vacanteDTO.setVacanteGuardada(guardada);

            } else {
                // Consulta individual cuando no hay conjunto precargado.
                vacanteDTO.setVacanteGuardada(
                        vacanteFavoritaRepository.existsByVacanteFavorita_NvacantesAndUsuarioFavorita_IdUsuario(
                                        vacante.getNvacantes(),
                                        idUsuarioAut));
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
