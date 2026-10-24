package com.miproyecto.proyecto.chats.chatBot.tools;

import java.util.Map;

import org.springaicommunity.mcp.annotation.McpMeta;
import org.springaicommunity.mcp.annotation.McpTool;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.miproyecto.proyecto.chats.chatBot.McpUserContext;


/**
 * SOLO PARA PRUEBAS: confirma que el usuario/rol/chat del backend llegan al servidor MCP.
 * Se activa con app.mcp.debug-tools=true. Apagalo en produccion.
 */
@Component
@ConditionalOnProperty(name = "app.mcp.debug-tools", havingValue = "true")
public class McpDiagnosticTools {

    @McpTool(name = "diagnostico_contexto", description = "Devuelve el contexto de usuario recibido por el servidor MCP (solo depuracion).")
    public Map<String, Object> diagnostico(McpMeta meta) {
        McpUserContext ctx = McpUserContext.from(meta);
        return Map.of(
                "userId", String.valueOf(ctx.userId()),
                "role", ctx.role(),
                "chatId", String.valueOf(ctx.chatId()));
    }
}
