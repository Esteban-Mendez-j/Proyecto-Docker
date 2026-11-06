
package com.miproyecto.proyecto.vacante.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.github.benmanes.caffeine.cache.Cache;
import com.miproyecto.proyecto.vacante.dto.BloqueVacantesCache;

import lombok.extern.slf4j.Slf4j;

import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
@Slf4j
public class VacantesCacheService {

    private static final int MAX_ENTRADAS_CANDIDATO = 3;

    private final Cache<String, BloqueVacantesCache> cache;

    // Registra el momento de creación de cada entrada.
    private final Map<String, Long> fechasCreacion = new ConcurrentHashMap<>();

    // Bloqueos compartidos para coordinar peticiones concurrentes.
    private final Object[] bloqueos = new Object[64];

    public VacantesCacheService(
            @Qualifier("vacantesOptimizadasCache")
            Cache<String, BloqueVacantesCache> cache) {

        this.cache = cache;

        for (int i = 0; i < bloqueos.length; i++) {
            bloqueos[i] = new Object();
        }
    }

    private Object obtenerBloqueo(Long idCandidato) {
        int indice = Math.floorMod(idCandidato.hashCode(), bloqueos.length);
        return bloqueos[indice];
    }

    /**
     * Obtiene un bloque de la caché.
     * Controla que cada candidato tenga máximo 3 entradas.
     */
    public BloqueVacantesCache obtenerBloque(
            Long idCandidato,
            String cacheKey,
            Supplier<BloqueVacantesCache> cargador) {

        if (idCandidato == null) {
            throw new IllegalArgumentException("El candidato es obligatorio");
        }

        Object bloqueo = obtenerBloqueo(idCandidato);

        synchronized (bloqueo) {

            cache.cleanUp();

            // Comprobar si la entrada ya existe sin alterar las estadísticas.
            boolean yaExistia = cache.asMap().containsKey(cacheKey);

            // Obtener de Caffeine o cargar y optimizar el bloque.
            BloqueVacantesCache resultado =
                    cache.get(cacheKey, key -> cargador.get());

            // Solo controlar el límite cuando se creó una entrada nueva.
            if (!yaExistia) {
                limitarEntradasCandidato(idCandidato);
            }

            return resultado;
        }
    }

    /**
     * Mantiene máximo 3 entradas por candidato.
     * Elimina la entrada creada más antiguamente.
     */
    private void limitarEntradasCandidato(Long idCandidato) {

        String prefijo = idCandidato + "|";

        List<String> claves = new ArrayList<>();

        for (String key : cache.asMap().keySet()) {
            if (key.startsWith(prefijo)) {
                claves.add(key);
            }
        }

        // Registrar entradas que todavía no tengan fecha.
        for (String key : claves) {
            fechasCreacion.putIfAbsent(key, System.nanoTime());
        }

        // Eliminar la más antigua hasta cumplir el límite.
        while (claves.size() > MAX_ENTRADAS_CANDIDATO) {

            String masAntigua = claves.stream()
                    .min(Comparator.comparingLong(
                            key -> fechasCreacion.getOrDefault(
                                    key, Long.MAX_VALUE)))
                    .orElse(null);

            if (masAntigua == null) {
                break;
            }

            cache.invalidate(masAntigua);
            fechasCreacion.remove(masAntigua);
            claves.remove(masAntigua);

            log.info(
                "Entrada antigua eliminada. Candidato: {}, clave: {}",
                idCandidato,
                masAntigua
            );
        }
    }

    /**
     * Ejecuta una acción después de confirmar la transacción.
     */
    private void ejecutarDespuesDelCommit(Runnable accion) {

        if (TransactionSynchronizationManager.isSynchronizationActive()) {

            TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        accion.run();
                    }
                }
            );

        } else {
            accion.run();
        }
    }

    /**
     * Invalida todos los bloques de un candidato.
     */
    public void invalidarPorCandidato(Long idCandidato) {

        if (idCandidato == null) {
            return;
        }

        ejecutarDespuesDelCommit(() -> {

            synchronized (obtenerBloqueo(idCandidato)) {

                String prefijo = idCandidato + "|";

                long eliminadas = cache.asMap()
                        .keySet()
                        .stream()
                        .filter(key -> key.startsWith(prefijo))
                        .count();

                cache.asMap().keySet()
                        .removeIf(key -> key.startsWith(prefijo));

                fechasCreacion.keySet()
                        .removeIf(key -> key.startsWith(prefijo));

                log.info(
                    "Caché invalidada para candidato {}. Entradas eliminadas: {}",
                    idCandidato,
                    eliminadas
                );
            }
        });
    }

    /**
     * Invalida todos los bloques de todos los candidatos.
     */
    public void invalidarTodas() {

        ejecutarDespuesDelCommit(() -> {

            cache.invalidateAll();
            fechasCreacion.clear();

            log.info("Caché global invalidada");
        });
    }
}
