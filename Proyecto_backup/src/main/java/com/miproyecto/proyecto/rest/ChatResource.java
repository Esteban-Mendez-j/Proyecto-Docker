package com.miproyecto.proyecto.rest;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.model.ChatDTO;
import com.miproyecto.proyecto.model.MensajeDTO;
import com.miproyecto.proyecto.model.UsuarioDTO;
import com.miproyecto.proyecto.model.VacanteDTO;
import com.miproyecto.proyecto.service.ChatService;
import com.miproyecto.proyecto.service.UsuarioService;
import com.miproyecto.proyecto.service.VacanteService;
import com.miproyecto.proyecto.util.JwtUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "Chat", description = "Operaciones relacionadas con la gestión del chat")
@RestController
@RequestMapping(value = "/api/chats", produces = MediaType.APPLICATION_JSON_VALUE)
public class ChatResource {

    @Autowired
    private ChatService chatService;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private VacanteService vacanteService;
  
   @Operation(
        summary = "Crear un nuevo chat privado",
        description = "Permite que una empresa cree un chat privado con un candidato para una vacante específica."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Chat creado con éxito"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o usuario inactivo"),
        @ApiResponse(responseCode = "403", description = "Solo empresas pueden crear chats")
    })
    @PostMapping("/crear")
    public ResponseEntity<ChatDTO> crearChat(@RequestBody ChatDTO response) {
        // Verificar que la empresa exista y sea un usuario tipo "empresa"
        VacanteDTO vacantesDTO =vacanteService.get(0L,Long.parseLong(response.getVacanteId()));

        UsuarioDTO empresa = usuarioService.get(vacantesDTO.getIdUsuario());
        
        if (!empresa.getRoles().contains("EMPRESA")) {
            throw new IllegalArgumentException("Solo las empresas pueden crear chats");
        }
        UsuarioDTO candidato = usuarioService.get(Long.parseLong(response.getCandidatoId()));

        // Verificar que el candidato exista
        if (candidato == null) {
            throw new IllegalArgumentException("No existe este candidato");
        }

        if(!candidato.getIsActive()){
            ResponseEntity.status(HttpStatus.BAD_REQUEST.value())
                .body("Error al iniciar chat, El usaurio esta baneado");
        }
        
        ChatDTO chatDTO = chatService.crearChat(response.getCandidatoId(),response.getVacanteId(), empresa.getIdUsuario().toString());
        return ResponseEntity.ok(chatDTO);
    }

    @Operation(
        summary = "Crear chat grupal por vacante",
        description = "Permite que una empresa cree un chat grupal para todos los candidatos de una vacante."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Chat grupal creado con éxito"),
        @ApiResponse(responseCode = "403", description = "Solo empresas pueden crear chats")
    })
    @PostMapping("/vacantes/crear")
    public ResponseEntity<ChatDTO> crearChatGrupal(@RequestBody ChatDTO response) {
        System.out.println("chat: hola ");
        // Verificar que la empresa exista y sea un usuario tipo "empresa"
        VacanteDTO vacantesDTO =vacanteService.get(0L,Long.parseLong(response.getVacanteId()));
        System.out.println("dos");
        UsuarioDTO empresa = usuarioService.get(vacantesDTO.getIdUsuario());
        System.out.println("tres");
        if (!empresa.getRoles().contains("EMPRESA")) {
            throw new IllegalArgumentException("Solo las empresas pueden crear chats");
        }
        System.out.println("cuatro");
        ChatDTO chatDTO = chatService.crearChatPorVacante(response.getVacanteId(), empresa.getIdUsuario().toString());
        return ResponseEntity.ok(chatDTO);
    }

    @Operation(
        summary = "Agregar mensaje a un chat",
        description = "Agrega un mensaje a un chat existente identificado por su ID."
    )
    @ApiResponse(responseCode = "200", description = "Mensaje agregado con éxito")
    @PostMapping("/{chatId}/mensajes")
    public ResponseEntity<MensajeDTO> agregarMensaje(@PathVariable String chatId,@RequestBody MensajeDTO mensajeDTO) {
        mensajeDTO.setChatId(chatId);
        MensajeDTO mensajeDTOResponse = chatService.agregarMensajeAChat(mensajeDTO);
        return ResponseEntity.ok(mensajeDTOResponse);
    }

    @Operation(
        summary = "Obtener información de un chat",
        description = "Devuelve la información del chat y los datos del usuario autenticado."
    )
    @GetMapping("/{chatId}/info")
    public ResponseEntity<Map<String, Object>> obtenerInfoChat(
        @PathVariable String chatId, 
        @CookieValue String jwtToken) {
        
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("chatInfo",chatService.findById(chatId));
        responseData.put("userId",jwtUtils.extractUsername(decodedJWT) );
        responseData.put("rolPrincipal", decodedJWT.getClaim("rolPrincipal").asString());
        return ResponseEntity.ok(responseData);
    }

    @Operation(
        summary = "Listar mensajes de un chat",
        description = "Devuelve los mensajes de un chat en formato paginado."
    )
    @GetMapping("/{chatId}/mensajes")
    public ResponseEntity<List<MensajeDTO>> listarMensajes(@PathVariable String chatId, Pageable pageable) {
        List<MensajeDTO> mensajes = chatService.obtenerMensajesDeChat(chatId, pageable);
        return ResponseEntity.ok(mensajes);
    }

    @Operation(
        summary = "Listar todos los chats",
        description = "Devuelve una lista paginada de todos los chats."
    )
    @GetMapping("/listar")
    public ResponseEntity<Map<String, Object>> listarChats(
        @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Map<String, Object> response = chatService.listarChatsPaginados(pageable);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Listar chats por usuario",
        description = "Filtra los chats según el tipo de usuario (empresa o candidato), estado y búsqueda."
    )
    @PatchMapping("/{tipoUsuario}/{userId}")
    public ResponseEntity<Map<String, Object>> listarChatsPorUsuario(
        @PathVariable String tipoUsuario,        // "empresa" o "candidato"
        @PathVariable String userId,
        @RequestParam(required = false) String estado,
        @RequestParam(required = false) String search,
        @PageableDefault(page = 0, size = 10) Pageable pageable) {

        Boolean activoFiltro = null;
        if ("activos".equalsIgnoreCase(estado)) {
            activoFiltro = true;
        } else if ("inactivos".equalsIgnoreCase(estado)) {
            activoFiltro = false;
        }
        Map<String, Object> response = chatService.buscarChatsConFiltros(userId,tipoUsuario,
        activoFiltro,search,pageable);

        return ResponseEntity.ok(response);
    }


    @Operation(
        summary = "Cambiar estado de un chat",
        description = "Permite a la empresa creadora del chat cerrarlo o reabrirlo."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Estado del chat cambiado correctamente"),
        @ApiResponse(responseCode = "403", description = "Solo la empresa que creó el chat puede cambiar su estado")
    })
    @PatchMapping("/{chatId}/estado")
    public ResponseEntity<Void> cambiarEstadoChat(@PathVariable String chatId, @RequestParam boolean isActive, HttpSession session) {
        // Verificar que el chat existe
        String jwtToken = (String) session.getAttribute("jwtToken");
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        String idUsuario = jwtUtils.extractUsername(decodedJWT);

        ChatDTO chat = chatService.findById(chatId);

        // Verificar que quien está cambiando el estado es la empresa que creó el chat
        if (!chat.getEmpresaId().equals(idUsuario)) {
            throw new IllegalArgumentException("Solo la empresa que creó el chat puede cambiar su estado");
        }

        chatService.cambiarEstadoChat(chatId, isActive, "El chat fue cerrado por la empresa");
        return ResponseEntity.noContent().build();
    }

}

