package com.miproyecto.proyecto.chats.chatBot;

import org.springaicommunity.mcp.annotation.McpMeta;

/**
 * Identidad del usuario que hace la consulta al chatbot.
 *
 * IMPORTANTE: estos datos NO los decide el LLM. Los pone tu backend en el
 * ToolContext (ChatBotServiceImpl) y viajan en el campo "_meta" de la
 * petición MCP. Así un prompt injection no puede hacerse pasar por otro usuario.
 */
public record McpUserContext(Long userId, String role, String chatId) {

    public static final String INVITADO = "INVITADO";

    public static McpUserContext from(McpMeta meta) {
        Object rawId = meta != null ? meta.get("userId") : null;
        Object rawRole = meta != null ? meta.get("role") : null;
        Object rawChat = meta != null ? meta.get("chatId") : null;

        Long id = null;
        if (rawId != null) {
            try {
                id = Long.valueOf(String.valueOf(rawId).trim());
            } catch (NumberFormatException ignored) {
                // id inválido => se trata como invitado
            }
        }

        String role = rawRole == null ? INVITADO : String.valueOf(rawRole).trim().toUpperCase();
        if (role.isBlank() || id == null) {
            role = INVITADO; // sin id no hay sesión
        }

        String chat = (rawChat == null || String.valueOf(rawChat).isBlank())
                ? null
                : String.valueOf(rawChat).trim();

        return new McpUserContext(id, role, chat);
    }

    public boolean esAutenticado() {
        return userId != null && !INVITADO.equals(role);
    }

    public boolean esEmpresa() {
        return esAutenticado() && "EMPRESA".equals(role);
    }

    public boolean esCandidato() {
        return esAutenticado() && "CANDIDATO".equals(role);
    }

    public boolean esAdmin() {
        return esAutenticado() && ("ADMIN".equals(role) || "SUPER_ADMIN".equals(role));
    }

    public boolean esSuperAdmin() {
        return esAutenticado() && "SUPER_ADMIN".equals(role);
    }
}
