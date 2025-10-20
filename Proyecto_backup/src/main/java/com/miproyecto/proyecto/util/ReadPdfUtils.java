package com.miproyecto.proyecto.util;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBufferedFile;

public class ReadPdfUtils {

    public String extraerTexto (String rutaPdf ){
        try{
            PDDocument documento = Loader.loadPDF( new RandomAccessReadBufferedFile(rutaPdf));
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(documento);
        } catch (IOException e) {
            throw new RuntimeException("Error al leer el PDF: " + e.getMessage());
        }
    }

    public Map<String, String> extraerDatos(String texto) {
        Map<String, String> datos = new HashMap<>();

        // Email
        Matcher mEmail = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}").matcher(texto);
        if (mEmail.find()) datos.put("correo", mEmail.group());

        // Teléfono
        Matcher mTel = Pattern.compile("(\\+?\\d{1,3}[\\s-]?)?(\\(?\\d{2,4}\\)?[\\s-]?)?\\d{6,8}").matcher(texto);
        if (mTel.find()) datos.put("telefono", mTel.group());

        // Nombre (primera línea corta)
        String[] lineas = texto.split("\\r?\\n");
        for (String linea : lineas) {
            if (linea.trim().split(" ").length >= 2 && linea.trim().length() < 50) {
                datos.put("nombre", linea.trim());
                break;
            }
        }

        return datos;
    }
    
}
