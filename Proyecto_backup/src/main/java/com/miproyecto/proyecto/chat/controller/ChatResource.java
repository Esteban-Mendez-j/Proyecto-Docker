package com.miproyecto.proyecto.chat.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.chat.dto.ChatDTO;
import com.miproyecto.proyecto.chat.dto.MensajeDTO;
import com.miproyecto.proyecto.chat.service.ChatService;
import com.miproyecto.proyecto.enums.ResponseCode;
import com.miproyecto.proyecto.usuario.dto.UsuarioDTO;
import com.miproyecto.proyecto.usuario.service.UsuarioService;
import com.miproyecto.proyecto.util.JwtUtils;
import com.miproyecto.proyecto.util.response.ApiError;
import com.miproyecto.proyecto.util.response.ApiResponseBody;
import com.miproyecto.proyecto.vacante.dto.VacanteDTO;
import com.miproyecto.proyecto.vacante.service.VacanteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

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
        @ApiResponse(responseCode = "400", description = "Datos inválidos o usuario baneado"),
        @ApiResponse(responseCode = "403", description = "Solo empresas pueden crear chats")
    })
    @PostMapping("/crear")
    public ResponseEntity<ApiResponseBody<ChatDTO>> crearChat(@RequestBody ChatDTO dataChat) {
        // Verificar que la empresa exista y sea un usuario tipo "empresa"
        VacanteDTO vacantesDTO =vacanteService.get(0L,Long.parseLong(dataChat.getVacanteId()));

        UsuarioDTO empresa = usuarioService.get(vacantesDTO.getIdUsuario());
        ApiResponseBody<ChatDTO> response = new ApiResponseBody<>();

        if (!empresa.getRoles().contains("EMPRESA")) {
            throw new IllegalArgumentException("Solo las empresas pueden crear chats");
        }
        UsuarioDTO candidato = usuarioService.get(Long.parseLong(dataChat.getCandidatoId()));

        // Verificar que el candidato exista
        if (candidato == null) {
            throw new IllegalArgumentException("No existe este candidato");
        }

        if(!candidato.getIsActive()){
            ApiError error = new ApiError(ResponseCode.ERROR, "Error al iniciar chat, El usaurio esta baneado");
            response.setError(error);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST.value())
                .body(response);
        }
        
        ChatDTO chatDTO = chatService.crearChat(dataChat.getCandidatoId(),dataChat.getVacanteId(), empresa.getIdUsuario().toString());
        response.setData(chatDTO);
        return ResponseEntity.ok(response);
    }

    //TODO: Terminar
    @Operation(
        summary = "Crear chat grupal por vacante",
        description = "Permite que una empresa cree un chat grupal para todos los candidatos de una vacante."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Chat grupal creado con éxito"),
        @ApiResponse(responseCode = "403", description = "Solo empresas pueden crear chats")
    })
    @PostMapping("/vacantes/crear")
    public ResponseEntity<ApiResponseBody<ChatDTO>> crearChatGrupal(@RequestBody ChatDTO dataChat) {
        System.out.println("chat: hola ");
        // Verificar que la empresa exista y sea un usuario tipo "empresa"
        VacanteDTO vacantesDTO =vacanteService.get(0L,Long.parseLong(dataChat.getVacanteId()));
        System.out.println("dos");
        UsuarioDTO empresa = usuarioService.get(vacantesDTO.getIdUsuario());
        System.out.println("tres");
        if (!empresa.getRoles().contains("EMPRESA")) {
            throw new IllegalArgumentException("Solo las empresas pueden crear chats");
        }
        System.out.println("cuatro");
        ChatDTO chatDTO = chatService.crearChatPorVacante(dataChat.getVacanteId(), empresa.getIdUsuario().toString());
        ApiResponseBody<ChatDTO> response = new ApiResponseBody<>(chatDTO, null,null);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Agregar mensaje a un chat",
        description = "Agrega un mensaje a un chat existente identificado por su ID."
    )
    @ApiResponse(responseCode = "200", description = "Mensaje agregado con éxito")
    @PostMapping("/{chatId}/mensajes")
    public ResponseEntity<ApiResponseBody<MensajeDTO>> agregarMensaje(@PathVariable String chatId,@RequestBody MensajeDTO mensajeDTO) {
        mensajeDTO.setChatId(chatId);
        MensajeDTO mensajeDTOResponse = chatService.agregarMensajeAChat(mensajeDTO);
        ApiResponseBody<MensajeDTO> response = new ApiResponseBody<MensajeDTO>(mensajeDTOResponse, null, null);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Obtener información de un chat",
        description = "Devuelve la información del chat y los datos del usuario autenticado."
    )
    @GetMapping("/{chatId}/info")
    public ResponseEntity<ApiResponseBody<Map<String, Object>>> obtenerInfoChat(
        @PathVariable String chatId, 
        @CookieValue String jwtToken) {
        
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("chatInfo",chatService.findById(chatId));
        responseData.put("userId",jwtUtils.extractUsername(decodedJWT) );
        responseData.put("rolPrincipal", decodedJWT.getClaim("rolPrincipal").asString());
        ApiResponseBody<Map<String, Object>> response = new ApiResponseBody<>(responseData, null, null);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Listar mensajes de un chat",
        description = "Devuelve los mensajes de un chat en formato paginado."
    )
    @GetMapping("/{chatId}/mensajes")
    public ResponseEntity<ApiResponseBody<List<MensajeDTO>>> listarMensajes(@PathVariable String chatId, Pageable pageable) {
        List<MensajeDTO> mensajes = chatService.obtenerMensajesDeChat(chatId, pageable);
        ApiResponseBody<List<MensajeDTO>> response = new ApiResponseBody<>(mensajes, null, null);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Listar todos los chats",
        description = "Devuelve una lista paginada de todos los chats."
    )
    @GetMapping("/listar")
    public ResponseEntity<ApiResponseBody<List<ChatDTO>>> listarChats(
        @PageableDefault(page = 0, size = 10) Pageable pageable) {
        ApiResponseBody<List<ChatDTO>> response = chatService.listarChatsPaginados(pageable);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Listar chats por usuario",
        description = "Filtra los chats según el tipo de usuario (empresa o candidato), estado y búsqueda."
    )
    @PatchMapping("/{tipoUsuario}/{userId}")
    public ResponseEntity<ApiResponseBody<List<ChatDTO>>> listarChatsPorUsuario(
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
        ApiResponseBody<List<ChatDTO>> response = chatService.buscarChatsConFiltros(userId,tipoUsuario,
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
    public ResponseEntity<Void> cambiarEstadoChat(
        @PathVariable String chatId, @RequestParam boolean isActive, 
        @CookieValue(name = "jwtToken") String jwtToken) {
        // Verificar que el chat existe
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

