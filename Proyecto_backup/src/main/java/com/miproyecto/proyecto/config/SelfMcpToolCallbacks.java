package com.miproyecto.proyecto.config;

import java.time.Duration;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.mcp.SyncMcpToolCallbackProvider;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import io.modelcontextprotocol.client.McpClient;
import io.modelcontextprotocol.client.McpSyncClient;
import io.modelcontextprotocol.client.transport.HttpClientStreamableHttpTransport;
import jakarta.annotation.PreDestroy;


@Component
public class SelfMcpToolCallbacks {

    private static final Logger log = LoggerFactory.getLogger(SelfMcpToolCallbacks.class);

    private final Environment env;
    private final String urlBaseConfigurada;
    private final String endpointMcp;
    private final Duration timeout;

    private volatile List<ToolCallback> cache;
    private McpSyncClient client;

    public SelfMcpToolCallbacks(Environment env,
            @Value("${app.mcp.self-url:}") String urlBaseConfigurada,
            @Value("${app.mcp.endpoint:/mcp}") String endpointMcp,
            @Value("${app.mcp.client-timeout-seconds:30}") long timeoutSegundos) {
        this.env = env;
        this.urlBaseConfigurada = urlBaseConfigurada;
        this.endpointMcp = endpointMcp;
        this.timeout = Duration.ofSeconds(timeoutSegundos);
    }

    /** Herramientas MCP descubiertas en el servidor propio. Lista vacia si aun no se puede conectar. */
    public List<ToolCallback> getToolCallbacks() {
        List<ToolCallback> actual = cache;
        if (actual != null) {
            return actual;
        }
        return conectar();
    }

    private synchronized List<ToolCallback> conectar() {
        if (cache != null) {
            return cache;
        }
        McpSyncClient nuevo = null;
        try {
            String base = urlBase();
            String endpoint = contextPath() + endpointMcp;
            nuevo = McpClient
                    .sync(HttpClientStreamableHttpTransport.builder(base).endpoint(endpoint).build())
                    .requestTimeout(timeout)
                    .build();
            nuevo.initialize();

            SyncMcpToolCallbackProvider provider = SyncMcpToolCallbackProvider.builder().mcpClients(nuevo).build();
            List<ToolCallback> herramientas = List.of(provider.getToolCallbacks());

            this.client = nuevo;
            this.cache = herramientas;
            log.info("MCP autoconsumo conectado a {}{} ({} herramientas)", base, endpoint, herramientas.size());
            return herramientas;
        } catch (RuntimeException e) {
            log.error("No se pudo conectar al servidor MCP propio: {}", e.getMessage());
            if (nuevo != null) {
                try {
                    nuevo.close();
                } catch (RuntimeException ignored) {
                    // nada que hacer
                }
            }
            return List.of(); // el chat sigue funcionando sin herramientas; se reintenta en la proxima pregunta
        }
    }

    private String urlBase() {
        if (urlBaseConfigurada != null && !urlBaseConfigurada.isBlank()) {
            return urlBaseConfigurada.replaceAll("/+$", "");
        }
        String puerto = env.getProperty("local.server.port", env.getProperty("server.port", "8080"));
        return "http://127.0.0.1:" + puerto;
    }

    private String contextPath() {
        String cp = env.getProperty("server.servlet.context-path", "");
        return "/".equals(cp) ? "" : cp;
    }

    @PreDestroy
    void cerrar() {
        if (client != null) {
            try {
                client.close();
            } catch (RuntimeException ignored) {
                // cierre best-effort
            }
        }
    }
}
