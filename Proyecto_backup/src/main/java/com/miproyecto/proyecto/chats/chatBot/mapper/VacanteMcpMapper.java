package com.miproyecto.proyecto.chats.chatBot.mapper;

import java.beans.PropertyDescriptor;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeansException;
import org.springframework.beans.DirectFieldAccessor;
import org.springframework.beans.PropertyAccessorFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;

import com.miproyecto.proyecto.chats.chatBot.dto.VacanteInfo;
import com.miproyecto.proyecto.vacante.dto.VacanteDTO;


/**
 * Convierte entre tu VacanteDTO y lo que ve/envia el LLM. Usa BeanWrapper (por nombre de propiedad y con
 * conversion automatica de tipos: sueldo Double, experiencia String, etc.), asi no depende de getters concretos.
 * Trabaja SIEMPRE con el DTO que ya produce tu VacanteService (cargo como texto, aptitudes, requisitos...).
 */
@Component
public class VacanteMcpMapper {

    private static final Logger log = LoggerFactory.getLogger(VacanteMcpMapper.class);

    /** Campos que el LLM puede enviar. Longitudes maximas = las de tu entidad/DTO. */
    private static final Map<String, Integer> MAX_LONGITUD = Map.of(
            "titulo", 100, "descripcion", 400, "requerimientos", 400, "tipo", 15,
            "modalidad", 50, "ciudad", 50, "departamento", 50, "experiencia", 4);

    public static final List<String> CAMPOS_EDITABLES = List.of(
            "titulo", "cargo", "descripcion", "ciudad", "departamento", "modalidad",
            "requerimientos", "tipo", "sueldo", "experiencia");

    public VacanteInfo toInfo(VacanteDTO d) {
        BeanWrapper w = PropertyAccessorFactory.forBeanPropertyAccess(d);
        Object rawId = leer(w, "nvacantes");
        return new VacanteInfo(
                rawId instanceof Number n ? n.longValue() : null,
                texto(w, "titulo"),
                texto(w, "cargo"),
                texto(w, "descripcion"),
                texto(w, "ciudad"),
                texto(w, "departamento"),
                texto(w, "modalidad"),
                texto(w, "sueldo"),
                texto(w, "experiencia"),
                texto(w, "requerimientos"),
                texto(w, "tipo"),
                texto(w, "nameEmpresa"),
                texto(w, "fechaPublicacion"),
                texto(w, "totalpostulaciones"),
                lista(w, "aptitudes"),
                lista(w, "requisitos"),
                booleano(w, "isActive"),
                booleano(w, "activaPorEmpresa"));
    }

    /** Visible para candidatos/invitados solo si empresa Y administrador la mantienen activa. */
    public boolean esPublica(VacanteDTO d) {
        BeanWrapper w = PropertyAccessorFactory.forBeanPropertyAccess(d);
        return Boolean.TRUE.equals(booleano(w, "isActive")) && Boolean.TRUE.equals(booleano(w, "activaPorEmpresa"));
    }

    /** Id del usuario-empresa duenio (campo idUsuario del DTO). */
    public Long propietarioId(VacanteDTO d) {
        Object o = leer(PropertyAccessorFactory.forBeanPropertyAccess(d), "idUsuario");
        return o instanceof Number n ? Long.valueOf(n.longValue()) : null;
    }

    /** Copia los campos al DTO validando longitud y convirtiendo al tipo real de cada propiedad. */
    public void aplicar(VacanteDTO destino, Map<String, String> campos) {
        BeanWrapper w = PropertyAccessorFactory.forBeanPropertyAccess(destino);
        campos.forEach((nombre, valor) -> {
            if (valor == null || valor.isBlank()) {
                return;
            }
            String v = valor.trim();
            if ("tipo".equals(nombre)) {
                v = v.toLowerCase();
                if (!v.equals("vacante") && !v.equals("practica")) {
                    throw new IllegalArgumentException("El tipo debe ser 'vacante' o 'practica'.");
                }
            }
            Integer max = MAX_LONGITUD.get(nombre);
            if (max != null && v.length() > max) {
                throw new IllegalArgumentException("El campo '" + nombre + "' admite maximo " + max
                        + " caracteres (recibidos " + v.length() + "). Acortalo.");
            }
            if (!w.isWritableProperty(nombre)) {
                throw new IllegalStateException("El campo '" + nombre + "' no existe en VacanteDTO. Ajusta VacanteMcpMapper.");
            }
            try {
                w.setPropertyValue(nombre, v);
            } catch (BeansException e) {
                throw new IllegalArgumentException("Valor invalido para '" + nombre + "': " + valor
                        + ". Los numeros van sin simbolos ni separadores (ej. 3500000).");
            }
        });
    }

    public void fijarIdUsuario(VacanteDTO destino, Long idUsuario) {
        PropertyAccessorFactory.forBeanPropertyAccess(destino).setPropertyValue("idUsuario", idUsuario);
    }

    // ---------- helpers ----------

    private Object leer(BeanWrapper w, String nombre) {
        if (w.isReadableProperty(nombre)) {
            return w.getPropertyValue(nombre);
        }
        DirectFieldAccessor campo = new DirectFieldAccessor(w.getWrappedInstance());
        return campo.isReadableProperty(nombre) ? campo.getPropertyValue(nombre) : null;
    }

    private String texto(BeanWrapper w, String nombre) {
        Object o = leer(w, nombre);
        return o == null ? null : String.valueOf(o);
    }

    private Boolean booleano(BeanWrapper w, String nombre) {
        Object o = leer(w, nombre);
        return o instanceof Boolean b ? b : null;
    }

    private List<String> lista(BeanWrapper w, String nombre) {
        Object o = leer(w, nombre);
        if (o instanceof Collection<?> c) {
            return c.stream().map(String::valueOf).toList();
        }
        return List.of();
    }

    /** Aviso temprano (solo log) si algun nombre no coincide con tu DTO. */
    @EventListener(ApplicationReadyEvent.class)
    void validar() {
        for (String campo : CAMPOS_EDITABLES) {
            comprobar(campo, true);
        }
        comprobar("idUsuario", true);
        for (String campo : List.of("nvacantes", "isActive", "activaPorEmpresa", "nameEmpresa",
                "aptitudes", "requisitos", "fechaPublicacion", "totalpostulaciones")) {
            comprobar(campo, false);
        }
    }

    private void comprobar(String campo, boolean escritura) {
        PropertyDescriptor pd = BeanUtils.getPropertyDescriptor(VacanteDTO.class, campo);
        boolean ok;
        if (escritura) {
            ok = pd != null && pd.getWriteMethod() != null;
        } else {
            ok = (pd != null && pd.getReadMethod() != null)
                    || ReflectionUtils.findField(VacanteDTO.class, campo) != null;
        }
        if (!ok) {
            log.warn("MCP: la propiedad '{}' no es {} en VacanteDTO. Ajusta VacanteMcpMapper.",
                    campo, escritura ? "escribible" : "legible");
        }
    }
}
