package com.miproyecto.proyecto.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.miproyecto.proyecto.chats.chatBot.service.interfaces.DocumentoService;

@Transactional
@Component
public class InyeccionRagDocument implements CommandLineRunner{

    private final DocumentoService documentoService;

    public InyeccionRagDocument(DocumentoService documentoService) {
        this.documentoService = documentoService;
        
    }

    @Override
    public void run(String... args) throws Exception {

        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        
        Resource[] resources = resolver.getResources("classpath:documents/*.txt");
        
        if(resources == null || resources.length == 0) return;

        for (Resource resource : resources) {
            if (!documentoService.existDocument(resource)) {
                documentoService.saveDocument(resource);
                continue;
            }

            if (!documentoService.hashIsEquals(resource)) {
                documentoService.deleteDocumento(resource.getFilename());
                documentoService.saveDocument(resource);
            }
        }
    }
}
