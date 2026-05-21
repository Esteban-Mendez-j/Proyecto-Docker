package com.miproyecto.proyecto.chats.chatBot.service.implementation;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import com.miproyecto.proyecto.chats.chatBot.model.Documento;
import com.miproyecto.proyecto.chats.chatBot.model.Metadata;
import com.miproyecto.proyecto.chats.chatBot.repository.DocumentoRepository;
import com.miproyecto.proyecto.chats.chatBot.repository.VectorDocumentoRepository;
import com.miproyecto.proyecto.chats.chatBot.service.interfaces.DocumentoService;
import com.miproyecto.proyecto.util.NotFoundException;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class DocumentoServiceImpl implements DocumentoService{
    private final VectorDocumentoRepository vectorDocumentoRespository;
    private final DocumentoRepository documentoRepository;

    @Override
    public void saveDocument(Resource resource) {

        try {
            String content = new String(
                    resource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8);

            String fileName = resource.getFilename();
            Metadata metadata = Metadata.builder().fileName(fileName).fileHash(generateHash(resource)).build();
            Documento documento = Documento.builder().metadata(metadata).content(content).build();
            vectorDocumentoRespository.save(documento);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Boolean existDocument(Resource resource) throws Exception {

        if (resource == null)
            return false;

        String fileName = resource.getFilename();

        Boolean exist = documentoRepository.existByFileName(fileName);
        return exist;
    }

    @Override
    public Documento findByFileName(String FileName) {

        return documentoRepository.findFirstByMetadataFileName(FileName)
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public void deleteDocumento(String fileName){
        documentoRepository.deleteByMetadataFileName(fileName);
    }

    @Override
    public boolean hashIsEquals(Resource resource) throws Exception {

        Documento documento = findByFileName(resource.getFilename());

        String currentHash = generateHash(resource);

        if(documento == null) {
            return false;
        }

        return documento.getMetadata().getFileHash().equals(currentHash);
    }

    @Override
    public List<String> findSimilarDocuments(String searchText) {
        return vectorDocumentoRespository.findSimilarDocuments(searchText);
    }


    public String generateHash(Resource resource) throws Exception {

        byte[] fileBytes = resource.getInputStream().readAllBytes();

        MessageDigest digest = MessageDigest.getInstance("SHA-256");

        byte[] hashBytes = digest.digest(fileBytes);

        StringBuilder sb = new StringBuilder();

        for (byte b : hashBytes) {
            sb.append(String.format("%02x", b));
        }

        return sb.toString();
    }
}
