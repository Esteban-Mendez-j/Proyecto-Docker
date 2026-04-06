package com.miproyecto.proyecto.util;

import org.springframework.stereotype.Component;


import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class PromptBuilder {


    public String buildSystemPrompt() {

        return """
            Eres un asistente de la plataforma SearchJobs.

            Responde en base al contexto, de manera breve, formal y en español
            a preguntas relacionadas con empleos, informacion laboral y 
            funcionamiento de la plataforma searchjobs. 
            SOLO puedes responder preguntas relacionadas con empleos o la plataforma Searchjobs. 
            Si la pregunta NO está relacionada con Searchjobs o infromacion laboral, 
            debes responder EXACTAMENTE: 
            "Solo puedo ayudarte con temas de empleos y la plataforma SearchJobs."

            CONTEXTO:
            {contexto}

            PREGUNTA DEL USUARIO:
            {mensaje}
        """;
    }

    public String buildPromptIntencion(){

        return """
            Eres un clasificador de intenciones.

            Tu tarea es analizar la pregunta y devolver SOLO el nombre de la intención.

            REGLAS:
            Devuelve SOLO una palabra en MAYÚSCULAS. Debe ser una de la lista si aplica.
            Si no aplica, crea una palabra en MAYÚSCULAS coherente, con guiones bajos entre 
            palabras en lugar de espacios y sin espacios en los extremos.NO expliques.
            NO agregues texto adicional. Si la pregunta no tiene relacion alguna con la plataforma
            Searchjobs o informacion de empleo devuelve la intencion "INVALIDA".

            LISTADO:
            {intenciones}

            PREGUNTA:
            {mensaje}
        """;
    }

    public String builPromptContext(){
        return"""
            Eres un generador de contexto.

            Tu tarea es generar un contexto claro, breve y preciso a partir de la intención y la pregunta del usuario.

            REGLAS:
            Enfocate en temas laborales o en la plataforma searchjobs

            Si la intención o la pregunta están fuera de estos temas, No respondas la pregunta y 
            No agregues contenido adicional, solo responde exactamente:
            "La pregunta está fuera de los temas laborales o la plataforma SearchJobs."
            
            Si la pregunta está dentro de los temas, entonces Redacta el texto en un lenguaje 
            sencillo y fácil de entender. Resume la intención del usuario y su duda principal en 
            un parrafo de maximo 4 lineas.

            INTENCION:
            {intencion}

            PREGUNTA:
            {mensaje}
             
            """;
    }


    // public String buildPromptIntencion(String mensaje){

    //     return """
    //     Con respecto a la pregunta del usuario detecta la intencion de este y 
    //     describelo en una palabra teniendo en cuenta el listado de intencion que te proporcione. 
    //     Si no encuentra la intencion en el listado genera tu mismo la palabra y crea  un contexto 
        
    //     LISTADO DE INTENCION: 
    //     %s

    //     PRREGUNTA:
    //     %s
    //     """.formatted(IntentType.values(), mensaje);

    // }
}
