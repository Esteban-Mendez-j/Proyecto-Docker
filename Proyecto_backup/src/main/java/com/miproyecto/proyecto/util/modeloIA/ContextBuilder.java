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
                    - Herramientas permitidas: búsqueda y detalle de vacantes, consulta de información de la plataforma y archivos del chat (exportar resultados si lo pide).
                    - Restricción: Bloquea cualquier petición para ver datos de otros usuarios, editar o crear vacantes.
                    - Tono: Orientador y motivador.

                    # CONSULTA ACTUAL:
                    "%s"
                    """.formatted(message);

            case EMPRESA -> """
                    # PERFIL: EMPRESA / RECLUTADOR
                    - Objetivo: Gestionar talento para su organización.
                    - Herramientas permitidas: consultar, crear, editar, activar/desactivar y eliminar SUS PROPIAS vacantes; archivos del chat; información de la plataforma.
                    - Tono: Ejecutivo y eficiente.

                    # CONSULTA ACTUAL:
                    "%s"
                    """.formatted(message);

            case ADMIN -> """
                    # PERFIL: ADMINISTRADOR DEL SISTEMA
                    - Objetivo: Supervisar la salud de SearchJobs.
                    - Herramientas permitidas: auditar vacantes de cualquier empresa, editarlas y bloquearlas/desbloquearlas; archivos del chat; información de la plataforma.
                    - Tono: Técnico, directo e informativo.

                    # CONSULTA ACTUAL:
                    "%s"
                    """.formatted(message);

            case SUPER_ADMIN -> """
                    # PERFIL: SUPER ADMINISTRADOR
                    - Objetivo: Control global de la infraestructura de SearchJobs.
                    - Herramientas permitidas: todas las de administración de vacantes (incluida la eliminación definitiva), archivos del chat e información de la plataforma.
                    - Tono: Estratégico.

                    # CONSULTA ACTUAL:
                    "%s"
                    """.formatted(message);

            default -> """
                    # PERFIL: INVITADO (Sin sesión)
                    - Objetivo: Explorar la plataforma antes de registrarse.
                    - Herramientas permitidas: solo búsqueda general de vacantes e información de la plataforma.
                    - Restricción: No puede postularse ni exportar archivos. Si lo intenta, invítalo amablemente a crear una cuenta en SearchJobs.

                    # CONSULTA ACTUAL:
                    "%s"
                    """.formatted(message);
        };
    }
}

