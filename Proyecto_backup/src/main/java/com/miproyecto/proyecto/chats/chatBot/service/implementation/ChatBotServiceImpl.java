package com.miproyecto.proyecto.chats.chatBot.service.implementation;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.miproyecto.proyecto.chat.dto.MensajeDTO;
import com.miproyecto.proyecto.chat.model.Mensaje;
import com.miproyecto.proyecto.chat.repository.MensajeRepository;
import com.miproyecto.proyecto.chats.chatBot.dto.ChatBotDTO;
import com.miproyecto.proyecto.chats.chatBot.dto.CreateChatBotDTO;
import com.miproyecto.proyecto.chats.chatBot.mapper.ChatBotMapper;
import com.miproyecto.proyecto.chats.chatBot.model.ChatBot;
import com.miproyecto.proyecto.chats.chatBot.repository.ChatBotRepository;
import com.miproyecto.proyecto.chats.chatBot.service.interfaces.ChatBotService;
import com.miproyecto.proyecto.enums.Roles;
import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.util.modeloIA.ContextBuilder;
import com.miproyecto.proyecto.util.modeloIA.PromptBuilder;


@Service
public class ChatBotServiceImpl implements ChatBotService {

    private final PromptBuilder promptBuilder;
    private ChatClient chatClient;
    private final ChatBotRepository chatBotRepository;
    private final ChatBotMapper chatBotMapper;
    private final MensajeRepository mensajeRepository;
    private final ContextBuilder contextBuilder;
    
    @Value("${app.upload-dir.file}")
    private String fileUploadDir;

    public ChatBotServiceImpl(ChatClient.Builder chatClientBuilder, PromptBuilder promptBuilder,
            ChatBotRepository chatBotRepository, ContextBuilder contextBuilder,
            ChatBotMapper chatBotMapper,
            MensajeRepository mensajeRepository,
            ToolCallbackProvider toolCallbackProvider ) {

        this.chatClient = chatClientBuilder
                .defaultSystem(promptBuilder.buildSystemPrompt())
                .defaultToolCallbacks(toolCallbackProvider)
                .build();
        this.chatBotRepository = chatBotRepository;
        this.chatBotMapper = chatBotMapper;
        this.mensajeRepository = mensajeRepository;
        this.contextBuilder = contextBuilder;
        this.promptBuilder = promptBuilder;
    }
        
    @Override
    public MensajeDTO preguntarAlModelo(String message, String role, String idUsuario){

        String chatId = findChatBotByUsuarioId(idUsuario).getId();
        String ruta = fileUploadDir+"/chat_"+chatId;

        String user = contextBuilder.buildUserContext(Roles.valueOf(role), message);
        String response = "";
        try {
            response = chatClient.prompt()
                    .user(promptBuilder.buildFieldPrompt(ruta, Long.parseLong(idUsuario)) + "\n\n" + user)
                    .call().content();
        } catch (NonTransientAiException ex) {
            response = "Excediste el limite de peticiones, intentalo mas tarde";
        } catch (Exception e) {
            response = "No pude responder tu solicitud, intenta nuevamente o realiza otra consulta";
        }

        return stringToMensajeDTO(response, idUsuario, chatId);
    }
    
    @Override
    public String create(CreateChatBotDTO createChatBotDTO) {
        ChatBot chatBot = chatBotMapper.CreateChatBotToChatbot(createChatBotDTO);
        chatBot.setFechaCreacion(LocalDateTime.now());
        chatBot.setIsActive(true);
        return chatBotRepository.save(chatBot).getId();
    }

