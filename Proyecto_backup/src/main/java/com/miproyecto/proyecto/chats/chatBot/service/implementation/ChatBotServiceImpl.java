package com.miproyecto.proyecto.chats.chatBot.service.implementation;

import com.miproyecto.proyecto.util.modeloIA.ContextBuilder;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;

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
import com.miproyecto.proyecto.enums.IntentType;
import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.util.modeloIA.IntentDetector;
import com.miproyecto.proyecto.util.modeloIA.PromptBuilder;


@Service
public class ChatBotServiceImpl implements ChatBotService {

    private final ContextBuilder contextBuilder;
    private ChatClient chatClient;
    private final PromptBuilder promptBuilder;
    private final IntentDetector intentDetector;
    private final ChatBotRepository chatBotRepository;
    private final ChatBotMapper chatBotMapper;
    private final ChatService chatService;
    private final MensajeRepository mensajeRepository;

    public ChatBotServiceImpl(ChatClient.Builder chatClientBuilder, PromptBuilder promptBuilder,
            IntentDetector intentDetector,  ChatBotRepository chatBotRepository, 
            ChatBotMapper chatBotMapper, ChatService chatService, MensajeRepository mensajeRepository, ContextBuilder contextBuilder ) {
        this.chatClient = chatClientBuilder.build();
        this.promptBuilder = promptBuilder;
        this.intentDetector = intentDetector;
        this.chatBotRepository = chatBotRepository;
        this.chatBotMapper = chatBotMapper;
        this.chatService = chatService;
        this.mensajeRepository = mensajeRepository;
        this.contextBuilder = contextBuilder;
    }
        
    @Override
    public String preguntarAlModelo(String message){

        String template = promptBuilder.buildSystemPrompt();

        String intencion = intentDetector.detector(message);

        if(IntentType.DESCONOCIDO.name().equalsIgnoreCase(intencion)){
            intencion =  generarIntencion(message);
        } 
        
        String contexto = buildContext(intencion, message);

        if(IntentType.INVALIDA.name().equalsIgnoreCase(intencion)) return contexto;
        
        PromptTemplate promptTemplate = new PromptTemplate(template);

        Prompt prompt = promptTemplate.create(Map.of("mensaje", message, "contexto", contexto ));

        ChatOptions chatOptions = ChatOptions.builder().temperature(0.4)
                .maxTokens(300).build();

        return chatClient.prompt(prompt).options(chatOptions).call().content();
    }
    
    @Override
    public String generarIntencion(String message){
        String template = promptBuilder.buildPromptIntencion();

        PromptTemplate promptTemplate = new PromptTemplate(template);

        String intenciones = Arrays.stream(IntentType.values())
                .filter(intencion -> intencion != IntentType.DESCONOCIDO)
                .map(Enum::name)
                .collect(Collectors.joining(", "));
                
        Prompt prompt = promptTemplate.create(Map.of("mensaje", message, "intenciones", intenciones));
        
        ChatOptions chatOptions = ChatOptions.builder().temperature(0.3)
                .maxTokens(250).build();

        return chatClient.prompt(prompt).options(chatOptions).call().content();
    }
    
    @Override
    public String generarContexto(String intentType, String message){

        String template = promptBuilder.builPromptContext();

        PromptTemplate promptTemplate = new PromptTemplate(template);

        Prompt prompt = promptTemplate.create(Map.of("intencion", intentType, "mensaje", message));
        
        ChatOptions chatOptions = ChatOptions.builder().temperature(0.4)
                .maxTokens(250).build();

        return chatClient.prompt(prompt).options(chatOptions).call().content();
    }
    
    @Override
    public String buildContext(String intencion, String message){
        String promptContext = "";

        List<String> intenciones = Arrays.stream(IntentType.values())
                .map(Enum::name)
                .toList();

        if(intenciones.contains(intencion)){
            promptContext = contextBuilder.buildContext(IntentType.valueOf(intencion));
        }else{
            promptContext =  generarContexto(intencion, message);
        }
        
        return promptContext;
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



}
