package com.miproyecto.proyecto.usuario.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriUtils;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SupabaseStorageService {

    private final RestClient restClient;
    private final String supabaseUrl;

    public SupabaseStorageService(
            @Value("${app.supabase.key.publica}") String supabaseUrl,
            @Value("${app.supabase.key.privada}") String supabaseKey) {

        this.supabaseUrl = supabaseUrl.replaceAll("/+$", "");

        this.restClient = RestClient.builder()
                .defaultHeader("apikey", supabaseKey)
                .build();
    }

    // SUBIR ARCHIVO
    public String subirArchivo(
            String bucket,
            String ruta,
            byte[] contenido,
            String tipoContenido) {

        String url = supabaseUrl
                + "/storage/v1/object/"
                + bucket + "/"
                + codificarRuta(ruta);

        restClient.post()
                .uri(URI.create(url))
                .contentType(MediaType.parseMediaType(tipoContenido))
                .header("x-upsert", "false")
                .body(contenido)
                .retrieve()
                .toBodilessEntity();

        return ruta;
    }

    // ELIMINAR ARCHIVO
    public void eliminarArchivo(String bucket, String ruta) {

        String url = supabaseUrl
                + "/storage/v1/object/"
                + bucket;

        restClient.method(HttpMethod.DELETE)
                .uri(URI.create(url))
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("prefixes", List.of(ruta)))
                .retrieve()
                .toBodilessEntity();
    }

    // OBTENER URL PUBLICA
    public String obtenerUrlPublica(String bucket, String ruta) {

        return supabaseUrl
                + "/storage/v1/object/public/"
                + bucket + "/"
                + codificarRuta(ruta);
    }

    // DESCARGAR ARCHIVO DE UN BUCKET PUBLICO
    public byte[] descargarArchivoPublico(
            String bucket,
            String ruta) {

        String url = obtenerUrlPublica(bucket, ruta);

        return restClient.get()
                .uri(URI.create(url))
                .retrieve()
                .body(byte[].class);
    }

    // CODIFICAR CADA SEGMENTO SIN PERDER LAS RUTAS INTERNAS
    private String codificarRuta(String ruta) {

        return Arrays.stream(ruta.split("/", -1))
                .map(segmento -> UriUtils.encodePathSegment(
                        segmento,
                        StandardCharsets.UTF_8))
                .collect(Collectors.joining("/"));
    }

    public String generarNombreArchivo(
            String nombreOriginal,
            Long idUsuario,
            boolean esArchivoChat) {

        String nombre = obtenerNombreSeguro(nombreOriginal);

        if (esArchivoChat) {

            int punto = nombre.lastIndexOf('.');

            String nombreBase = punto > 0
                    ? nombre.substring(0, punto)
                    : nombre;

            String extension = punto > 0
                    ? nombre.substring(punto)
                    : "";

            return nombreBase
                    + "_"
                    + UUID.randomUUID()
                    + extension;
        }

        return idUsuario
                + "_"
                + UUID.randomUUID()
                + "_"
                + nombre;
    }

    public String obtenerNombreSeguro(String nombreOriginal) {

        if (nombreOriginal == null || nombreOriginal.isBlank()) {
            return "archivo_" + UUID.randomUUID();
        }

        // Evita que el nombre recibido incluya rutas locales.
        String nombre = nombreOriginal.replace("\\", "/");

        nombre = nombre.substring(nombre.lastIndexOf('/') + 1);

        nombre = nombre.replaceAll("[\\r\\n]", "_");

        if (nombre.isBlank() || nombre.equals(".") || nombre.equals("..")) {
            return "archivo_" + UUID.randomUUID();
        }

        return nombre;
    }

    public List<String> obtenerArchivosChat(String chatId) {

        List<Map<String, Object>> respuesta = restClient.post()
                .uri(supabaseUrl + "/storage/v1/object/list/file")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "prefix", "chat/" + chatId + "/",
                        "limit", 100,
                        "offset", 0,
                        "sortBy", Map.of(
                                "column", "name",
                                "order", "asc")))
                .retrieve()
                .body(new org.springframework.core.ParameterizedTypeReference<List<Map<String, Object>>>() {
                });

        if (respuesta == null) {
            return List.of();
        }

        return respuesta.stream()
                .map(archivo -> (String) archivo.get("name"))
                .filter(java.util.Objects::nonNull)
                .toList();
    }
}