package com.miproyecto.proyecto.ml;

// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;

// import com.miproyecto.proyecto.ml.service.PrediccionService;

// @Component
// public class TestPrediccion implements CommandLineRunner {

//     private final PrediccionService prediccionService;

//     public TestPrediccion(PrediccionService prediccionService) {
//         this.prediccionService = prediccionService;
//     }

//     @Override
//     public void run(String... args) throws Exception {
//         // Datos predefinidos para probar
//         String NivelEducativo = "Postgrado";
//         int AñosExperiencia = 0 ;
//         String PensamientoCritico = "1";
//         String Creatividad = "1";
//         String AtencionDetalle = "0";
//         String AprendizajeContinuo = "0";
//         String EticaProfesional = "0";
//         String Autonomia = "0";
//         String Responsabilidad = "1";
//         String Liderazgo = "0";
//         String Adaptabilidad = "0";
//         String ResolucionProblemas = "0";
//         String ComunicacionAfectiva = "0";
//         String TrabajoEquipo = "0";
//         int CantidadAptitudes = 3;

//         // Llamar al servicio
//         String resultado = prediccionService.predecir(
//             NivelEducativo, AñosExperiencia, PensamientoCritico, Creatividad,
//             AtencionDetalle, AprendizajeContinuo, EticaProfesional, Autonomia,
//             Responsabilidad, Liderazgo, Adaptabilidad, ResolucionProblemas,
//             ComunicacionAfectiva, TrabajoEquipo, CantidadAptitudes
//         );

//         System.out.println("Resultado de la predicción: " + resultado );
//     }
// }