    @Override
    public MensajeDTO agregarMensajeChat(MensajeDTO mensajeDTO){

        if (mensajeDTO.getContent() == null || mensajeDTO.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("El contenido no puede estar vacío");
        }

        String chatId = "";

        ChatBot chatBot = chatBotRepository.findById(mensajeDTO.getChatId())
                .orElse(null); 

        if(chatBot == null){
            CreateChatBotDTO createChatBotDTO = new CreateChatBotDTO(mensajeDTO.getSenderId(), mensajeDTO.getSenderRole());
            chatId = create(createChatBotDTO);
            mensajeDTO.setChatId(chatId);
        }
        
        mensajeDTO.setTime(LocalDateTime.now());
        mensajeDTO.setReceiverRole("MODELO IA");
        mensajeDTO.setState("Recibido");
        Mensaje mensaje = mensajeRepository.save(
                mensajeMapToEntity(mensajeDTO, new Mensaje()));
        return mensajeMapToDTO(mensaje, new MensajeDTO());
    }

    @Override
    public ChatBotDTO findChatBotById(String chatId) {
        return chatBotMapper.ChatBotToChatbotDTO(chatBotRepository.findById(chatId)
                .orElseThrow(NotFoundException::new));
    }

    @Override
    public ChatBotDTO findChatBotByUsuarioId(String usuarioId) {
        return chatBotMapper.ChatBotToChatbotDTO(chatBotRepository.findByUsuarioId(usuarioId)
                .orElseThrow(NotFoundException::new));
    }

    @Override
    public ChatBotDTO findChatBotByChatIdOrUserId(String id, String usuarioId) {
        return chatBotMapper.ChatBotToChatbotDTO(chatBotRepository.findByUsuarioIdOrId(usuarioId, id)
                .orElseThrow(NotFoundException::new));
    }

    @Override
    public List<MensajeDTO> obtenerMensajesDeChatBot(String chatId) {
        List<Mensaje> mensajes = mensajeRepository.findByChatIdOrderByTimeAsc(chatId);
        return mensajes.stream()
                .map(mensaje -> mensajeMapToDTO(mensaje, new MensajeDTO()))
                .collect(Collectors.toList());
    }

    @Override
    public MensajeDTO stringToMensajeDTO(String message, String receiverId, String chatId) {
        return new MensajeDTO(
            chatId,
            "MODELO IA",
            receiverId,
            "MODELO IA", 
            "USUARIO",
            message,
            LocalDateTime.now(),
            "Recibido"
        );
    }

    public List<String> obtenerArchivosChat(String chatId) throws IOException {

        Path rutaCarpeta = Path.of(
                fileUploadDir,
                "chat_" + chatId).toAbsolutePath();

        // Si no existe la carpeta
        if (!Files.exists(rutaCarpeta)) {
            return new ArrayList<>();
        }

        try (Stream<Path> paths = Files.list(rutaCarpeta)) {

            return paths
                    .filter(Files::isRegularFile)
                    .map(path -> path.getFileName().toString())
                    .toList();
        }
    }

    public Mensaje  mensajeMapToEntity(MensajeDTO mensajeDTO, Mensaje mensaje) { 
        mensaje.setChatId(mensajeDTO.getChatId());
        mensaje.setSenderId(mensajeDTO.getSenderId());
        mensaje.setReceiverId(mensajeDTO.getReceiverId());
        mensaje.setSenderRole(mensajeDTO.getSenderRole());
        mensaje.setReceiverRole(mensajeDTO.getReceiverRole());
        mensaje.setContent(mensajeDTO.getContent());
        mensaje.setTime(mensajeDTO.getTime());
        return mensaje;
    }

    public MensajeDTO mensajeMapToDTO(Mensaje mensaje, MensajeDTO mensajeDTO) {
        mensajeDTO.setChatId(mensaje.getChatId());
        mensajeDTO.setSenderId(mensaje.getSenderId());
        mensajeDTO.setReceiverId(mensaje.getReceiverId());
        mensajeDTO.setSenderRole(mensaje.getSenderRole());
        mensajeDTO.setReceiverRole(mensaje.getReceiverRole());
        mensajeDTO.setContent(mensaje.getContent());
        mensajeDTO.setTime(mensaje.getTime());
        mensajeDTO.setState(mensaje.getState());
        return mensajeDTO;
    }
}
