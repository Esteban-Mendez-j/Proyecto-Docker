package com.miproyecto.proyecto.chats.chatBot.dto;

import java.util.function.Supplier;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;

import com.miproyecto.proyecto.util.exception.AccesoDenegadoException;

public record ToolResult(boolean ok, String mensaje, Object datos) {

    private static final Logger log = LoggerFactory.getLogger(ToolResult.class);

    public static ToolResult ok(String mensaje, Object datos) {
        return new ToolResult(true, mensaje, datos);
    }

    public static ToolResult error(String mensaje) {
        return new ToolResult(false, mensaje, null);
    }

    /** Ejecuta una accion y traduce las excepciones a mensajes que el LLM entiende. */
    public static ToolResult run(String operacion, Supplier<Object> accion) {
        try {
            return ok("OK", accion.get());
        } catch (AccesoDenegadoException e) {
            return error("No autorizado: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return error(e.getMessage());
        } catch (DataIntegrityViolationException e) {
            log.warn("MCP [{}] violacion de integridad: {}", operacion, e.getMostSpecificCause().getMessage());
            return error("No se pudo completar la operacion porque viola una restriccion de datos "
                    + "(por ejemplo, la vacante tiene postulaciones asociadas o falta un campo obligatorio). "
                    + "Si querias quitarla de la vista publica, desactivala en lugar de eliminarla.");
        } catch (Exception e) {
            if ("NotFoundException".equals(e.getClass().getSimpleName())) {
                return error("No se encontro un recurso referenciado (por ejemplo, el cargo indicado no existe "
                        + "en el catalogo, o la vacante no existe).");
            }
            log.error("MCP [{}] error inesperado", operacion, e);
            return error("Ocurrio un error interno al procesar la solicitud.");
        }
    }
}