package com.miproyecto.proyecto.chats.chatBot.tools;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springaicommunity.mcp.annotation.McpMeta;
import org.springaicommunity.mcp.annotation.McpTool;
import org.springaicommunity.mcp.annotation.McpToolParam;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.miproyecto.proyecto.chats.chatBot.McpUserContext;
import com.miproyecto.proyecto.chats.chatBot.dto.ToolResult;
import com.miproyecto.proyecto.usuario.service.SupabaseStorageService;
import com.miproyecto.proyecto.util.exception.AccesoDenegadoException;


/**
 * Reemplaza al MCP "File System" de Docker. Guarda/lee archivos de texto en tu bucket de Supabase,
 * SIEMPRE dentro de chat/{chatId}/. El chatId lo fija tu backend (meta), no el LLM,
 * y el nombre se sanea, asi no hay path traversal ni acceso a archivos de otros chats.
 */
@Component
public class ArchivoMcpTools {

    private static final Map<String, String> TIPOS = Map.of(
            "txt", "text/plain; charset=utf-8",
            "csv", "text/csv; charset=utf-8");

    private static final int MAX_CARACTERES_LECTURA = 20_000;

    private final SupabaseStorageService storage;
    private final String bucket;
    private final int maxBytes;

    public ArchivoMcpTools(SupabaseStorageService storage,
            @Value("${app.mcp.files.bucket:file}") String bucket,
            @Value("${app.mcp.files.max-bytes:1048576}") int maxBytes) {
        this.storage = storage;
        this.bucket = bucket;
        this.maxBytes = maxBytes;
    }

    @McpTool(name = "crear_archivo", description = """
            Crea un archivo de TEXTO (.txt o csv) en el espacio de archivos del chat del usuario autenticado.
            Usala solo cuando el usuario pida exportar o guardar informacion y ya tengas los datos REALES
            (nunca marcadores como [resultado]). Devuelve el nombre final y dile que puede encontrar el archivo en la seccion 
            de archivos del chat""")
    public ToolResult crearArchivo(
            @McpToolParam(description = "Nombre con extension, ej. 'vacantes_cartagena.csv'", required = true) String nombreArchivo,
            @McpToolParam(description = "Contenido completo del archivo en texto plano", required = true) String contenido,
            McpMeta meta) {
        McpUserContext ctx = McpUserContext.from(meta);
        return ToolResult.run("crear_archivo", () -> {
            exigirChat(ctx);
            String nombreSeguro = storage.obtenerNombreSeguro(nombreArchivo);
            String tipo = TIPOS.get(extension(nombreSeguro));
            if (tipo == null) {
                throw new IllegalArgumentException("Extension no permitida. Usa .txt o .csv");
            }
            if (contenido == null || contenido.isBlank()) {
                throw new IllegalArgumentException("El contenido esta vacio; no se crea el archivo.");
            }
            byte[] bytes = contenido.getBytes(StandardCharsets.UTF_8);
            if (bytes.length > maxBytes) {
                throw new IllegalArgumentException("El archivo supera el limite de " + (maxBytes / 1024) + " KB.");
            }
            String nombreFinal = storage.generarNombreArchivo(nombreSeguro, ctx.userId(), true);
            String ruta = carpeta(ctx) + nombreFinal;
            storage.subirArchivo(bucket, ruta, bytes, tipo);
            return Map.of(
                    "nombreArchivo", nombreFinal,
                    "bytes", bytes.length);
        });
    }

    @McpTool(name = "listar_archivos", description = "Lista los nombres de los archivos del chat del usuario autenticado.")
    public ToolResult listarArchivos(McpMeta meta) {
        McpUserContext ctx = McpUserContext.from(meta);
        return ToolResult.run("listar_archivos", () -> {
            exigirChat(ctx);
            List<String> nombres = storage.obtenerArchivosChat(ctx.chatId());
            return nombres;
        });
    }

    @McpTool(name = "leer_archivo", description = """
            Lee el contenido de un archivo de texto del chat del usuario autenticado (maximo 20.000 caracteres).""")
    public ToolResult leerArchivo(
            @McpToolParam(description = "Nombre exacto del archivo, tal como lo devuelve listar_archivos", required = true) String nombreArchivo,
            McpMeta meta) {
        McpUserContext ctx = McpUserContext.from(meta);
        return ToolResult.run("leer_archivo", () -> {
            exigirChat(ctx);
            String nombreSeguro = storage.obtenerNombreSeguro(nombreArchivo);
            if (!TIPOS.containsKey(extension(nombreSeguro))) {
                throw new IllegalArgumentException("Solo se pueden leer archivos .txt o .csv");
            }
            byte[] bytes;
            try {
                bytes = storage.descargarArchivoPublico(bucket, carpeta(ctx) + nombreSeguro);
            } catch (Exception e) {
                throw new IllegalArgumentException("No se encontro el archivo '" + nombreSeguro + "' en este chat.");
            }
            if (bytes == null) {
                throw new IllegalArgumentException("El archivo esta vacio o no existe.");
            }
            String texto = new String(bytes, StandardCharsets.UTF_8);
            boolean truncado = texto.length() > MAX_CARACTERES_LECTURA;
            return Map.of(
                    "contenido", truncado ? texto.substring(0, MAX_CARACTERES_LECTURA) : texto,
                    "truncado", truncado);
        });
    }

    @McpTool(name = "eliminar_archivo", description = "Elimina un archivo del chat del usuario autenticado")
    public ToolResult eliminarArchivo(
            @McpToolParam(description = "Nombre exacto del archivo", required = true) String nombreArchivo,
            McpMeta meta) {
        McpUserContext ctx = McpUserContext.from(meta);
        return ToolResult.run("eliminar_archivo", () -> {
            exigirChat(ctx);
            String nombreSeguro = storage.obtenerNombreSeguro(nombreArchivo);
            storage.eliminarArchivo(bucket, carpeta(ctx) + nombreSeguro);
            return "Archivo eliminado: " + nombreSeguro;
        });
    }

    // ---------- helpers ----------

    private void exigirChat(McpUserContext ctx) {
        if (!ctx.esAutenticado()) {
            throw new AccesoDenegadoException("los invitados no pueden usar archivos; invitalos a crear una cuenta.");
        }
        if (ctx.chatId() == null) {
            throw new IllegalArgumentException("No hay un chat activo para guardar archivos.");
        }
    }

    private String carpeta(McpUserContext ctx) {
        return "chat/" + ctx.chatId() + "/";
    }

    private String extension(String nombre) {
        int punto = nombre.lastIndexOf('.');
        return punto < 0 ? "" : nombre.substring(punto + 1).toLowerCase(Locale.ROOT);
    }
}
