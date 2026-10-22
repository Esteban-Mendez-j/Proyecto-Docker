package com.miproyecto.proyecto.usuario.service;


import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MultipartFile;

import com.miproyecto.proyecto.chats.chatBot.service.interfaces.ChatBotService;
import com.miproyecto.proyecto.enums.FileType;
import com.miproyecto.proyecto.usuario.dto.FiltroUsuarioDTO;
import com.miproyecto.proyecto.usuario.dto.UsuarioDTO;
import com.miproyecto.proyecto.usuario.model.Usuario;
import com.miproyecto.proyecto.usuario.repository.RolesRepository;
import com.miproyecto.proyecto.usuario.repository.UsuarioRepository;
import com.miproyecto.proyecto.usuario.repository.UsuarioSpecifications;
import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.util.response.ApiResponseBody;
import com.miproyecto.proyecto.util.response.Meta;
import com.miproyecto.proyecto.util.response.Pagination;



@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolesRepository rolesRepository;
    private final ChatBotService chatBotService;
    private final SupabaseStorageService supabaseStorageService;
    
    public UsuarioService(UsuarioRepository usuarioRepository, RolesRepository rolesRepository,
            ChatBotService chatBotService, SupabaseStorageService supabaseStorageService) {
        this.usuarioRepository = usuarioRepository;
        this.rolesRepository = rolesRepository;
        this.chatBotService = chatBotService;
        this.supabaseStorageService = supabaseStorageService;
    }

    public List<UsuarioDTO> findAll() {
        final List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(usuario -> mapToDTO(usuario, new UsuarioDTO()))
                .toList();
    }

    public List<UsuarioDTO> findAllByBannedStatus(Boolean isBanned, Long idUsuario, Pageable pageable) {
        Page<Usuario> usuarios = usuarioRepository.findByIsActive(isBanned, pageable);
        Usuario usuarioAutenticado = usuarioRepository.findById(idUsuario)
                .orElseThrow(NotFoundException::new);
    
        boolean esSuperAdmin = usuarioAutenticado.getRoles().stream()
                .anyMatch(rol -> rol.getRol().equals("SUPER_ADMIN"));
    
        if (esSuperAdmin) {
            return usuarios.stream()
                    .filter(usuario -> !usuario.getIdUsuario().equals(idUsuario))
                    .map(usuario -> mapToDTO(usuario, new UsuarioDTO()))
                    .toList();
        } else {
            return usuarios.stream()
                    .filter(usuario -> !usuario.getIdUsuario().equals(idUsuario))
                    .filter(usuario -> usuario.getRoles().stream().noneMatch(rol ->
                            rol.getRol().equals("ADMIN") || rol.getRol().equals("SUPER_ADMIN")))
                    .map(usuario -> mapToDTO(usuario, new UsuarioDTO()))
                    .toList();
        }
    }
    
    
    public Long findIdByCorreo(String correo){
        Usuario usuario = usuarioRepository.getByCorreo(correo)
            .orElseThrow(NotFoundException::new);
        return usuario.getIdUsuario();
    }

    public UsuarioDTO findByCorreo(String correo){
        return usuarioRepository.getByCorreo(correo)
            .map(usuario -> mapToDTO(usuario, new UsuarioDTO())).orElse(null);
        
    }

    public Optional<Usuario> findByCorreo(String correo, boolean isAutenticacion){
        try {
            return usuarioRepository.getByCorreo(correo);
        } catch (NotFoundException e) {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }
        
    }

    public UsuarioDTO get(final Long idUsuario) {
        return usuarioRepository.findById(idUsuario)
                .map(usuario -> mapToDTO(usuario, new UsuarioDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Optional<UsuarioDTO> getByCorreoAndContrasena(final String correo, final String contrasena) {
        // Busca el usuario por correo
        return usuarioRepository.getByCorreo(correo)
                .filter(usuario -> usuario.getContrasena().equals(contrasena))  // Verifica la contraseña
                .map(usuario -> mapToDTO(usuario, new UsuarioDTO()));           // Mapea a DTO si las credenciales son correctas
    }
    
    public boolean esUsuarioValido(String correo, String contrasena) { /// nuevo buscar usuario alex
        return usuarioRepository.findByCorreoAndContrasena(correo, contrasena).isPresent();
    }

    public UsuarioDTO create(final UsuarioDTO usuarioDTO) {
        final Usuario usuario = new Usuario();
        mapToEntity(usuarioDTO, usuario);
        usuarioRepository.save(usuario);
        return usuarioDTO ;
    }

    public void update(final Long idUsuario, final UsuarioDTO usuarioDTO) {
        final Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(NotFoundException::new);
        mapToEntity(usuarioDTO, usuario);
        usuarioRepository.save(usuario);
    }

    public void delete(final Long idUsuario) {
        usuarioRepository.deleteById(idUsuario);
    }

    public String guardarArchivo(MultipartFile file, Long idUsuario)
            throws IOException {

        String tipo = file.getContentType();

        if (file.isEmpty()) {
            throw new IllegalArgumentException(
                    "El archivo está vacío");
        }

        if (tipo == null) {
            throw new IllegalArgumentException(
                    "No se pudo determinar el tipo de archivo");
        }

        String bucket;
        String ruta;
        boolean esArchivoChat = false;

        // 1. Determinar el bucket y la carpeta.
        if (tipo.startsWith("image/")) {
            bucket = "imagen";
            ruta = "";
        } else if (tipo.equalsIgnoreCase("application/pdf")) {
            bucket = "file";
            ruta = "cv";
        } else if (tipo.startsWith("text/plain") || tipo.startsWith("text/csv")) {
            bucket = "file";
            ruta = "chat";
            esArchivoChat = true;
        } else {
            throw new IllegalArgumentException(
                    "Solo se permiten imágenes, PDF, TXT o CSV");
        }

        // 2. Generar el nombre del archivo.
        String nombreArchivo = supabaseStorageService.generarNombreArchivo(
                file.getOriginalFilename(),
                idUsuario,
                esArchivoChat);

        // 3. Construir la ruta completa en Supabase.
        if (esArchivoChat) {
            String chatId = chatBotService
                    .findChatBotByUsuarioId(idUsuario.toString())
                    .getId();

            ruta = ruta + "/" + chatId + "/" + nombreArchivo;
        } else if (!ruta.isEmpty()) {
            ruta = ruta + "/" + nombreArchivo;
        } else {
            ruta = nombreArchivo;
        }

        // 4. Subir el archivo a Supabase.
        supabaseStorageService.subirArchivo(
                bucket,
                ruta,
                file.getBytes(),
                tipo);

        // 5. Devolver solamente el nombre para almacenarlo en MySQL.
        return nombreArchivo;
    }

    public void eliminarArchivo(
            String fileName,
            FileType type,
            Long idUsuario) throws IOException {

        if (fileName == null || fileName.isBlank() || fileName.contains("/")
            || fileName.contains("\\")
        ) {
            throw new IllegalArgumentException(
                    "Nombre de archivo no válido");
        }

        if (type == null) {
            throw new IllegalArgumentException(
                    "El tipo de archivo es obligatorio");
        }

        String bucket;
        String ruta;

        // 1. Imágenes.
        if (type == FileType.IMAGEN) {
            bucket = "imagen";
            ruta = fileName;
            // 2. Hojas de vida PDF.
        } else if (type == FileType.PDF) {
            bucket = "file";
            ruta = "cv/" + fileName;
            // 3. Documentos adjuntos al chat.
        } else {
            String chatId = chatBotService
                    .findChatBotByUsuarioId(idUsuario.toString())
                    .getId();
            bucket = "file";
            ruta = "chat/" + chatId + "/" + fileName;
        }

        // 4. Eliminar el archivo de Supabase.
        supabaseStorageService.eliminarArchivo(
                bucket,
                ruta);
    }

    public Resource descargarArchivo(
            String fileName,
            Long idUsuario) throws IOException {

        if (fileName == null
                || fileName.isBlank()
                || fileName.contains("/")
                || fileName.contains("\\")) {

            throw new IllegalArgumentException(
                    "Nombre de archivo no válido");
        }

        String chatId = chatBotService
                .findChatBotByUsuarioId(idUsuario.toString())
                .getId();

        Resource recurso;

        // 1. Buscar en el bucket de imágenes.
        recurso = intentarDescarga(
                "imagen",
                fileName);

        if (recurso != null) {
            return recurso;
        }

        // 2. Buscar en la carpeta cv del bucket file.
        recurso = intentarDescarga(
                "file",
                "cv/" + fileName);

        if (recurso != null) {
            return recurso;
        }

        // 3. Buscar en la carpeta del chat correspondiente.
        recurso = intentarDescarga(
                "file",
                "chat/" + chatId + "/" + fileName);

        if (recurso != null) {
            return recurso;
        }

        throw new IOException(
                "Archivo no encontrado en Supabase: " + fileName);
    }

    private Resource intentarDescarga(
            String bucket,
            String ruta) throws IOException {

        try {

            byte[] contenido = supabaseStorageService.descargarArchivoPublico(
                    bucket,
                    ruta);

            if (contenido == null) {
                return null;
            }

            return new ByteArrayResource(contenido);

        } catch (HttpClientErrorException ex) {

            int estado = ex.getStatusCode().value();

            // Si el archivo no existe, continuar con la búsqueda.
            if (estado == 400 || estado == 404) {
                return null;
            }

            throw new IOException(
                    "Error al descargar el archivo desde Supabase",
                    ex);
        }
    }

    private UsuarioDTO mapToDTO(final Usuario usuario, final UsuarioDTO usuarioDTO) {
        usuarioDTO.setIdUsuario(usuario.getIdUsuario());
        usuarioDTO.setNombre(usuario.getNombre());
        usuarioDTO.setContrasena(usuario.getContrasena());
        usuarioDTO.setCorreo(usuario.getCorreo());
        usuarioDTO.setTelefono(usuario.getTelefono());
        usuarioDTO.setDescripcion(usuario.getDescripcion());
        usuarioDTO.setImagen(usuario.getImagen());
        usuarioDTO.setIsActive(usuario.getIsActive());
        usuarioDTO.setComentarioAdmin(usuario.getComentarioAdmin());
        usuarioDTO.setFechaInicioSesion(usuario.getFechaInicioSesion());
        usuarioDTO.setFechaRegistro(usuario.getFechaRegistro());
        usuarioDTO.setRoles(
            usuario.getRoles().stream()
                .map(roles -> roles.getRol())
                .collect(Collectors.toList())
        );

        return usuarioDTO;
    }

    private Usuario mapToEntity(final UsuarioDTO usuarioDTO, final Usuario usuario) {
        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setContrasena(usuarioDTO.getContrasena());
        usuario.setCorreo(usuarioDTO.getCorreo());
        usuario.setTelefono(usuarioDTO.getTelefono());
        usuario.setDescripcion(usuarioDTO.getDescripcion());
        usuario.setImagen(usuarioDTO.getImagen());
        usuario.setIsActive(usuarioDTO.getIsActive());
        usuario.setComentarioAdmin(usuarioDTO.getComentarioAdmin());
        usuario.setFechaInicioSesion(usuarioDTO.getFechaInicioSesion());
        usuario.setFechaRegistro(usuarioDTO.getFechaRegistro());
        usuario.setRoles(
            usuarioDTO.getRoles().stream()
                    .map(roles -> rolesRepository.findByRol(roles))
                    .collect(Collectors.toList())
        );
        return usuario;
    }

    public boolean correoExists(final String correo) {
        return usuarioRepository.existsByCorreoIgnoreCase(correo);
    }

    public boolean telefonoExists(final String telefono) {
        return usuarioRepository.existsByTelefonoIgnoreCase(telefono);
    }

    public ApiResponseBody<List<UsuarioDTO>> mapResponse(Page<UsuarioDTO> pageableResponse){
        Pagination pagination = new Pagination(
            pageableResponse.getTotalElements(), 
            pageableResponse.getPageable(), 
            pageableResponse.getTotalPages()
        );
        Meta meta = new Meta(pagination);
        ApiResponseBody<List<UsuarioDTO>> response = new ApiResponseBody<>(
            pageableResponse.getContent(),
            meta,
            null
        );
        return response;
    }
   
    //FiltrosUsuarios
    public ApiResponseBody<List<UsuarioDTO>> buscarUsuariosConFiltros(Long idUsuario, String rolUsuario, FiltroUsuarioDTO filtro ,Pageable pageable) {
        Specification<Usuario> specification = UsuarioSpecifications.conFiltros(rolUsuario, filtro);
        
        Page<UsuarioDTO> page = usuarioRepository.findAll(specification, pageable)
        .map(usuario -> mapToDTO(usuario, new UsuarioDTO())); 
        
        return mapResponse(page);  
    }
}