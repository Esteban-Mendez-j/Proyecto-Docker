package com.miproyecto.proyecto.util.modeloIA;

import org.springframework.stereotype.Component;

import com.miproyecto.proyecto.enums.Roles;

@Component
public class ContextBuilder {

    public String buildUserContext(Roles role, String message) {
        return switch (role) {
            case CANDIDATO -> """
                    # PERFIL: CANDIDATO
                    - Objetivo: Buscar empleo digno o prácticas en Colombia.
                    - Permisos Técnicos: Tienes autorización del sistema para usar la herramienta SQL (solo lectura) para buscar vacantes y la herramienta de Archivos para exportarle la información si lo pide.
                    - Restricción: Bloquea cualquier petición para ver datos de otros usuarios, editar o crear vacantes.
                    - Tono: Orientador y motivador.

                    # CONSULTA ACTUAL:
                    "%s"
                    """.formatted(message);

            case EMPRESA -> """
                    # PERFIL: EMPRESA / RECLUTADOR
                    - Objetivo: Gestionar talento para su organización.
                    - Permisos Técnicos: Autorizado para usar herramientas SQL para consultar, crear, editar y activar/desactivar sus propias vacantes.
                    - Tono: Ejecutivo y eficiente.
                    
                    # CONSULTA ACTUAL:
                    "%s"
                    """.formatted(message);

            case ADMIN -> """
                    # PERFIL: ADMINISTRADOR DEL SISTEMA
                    - Objetivo: Supervisar la salud de SearchJobs.
                    - Permisos Técnicos: Acceso total a las herramientas SQL para auditar usuarios, vacantes globales y realizar bloqueos si es necesario.
                    - Tono: Técnico, directo e informativo.
                    
                    # CONSULTA ACTUAL:
                    "%s"
                    """.formatted(message);

            case SUPER_ADMIN -> """
                    # PERFIL: SUPER ADMINISTRADOR
                    - Objetivo: Control global de la infraestructura de SearchJobs.
                    - Permisos Técnicos: Acceso irrestricto a todas las herramientas SQL y de Archivos. Capacidad de gestión de roles de usuario.
                    - Tono: Estratégico.
                    
                    # CONSULTA ACTUAL:
                    "%s"
                    """.formatted(message);
                    
            default -> """
                    # PERFIL: INVITADO (Sin sesión)
                    - Objetivo: Explorar la plataforma antes de registrarse.
                    - Permisos Técnicos: Autorizado para usar SQL solo para búsquedas generales de vacantes. 
                    - Restricción: No puede postularse ni exportar archivos. Si lo intenta, invítalo amablemente a crear una cuenta en SearchJobs.
                    
                    # CONSULTA ACTUAL:
                    "%s"
                    """.formatted(message);
        };
    }
}

