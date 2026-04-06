package com.miproyecto.proyecto.chats.chatBot.service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;

import com.miproyecto.proyecto.enums.IntentType;
import com.miproyecto.proyecto.util.IntentDetector;
import com.miproyecto.proyecto.util.PromptBuilder;



@Service
public class ChatBotService {

    private ChatClient chatClient;
    private final PromptBuilder promptBuilder;
    private final IntentDetector intentDetector;

    public ChatBotService(ChatClient.Builder chatClientBuilder, PromptBuilder promptBuilder,
            IntentDetector intentDetector) {
        this.chatClient = chatClientBuilder.build();
        this.promptBuilder = promptBuilder;
        this.intentDetector = intentDetector;
    }

    public String preguntarAlModelo(String message){

        String template = promptBuilder.buildSystemPrompt();

        String intencion = intentDetector.detector(message);

        if(IntentType.DESCONOCIDO.name().equalsIgnoreCase(intencion)){
            intencion =  generarIntencion(message);
        } 
        
        String contexto = buildContext(intencion, message);
        
        PromptTemplate promptTemplate = new PromptTemplate(template);

        Prompt prompt = promptTemplate.create(Map.of("mensaje", message, "contexto", contexto ));

        ChatOptions chatOptions = ChatOptions.builder().temperature(0.4)
                .maxTokens(300).build();

        return chatClient.prompt(prompt).options(chatOptions).call().content();
    }

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

    public String generarContexto(String intentType, String message){

        String template = promptBuilder.builPromptContext();

        PromptTemplate promptTemplate = new PromptTemplate(template);

        Prompt prompt = promptTemplate.create(Map.of("intencion", intentType, "mensaje", message));
        
        ChatOptions chatOptions = ChatOptions.builder().temperature(0.4)
                .maxTokens(250).build();

        return chatClient.prompt(prompt).options(chatOptions).call().content();
    }

    public String buildContext(String intencion, String message){
        String promptContext = "";

        List<String> intenciones = Arrays.stream(IntentType.values())
                .map(Enum::name)
                .toList();

        if(!intenciones.contains(intencion)){
            return generarContexto(intencion, message);
        }
        
        switch (IntentType.valueOf(intencion.toUpperCase())) {
            case DESCRIPCION_PLATAFORMA:
                promptContext = """
                    SearchJobs permite buscar empleos, postularse y 
                    consultar vacantes disponibles en colombia.
                    """;    
                break;
            case INVALIDA:
                promptContext = """
                    La pregunta no hace parte del contexto laboral o la plataforma searcchjobs, 
                    respondele formalmente que no puedes responder a su pregunta por que sale del 
                    contexto
                        """;
                break;
            default:
                promptContext = "Intencion desconocida, genera una intencion y un contexto";
                break;
        }

        return promptContext;
    }

}
