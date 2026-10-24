package com.miproyecto.proyecto.chats.chatBot.tools;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springaicommunity.mcp.annotation.McpMeta;
import org.springaicommunity.mcp.annotation.McpTool;
import org.springaicommunity.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

import com.miproyecto.proyecto.chats.chatBot.McpUserContext;
import com.miproyecto.proyecto.chats.chatBot.dto.ToolResult;
import com.miproyecto.proyecto.chats.chatBot.service.implementation.VacanteMcpService;


/**
 * Herramientas MCP de vacantes (reemplaza el uso de SQL libre con DBHub).
 * El usuario/rol sale del _meta (McpMeta), nunca de parametros que pueda inventar el LLM.
 */
@Component
public class VacanteMcpTools {

    private final VacanteMcpService service;

    public VacanteMcpTools(VacanteMcpService service) {
        this.service = service;
    }

    @McpTool(name = "buscar_vacantes", description = """
            Busca vacantes y practicas ACTIVAS en SearchJobs. Disponible para cualquier usuario, incluso sin sesion.
            Todos los filtros son opcionales y se combinan (coincidencia parcial, sin distinguir mayusculas).
            Devuelve como maximo 20 resultados, de la mas reciente a la mas antigua.""")
    public ToolResult buscarVacantes(
            @McpToolParam(description = "Texto contenido en el titulo", required = false) String titulo,
            @McpToolParam(description = "Cargo o puesto (ej. 'desarrollador', 'auxiliar contable')", required = false) String cargo,
            @McpToolParam(description = "Ciudad (ej. 'Cartagena')", required = false) String ciudad,
            @McpToolParam(description = "Departamento (ej. 'Bolivar')", required = false) String departamento,
            @McpToolParam(description = "Modalidad (ej. 'remoto', 'presencial', 'hibrido')", required = false) String modalidad,
            @McpToolParam(description = "'vacante' para empleos o 'practica' para pasantias", required = false) String tipo,
            @McpToolParam(description = "Maximo de resultados (1-20, por defecto 10)", required = false) Integer limite,
            McpMeta meta) {
        McpUserContext ctx = McpUserContext.from(meta);
        return ToolResult.run("buscar_vacantes",
                () -> service.buscar(ctx, titulo, cargo, ciudad, departamento, modalidad, tipo, limite));
    }

    @McpTool(name = "obtener_vacante", description = """
            Devuelve el detalle completo de una vacante por su id. Las vacantes inactivas solo las ve su empresa duenia o un administrador.""")
    public ToolResult obtenerVacante(
            @McpToolParam(description = "Id de la vacante (campo 'id' devuelto por buscar_vacantes)", required = true) Long idVacante,
            McpMeta meta) {
        McpUserContext ctx = McpUserContext.from(meta);
        return ToolResult.run("obtener_vacante", () -> service.obtener(ctx, idVacante));
    }

    @McpTool(name = "listar_vacantes_de_empresa", description = """
            EMPRESA: lista TODAS sus propias vacantes (activas e inactivas).
            ADMIN/SUPER_ADMIN: lista las de la empresa indicada en idEmpresa.""")
    public ToolResult listarVacantesDeEmpresa(
            @McpToolParam(description = "Solo para administradores: id de la empresa a consultar", required = false) Long idEmpresa,
            @McpToolParam(description = "Maximo de resultados (1-20, por defecto 10)", required = false) Integer limite,
            McpMeta meta) {
        McpUserContext ctx = McpUserContext.from(meta);
        return ToolResult.run("listar_vacantes_de_empresa", () -> service.listarDeEmpresa(ctx, idEmpresa, limite));
    }

    @McpTool(name = "crear_vacante", description = """
            EMPRESA: publica una nueva vacante o practica a nombre de la empresa autenticada.
            Obligatorios: titulo, cargo (debe existir en el catalogo de cargos de la plataforma), modalidad, ciudad,
            departamento y tipo. Limites: titulo 100 caracteres, descripcion y requerimientos 400, ciudad/departamento/modalidad 50,
            experiencia 4 caracteres (anios, solo numero). sueldo: solo numero sin simbolos ni separadores (ej. 3500000).""")
    public ToolResult crearVacante(
            @McpToolParam(description = "Titulo de la oferta (max 100)", required = true) String titulo,
            @McpToolParam(description = "Cargo o puesto, nombre existente en el catalogo de cargos", required = true) String cargo,
            @McpToolParam(description = "Modalidad (remoto, presencial, hibrido)", required = true) String modalidad,
            @McpToolParam(description = "Ciudad", required = true) String ciudad,
            @McpToolParam(description = "Departamento", required = true) String departamento,
            @McpToolParam(description = "'vacante' o 'practica'", required = true) String tipo,
            @McpToolParam(description = "Descripcion de la oferta (max 400)", required = false) String descripcion,
            @McpToolParam(description = "Requerimientos del candidato (max 400)", required = false) String requerimientos,
            @McpToolParam(description = "Sueldo mensual, solo numero (ej. 3500000)", required = false) String sueldo,
            @McpToolParam(description = "Experiencia requerida en anios, solo numero", required = false) String experiencia,
            McpMeta meta) {
        McpUserContext ctx = McpUserContext.from(meta);
        Map<String, String> campos = campos(titulo, cargo, modalidad, ciudad, departamento, tipo,
                descripcion, requerimientos, sueldo, experiencia);
        return ToolResult.run("crear_vacante", () -> service.crear(ctx, campos));
    }

