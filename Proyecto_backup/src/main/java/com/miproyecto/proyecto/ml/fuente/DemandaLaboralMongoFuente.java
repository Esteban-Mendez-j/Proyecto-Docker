package com.miproyecto.proyecto.ml.fuente;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.miproyecto.proyecto.ml.dto.demandaLaboral.CargoPrediccion;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;

@Component
@ConditionalOnProperty(name = "prediccion.fuente", havingValue = "mongo")
public class DemandaLaboralMongoFuente implements DemandaLaboralFuente {

    /** Corrida vigente ya convertida: se recarga solo cuando el puntero cambia. */
    private record Vigente(String ejecucionId, LocalDateTime generadaEn, List<CargoPrediccion> cargos) {}

    private final MongoClient mongoClient;
    private final ObjectMapper objectMapper;
    private final String nombreBase;
    private volatile Vigente cache;

    public DemandaLaboralMongoFuente(
            MongoClient mongoClient,
            ObjectMapper objectMapper,
            @Value("${prediccion.mongo.base:searchjobs_prediccion}") String nombreBase) {
        this.mongoClient = mongoClient;
        this.objectMapper = objectMapper;
        this.nombreBase = nombreBase;
    }

    @Override
    public List<CargoPrediccion> obtenerCargos() {
        Vigente v = vigente();
        return v == null ? List.of() : v.cargos();
    }

    @Override
    public Optional<LocalDateTime> fechaGeneracion() {
        Vigente v = vigente();
        return v == null ? Optional.empty() : Optional.ofNullable(v.generadaEn());
    }

    private Vigente vigente() {
        MongoDatabase db = mongoClient.getDatabase(nombreBase);
        Document puntero = db.getCollection("config").find(Filters.eq("_id", "prediccion_vigente")).first();
        if (puntero == null) {
            return null; // todavía no se ha publicado ninguna predicción
        }
        String ejecucionId = puntero.getString("ejecucion_id");
        Vigente actual = cache;
        if (actual != null && actual.ejecucionId().equals(ejecucionId)) {
            return actual; // misma corrida: no hace falta volver a leer los cargos
        }

        List<CargoPrediccion> cargos = new ArrayList<>();
        for (Document doc : db.getCollection("predicciones_cargo")
                .find(Filters.eq("ejecucion_id", ejecucionId))
                .sort(Sorts.ascending("datos.posicion"))) {
            cargos.add(aCargo(objectMapper, doc.get("datos", Document.class)));
        }
        Document ejecucion = db.getCollection("ejecuciones").find(Filters.eq("_id", ejecucionId)).first();
        Vigente nuevo = new Vigente(ejecucionId, fecha(ejecucion), List.copyOf(cargos));
        cache = nuevo;
        return nuevo;
    }

    static CargoPrediccion aCargo(ObjectMapper objectMapper, Document datos) {
        return objectMapper.convertValue(datos, CargoPrediccion.class);
    }

    private static LocalDateTime fecha(Document ejecucion) {
        if (ejecucion == null) {
            return null;
        }
        Date d = ejecucion.getDate("finalizado_en");
        return d == null ? null : LocalDateTime.ofInstant(d.toInstant(), ZoneId.systemDefault());
    }
}