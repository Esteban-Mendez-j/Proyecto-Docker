package com.miproyecto.proyecto.config;

import java.util.concurrent.TimeUnit;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.miproyecto.proyecto.vacante.dto.BloqueVacantesCache;

@Configuration 
@EnableCaching 
public class CacheConfig {

    @Bean 
    public CacheManager cacheManager() {

        CaffeineCacheManager cacheManager =
                new CaffeineCacheManager("vacantesOptimizadas");

        cacheManager.setCaffeine(
                Caffeine.newBuilder()
                        .maximumSize(20)
                        .expireAfterWrite(10, TimeUnit.MINUTES)
                        .recordStats()
        );

        return cacheManager;
    }

    @Bean(name = "vacantesOptimizadasCache")
    public Cache<String, BloqueVacantesCache> vacantesOptimizadasCache() {
        return Caffeine.newBuilder()
                .maximumSize(20)
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .recordStats()
                .build();
    }
}