    @McpTool(name = "actualizar_vacante", description = """
            EMPRESA duenia (o ADMIN): modifica campos de una vacante. Envia SOLO los campos que cambian;
            los demas se conservan (incluidas aptitudes y requisitos). Confirma el cambio con el usuario antes de llamarla.""")
    public ToolResult actualizarVacante(
            @McpToolParam(description = "Id de la vacante a modificar", required = true) Long idVacante,
            @McpToolParam(description = "Nuevo titulo (max 100)", required = false) String titulo,
            @McpToolParam(description = "Nuevo cargo (debe existir en el catalogo)", required = false) String cargo,
            @McpToolParam(description = "Nueva modalidad", required = false) String modalidad,
            @McpToolParam(description = "Nueva ciudad", required = false) String ciudad,
            @McpToolParam(description = "Nuevo departamento", required = false) String departamento,
            @McpToolParam(description = "'vacante' o 'practica'", required = false) String tipo,
            @McpToolParam(description = "Nueva descripcion (max 400)", required = false) String descripcion,
            @McpToolParam(description = "Nuevos requerimientos (max 400)", required = false) String requerimientos,
            @McpToolParam(description = "Nuevo sueldo, solo numero", required = false) String sueldo,
            @McpToolParam(description = "Nueva experiencia en anios, solo numero (max 4 caracteres)", required = false) String experiencia,
            McpMeta meta) {
        McpUserContext ctx = McpUserContext.from(meta);
        Map<String, String> campos = campos(titulo, cargo, modalidad, ciudad, departamento, tipo,
                descripcion, requerimientos, sueldo, experiencia);
        return ToolResult.run("actualizar_vacante", () -> service.actualizar(ctx, idVacante, campos));
    }

    @McpTool(name = "cambiar_estado_vacante", description = """
            Activa o desactiva una vacante. EMPRESA: solo las suyas. ADMIN/SUPER_ADMIN: bloquea o desbloquea cualquiera.
            Una vacante solo es visible para candidatos si la empresa Y el administrador la mantienen activa.""")
    public ToolResult cambiarEstadoVacante(
            @McpToolParam(description = "Id de la vacante", required = true) Long idVacante,
            @McpToolParam(description = "true para activar, false para desactivar", required = true) Boolean activa,
            McpMeta meta) {
        McpUserContext ctx = McpUserContext.from(meta);
        return ToolResult.run("cambiar_estado_vacante",
                () -> service.cambiarEstado(ctx, idVacante, Boolean.TRUE.equals(activa)));
    }

    @McpTool(name = "eliminar_vacante", description = """
            Elimina DEFINITIVAMENTE una vacante (EMPRESA duenia o SUPER_ADMIN). Es irreversible y puede estar deshabilitada
            en el sistema: solo usala si el usuario lo pidio de forma explicita y confirmo. Si solo quiere ocultarla, usa cambiar_estado_vacante.""")
    public ToolResult eliminarVacante(
            @McpToolParam(description = "Id de la vacante a eliminar", required = true) Long idVacante,
            @McpToolParam(description = "Debe ser true y solo si el usuario confirmo explicitamente la eliminacion", required = true) Boolean confirmado,
            McpMeta meta) {
        if (!Boolean.TRUE.equals(confirmado)) {
            return ToolResult.error("Pide confirmacion explicita al usuario antes de eliminar la vacante.");
        }
        McpUserContext ctx = McpUserContext.from(meta);
        return ToolResult.run("eliminar_vacante", () -> {
            service.eliminar(ctx, idVacante);
            return "Vacante " + idVacante + " eliminada.";
        });
    }

    private Map<String, String> campos(String titulo, String cargo, String modalidad, String ciudad,
            String departamento, String tipo, String descripcion, String requerimientos,
            String sueldo, String experiencia) {
        Map<String, String> m = new LinkedHashMap<>();
        m.put("titulo", titulo);
        m.put("cargo", cargo);
        m.put("modalidad", modalidad);
        m.put("ciudad", ciudad);
        m.put("departamento", departamento);
        m.put("tipo", tipo);
        m.put("descripcion", descripcion);
        m.put("requerimientos", requerimientos);
        m.put("sueldo", sueldo);
        m.put("experiencia", experiencia);
        return m; // LinkedHashMap admite nulls; el mapper ignora los vacios
    }
}
