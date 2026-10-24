package com.miproyecto.proyecto.chats.chatBot.tools;

import org.springaicommunity.mcp.annotation.McpTool;
import org.springaicommunity.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

import com.miproyecto.proyecto.chats.chatBot.dto.ToolResult;
import com.miproyecto.proyecto.chats.chatBot.service.interfaces.DocumentoService;


/**
 * Expone tu RAG (MongoDB Atlas Vector Store) como herramienta: ayuda sobre la plataforma,
 * preguntas frecuentes, como postularse, como publicar, etc. El LLM la llama solo cuando la necesita.
 */
@Component
public class ConocimientoMcpTools {

    private final DocumentoService documentoService;

    public ConocimientoMcpTools(DocumentoService documentoService) {
        this.documentoService = documentoService;
    }

    @McpTool(name = "consultar_informacion_plataforma", description = """
            Busca en la base de conocimiento de SearchJobs (preguntas frecuentes, guia de uso, funciones de la
            plataforma para candidatos y empresas). Usala para dudas sobre como usar la plataforma.
            Disponible para cualquier usuario.""")
    public ToolResult consultarInformacion(
            @McpToolParam(description = "Pregunta o tema a consultar, en lenguaje natural", required = true) String consulta) {
        return ToolResult.run("consultar_informacion_plataforma", () -> {
            if (consulta == null || consulta.isBlank()) {
                throw new IllegalArgumentException("Indica que quieres consultar.");
            }
            return documentoService.findSimilarDocuments(consulta);
        });
    }
}
