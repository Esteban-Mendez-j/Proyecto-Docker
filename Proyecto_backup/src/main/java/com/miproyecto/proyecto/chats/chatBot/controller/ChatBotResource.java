package com.miproyecto.proyecto.chats.chatBot.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.chat.dto.MensajeDTO;
import com.miproyecto.proyecto.chats.chatBot.dto.ChatBotDTO;
import com.miproyecto.proyecto.chats.chatBot.dto.CreateChatBotDTO;
import com.miproyecto.proyecto.chats.chatBot.service.interfaces.ChatBotService;
import com.miproyecto.proyecto.enums.FileType;
import com.miproyecto.proyecto.enums.ResponseCode;
import com.miproyecto.proyecto.usuario.service.UsuarioService;
import com.miproyecto.proyecto.util.JwtUtils;
import com.miproyecto.proyecto.util.response.ApiError;
import com.miproyecto.proyecto.util.response.ApiResponseBody;

import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/chatBot")
public class ChatBotResource {

    private final ChatBotService chatBotService;
    private final JwtUtils jwtUtils;
    private final UsuarioService usuarioService;

    @GetMapping("/pregunta")
    public ResponseEntity<ApiResponseBody<MensajeDTO>> getMessage(@RequestParam String message,
        @CookieValue(required = true) String jwtToken) {
        String idUsuario = "";
        String role = "INVITADO";
        if (jwtToken != null) {
            DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
            idUsuario = jwtUtils.extractUsername(decodedJWT);
            role = jwtUtils.getSpecificClaim(decodedJWT, "rolPrincipal").asString();
        }
        
        ApiResponseBody<MensajeDTO> response = new ApiResponseBody<MensajeDTO>(
                chatBotService.preguntarAlModelo(message, role, idUsuario), null, null);

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/info")
    public ResponseEntity<ApiResponseBody<ChatBotDTO>> getChatBotByUsuarioID(
        @RequestParam(required = false) String usuarioId
    ) {

        ApiResponseBody<ChatBotDTO> response = new ApiResponseBody<ChatBotDTO>(
                chatBotService.findChatBotByUsuarioId(usuarioId), null, null);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponseBody<String>> crearChatBot(@RequestBody CreateChatBotDTO createChatBotDTO) {
        
        ApiResponseBody<String> response = new ApiResponseBody<String>(
                chatBotService.create(createChatBotDTO) , null, null);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{chatId}/mensajes")
    public ResponseEntity<ApiResponseBody<List<MensajeDTO>>> listarMensajes(@PathVariable String chatId) {
        List<MensajeDTO> mensajes = chatBotService.obtenerMensajesDeChatBot(chatId);
        ApiResponseBody<List<MensajeDTO>> response = new ApiResponseBody<>(mensajes, null, null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/files")
    public ResponseEntity<ApiResponseBody<List<String>>> obtenerArchivos(
            @RequestParam(name = "chatId", required = true) String chatId
        ) {

        ApiResponseBody<List<String>> response = new ApiResponseBody<>();
        ApiError error = new ApiError();

        try {
            List<String> archivos = chatBotService.obtenerArchivosChat(chatId);
            response.setData(archivos);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            error.setCode(ResponseCode.ERROR);
            error.setMessage(e.getMessage());
            response.setError(error);
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/file")
    public ResponseEntity<Resource> descargarFile(
            @RequestParam(name = "nameFile") String nameFile,
            @CookieValue(name = "jwtToken", required = true) String jwtToken) {

        try {
            Long idUsuario = 0L;

            if (jwtToken != null) {
                DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
                idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
            }

            Resource resource = usuarioService.descargarArchivo(nameFile, idUsuario);

            Path path = resource.getFile().toPath();

            String contentType = Files.probeContentType(path);

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" +
                                    resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping(value = "/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponseBody<String>> agregarFile(
            @RequestPart(name = "file", required = true) MultipartFile file,
            @CookieValue(name = "jwtToken", required = true) String jwtToken) {

        ApiResponseBody<String> response = new ApiResponseBody<>();
        ApiError error = new ApiError();
        Long idUsuario = 0L;

        if(jwtToken != null){
            DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
            idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        }

        try {
            String nameFile = usuarioService.guardarArchivo(file, idUsuario);
            response.setData(nameFile);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            error.setCode(ResponseCode.ERROR);
            error.setMessage("Error al guardar el archivo.");
            response.setError(error);
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            error.setCode(ResponseCode.ERROR);
            error.setMessage(e.getMessage());
            response.setError(error);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/file")
    public ResponseEntity<ApiResponseBody<String>> eliminarFile(
            @RequestParam(name = "nameFile", required = true) String nameFile,
            @CookieValue(name = "jwtToken", required = true) String jwtToken) {

        ApiResponseBody<String> response = new ApiResponseBody<>();
        ApiError error = new ApiError();
        Long idUsuario = 0L;

        if(jwtToken != null){
            DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
            idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        }
    
        try {
            usuarioService.eliminarArchivo(nameFile, FileType.FILE , idUsuario);
            response.setData("Archivo eliminado correctamente");
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            error.setCode(ResponseCode.ERROR);
            error.setMessage("Error al eliminar el archivo.");
            response.setError(error);
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            error.setCode(ResponseCode.ERROR);
            error.setMessage(e.getMessage());
            response.setError(error);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
}
