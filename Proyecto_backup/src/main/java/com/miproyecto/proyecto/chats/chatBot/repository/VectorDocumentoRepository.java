package com.miproyecto.proyecto.chats.chatBot.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Component;

import com.miproyecto.proyecto.chats.chatBot.model.Documento;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Component
public class VectorDocumentoRepository{
    private final VectorStore vectorStore;
    
    public void save(Documento documento) {

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("fileName", documento.getMetadata().getFileName());
        metadata.put("fileHash", documento.getMetadata().getFileHash());
        Document document = new Document(documento.getContent(), metadata);
        
        TokenTextSplitter splitter = new TokenTextSplitter(
                200,
                50,
                10,
                5000,
                true);

        List<Document> documents = splitter.apply(List.of(document));

        vectorStore.add(documents);
    }

    public List<String> findSimilarDocuments(String searchText) {

        return vectorStore
            .similaritySearch(SearchRequest.builder()
                .query(searchText)
                .topK(1)
                .build())
            .stream()
            .map(document -> {
                return document.getText();
            })
            .toList();
    }
}
