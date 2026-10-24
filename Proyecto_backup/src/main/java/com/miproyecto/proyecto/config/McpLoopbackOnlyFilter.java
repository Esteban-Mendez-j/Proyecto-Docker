package com.miproyecto.proyecto.config;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * El endpoint /mcp NO trae autenticacion propia (cualquiera que lo alcance podria invocar todas las
 * herramientas y falsificar el _meta). Este filtro solo deja pasar peticiones locales
 * (loopback) que no vengan reenviadas por un proxy; es decir, solo tu propio ChatBotService.
 *
 * Si algun dia necesitas exponer /mcp a clientes externos, desactiva esto
 * (app.mcp.loopback-only=false) y protege el endpoint con Spring Security / MCP Security.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class McpLoopbackOnlyFilter extends OncePerRequestFilter {

    private final String endpoint;
    private final boolean activo;

    public McpLoopbackOnlyFilter(@Value("${app.mcp.endpoint:/mcp}") String endpoint,
            @Value("${app.mcp.loopback-only:true}") boolean activo) {
        this.endpoint = endpoint;
        this.activo = activo;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if (!activo) {
            return true;
        }
        String path = request.getRequestURI().substring(request.getContextPath().length());
        return !(path.equals(endpoint) || path.startsWith(endpoint + "/"));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        if (esLocal(request) && !vieneDeProxy(request)) {
            chain.doFilter(request, response);
            return;
        }
        response.sendError(HttpServletResponse.SC_FORBIDDEN, "MCP endpoint solo disponible internamente");
    }

    private boolean esLocal(HttpServletRequest request) {
        try {
            return InetAddress.getByName(request.getRemoteAddr()).isLoopbackAddress();
        } catch (UnknownHostException e) {
            return false;
        }
    }

    private boolean vieneDeProxy(HttpServletRequest request) {
        return request.getHeader("X-Forwarded-For") != null
                || request.getHeader("Forwarded") != null
                || request.getHeader("X-Real-IP") != null;
    }
}

