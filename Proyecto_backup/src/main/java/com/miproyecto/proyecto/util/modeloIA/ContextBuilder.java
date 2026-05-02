package com.miproyecto.proyecto.util.modeloIA;

import org.springframework.stereotype.Component;

import com.miproyecto.proyecto.enums.IntentType;

@Component
public class ContextBuilder {

    public String buildContext(IntentType intent){

        return switch (intent) {

            case DESCRIPCION_PLATAFORMA -> """
                Información relevante:
                SearchJobs es una plataforma web de búsqueda de empleo disponible en Colombia.
                Permite a los usuarios explorar vacantes, postularse a ofertas laborales y a las empresas publicar oportunidades de trabajo.

                Los usuarios pueden crear una cuenta, completar su perfil profesional y aplicar a vacantes según su experiencia y habilidades.
                """;

            case DESCRIPCION_ASISTENTE -> """
                Información relevante:
                Soy el asistente virtual de la plataforma SearchJobs.

                Puedo ayudarte con información sobre el uso de la plataforma, procesos de postulación,
                vacantes disponibles y temas relacionados con el ámbito laboral.
                """;

            case POSTULACION -> """
                Información relevante:
                Una postulación es el proceso mediante el cual un candidato aplica a una vacante,
                manifestando su interés en ocupar un puesto de trabajo.

                Al postularse, el candidato envía su perfil a la empresa, la cual evaluará si cumple
                con los requisitos y decidirá si continúa en el proceso.

                Para postularse:
                1. Iniciar sesión en la plataforma
                2. Ir a la sección de empleos
                3. Seleccionar una vacante
                4. Hacer clic en "Postularme"
                """;

            case REQUISITOS_POSTULACION -> """
                Información relevante:
                Para poder postularse a una vacante en SearchJobs es necesario cumplir con ciertos requisitos.

                Estos incluyen:
                - Tener una cuenta registrada en la plataforma
                - Contar con el perfil completo
                - Tener el currículum (CV) cargado en formato PDF
                - Cumplir con los requisitos específicos de la vacante
                """;

            case VACANTES -> """
                Información relevante:
                Una vacante u oferta laboral es una oportunidad de empleo publicada por una empresa.

                Cada vacante incluye información como descripción del cargo, requisitos,
                ubicación, condiciones laborales y número de postulaciones.
                """;

            case BUSQUEDA_EMPLEO -> """
                Información relevante:
                En SearchJobs puedes buscar empleo desde la sección de empleos.

                Puedes utilizar filtros como:
                - Cargo o puesto
                - Ciudad
                - Título de la vacante
                - Número de postulaciones

                Esto permite encontrar oportunidades que se ajusten a tu perfil.
                """;

            case PERFIL_USUARIO -> """
                Información relevante:
                El perfil de usuario es fundamental para postularse a vacantes.

                En él puedes:
                - Subir tu currículum en formato PDF
                - Registrar información personal (nombre, teléfono, correo)
                - Agregar habilidades o aptitudes
                - Incluir historial laboral
                - Incluir formación académica

                Un perfil completo aumenta las posibilidades de ser seleccionado.
                """;

            case INVALIDA -> """
                Solo puedo ayudarte con temas de empleos y la plataforma SearchJobs.
                """;

            default -> "";
        };
    }
}
