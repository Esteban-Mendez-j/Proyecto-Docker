package com.miproyecto.proyecto.chats.chatBot.service.implementation;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.miproyecto.proyecto.chat.dto.MensajeDTO;
import com.miproyecto.proyecto.chat.model.Mensaje;
import com.miproyecto.proyecto.chat.repository.MensajeRepository;
import com.miproyecto.proyecto.chat.service.ChatService;
import com.miproyecto.proyecto.chats.chatBot.dto.ChatBotDTO;
import com.miproyecto.proyecto.chats.chatBot.dto.CreateChatBotDTO;
import com.miproyecto.proyecto.chats.chatBot.mapper.ChatBotMapper;
import com.miproyecto.proyecto.chats.chatBot.model.ChatBot;
import com.miproyecto.proyecto.chats.chatBot.repository.ChatBotRepository;
import com.miproyecto.proyecto.chats.chatBot.service.interfaces.ChatBotService;
import com.miproyecto.proyecto.enums.FileType;
import com.miproyecto.proyecto.enums.Roles;
import com.miproyecto.proyecto.usuario.service.UsuarioService;
import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.util.modeloIA.ContextBuilder;
import com.miproyecto.proyecto.util.modeloIA.PromptBuilder;


@Service
public class ChatBotServiceImpl implements ChatBotService {

    private ChatClient chatClient;
    private final ChatBotRepository chatBotRepository;
    private final ChatBotMapper chatBotMapper;
    private final ChatService chatService;
    private final MensajeRepository mensajeRepository;
    private final ContextBuilder contextBuilder;
    private final UsuarioService usuarioService;
    

    public ChatBotServiceImpl(ChatClient.Builder chatClientBuilder, PromptBuilder promptBuilder,
            ChatBotRepository chatBotRepository, ContextBuilder contextBuilder,
            ChatBotMapper chatBotMapper, ChatService chatService, 
            MensajeRepository mensajeRepository, UsuarioService usuarioService,
            ToolCallbackProvider toolCallbackProvider ) {

        this.chatClient = chatClientBuilder
                .defaultSystem(promptBuilder.buildSystemPrompt())
                .defaultToolCallbacks(toolCallbackProvider)
                .build();
        this.chatBotRepository = chatBotRepository;
        this.chatBotMapper = chatBotMapper;
        this.chatService = chatService;
        this.mensajeRepository = mensajeRepository;
        this.contextBuilder = contextBuilder;
        this.usuarioService = usuarioService;
    }
        
    @Override
    public String preguntarAlModelo(String message, String role){

        String user = contextBuilder.buildUserContext(Roles.valueOf(role), message);

        return chatClient.prompt().user(user).call().content();
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
                chatService.mensajeMapToEntity(mensajeDTO, new Mensaje()));
        return chatService.mensajeMapToDTO(mensaje, new MensajeDTO());
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
                .map(mensaje -> chatService.mensajeMapToDTO(mensaje, new MensajeDTO()))
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

    @Override
    public String guardarArchivosChatBot(MultipartFile file,  Long idUsuario, String chatId) throws IOException{
        if (file == null ) return "No se seleccionó ningun archivo";

        String rutaFile = usuarioService.guardarArchivo(file, idUsuario);
        
        ChatBot chatBot =  chatBotRepository.findById(chatId).orElseThrow(NotFoundException::new);

        chatBot.addRuta(rutaFile);

        chatBotRepository.save(chatBot);

        return rutaFile;
    }
    
    @Override
    public void eliminarArchivosChatBot(String chatId, String nameFile) throws IOException{
        if (nameFile == null ) return;

        usuarioService.eliminarArchivo(nameFile, FileType.FILE);
        
        ChatBot chatBot =  chatBotRepository.findById(chatId).orElseThrow(NotFoundException::new);

        chatBot.deleteRuta(nameFile);

        chatBotRepository.save(chatBot);
    }
}
