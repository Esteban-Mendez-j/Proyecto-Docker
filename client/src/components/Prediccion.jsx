import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch.jsx";
import Loading from "./Loading.jsx";

export default function Prediccion({ id }) {
  const [prediccion, setPrediccion] = useState(null);
  const { data, loading } = useFetch(`/api/prediccion/evaluar/${id}`, "GET");

  useEffect(() => {
    if (!data) return;
    setPrediccion(data);
  }, [data]);

  if (loading) return <Loading />;

  if (!prediccion)
    return (
      <div className="p-6 text-center text-gray-500">
        No hay datos de predicción disponibles.
      </div>
    );

  // 🔹 Desestructurar datos del backend
  const {
    resultadoPrediccion,
    cantidadCoincidencias,
    totalAptitudes,
    porcentajeMatch,
  } = prediccion;

  // 🔹 Color dinámico del porcentaje
  const getColor = (value) => {
    if (value >= 90) return "text-green-500";
    if (value >= 70) return "text-yellow-500";
    if (value >= 40) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="sticky top-24 p-6 border rounded-2xl shadow-lg border-blue-300
                    bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-xl
                    relative overflow-hidden transition-all duration-300 
                    hover:shadow-blue-300/50 hover:scale-[1.02]">

      {/* Efecto brilloso */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-30 pointer-events-none"></div>

      <h2 className="text-xl font-bold text-blue-700 mb-3 text-center">
        Predicción de Candidato
      </h2>

      <div className="space-y-2 text-gray-800">
        <p>
          <span className="font-semibold">Resultado:</span>{" "}
          {(() => {
            // ✅ Caso 1: Alta coincidencia y predicción positiva
            if (resultadoPrediccion === "1.0" && porcentajeMatch >= 70) {
              return (
                <span className="text-green-600 font-medium">
                  ¡Excelente! Tu perfil encaja muy bien con esta vacante. 🌟
                </span>
              );
            }

            // ✅ Caso 2: Predicción positiva pero coincidencia media
            if (resultadoPrediccion === "1.0" && porcentajeMatch < 70) {
              return (
                <span className="text-blue-600 font-medium">
                  ¡Buen trabajo! Cumples con la mayor parte de requisitos de esta vacante!
                </span>
              );
            }
            if (resultadoPrediccion === "0.0" && porcentajeMatch >= 70) {
              return (
                <span className="text-orange-600 font-medium">
                  ¡Buen trabajo! Cumples con varios requisitos.
                </span>
              );
            }

            // ⚠️ Caso 3: Predicción negativa pero coincidencia decente
            if (resultadoPrediccion === "0.0" && porcentajeMatch >= 50) {
              return (
                <span className="text-yellow-600 font-medium">
                   Al parecer estás muy cerca del perfil ideal para esta vacante! 
                </span>
              );
            }

            // ❌ Caso 4: Baja coincidencia y predicción negativa
            return (
              <span className="text-red-600 font-medium">
                Al parecer no cumples con las aptitudes requeridas pero buena suerte! 🚀
              </span>
            );
          })()}
        </p>

        <p>
          <span className="font-semibold">Coincidencias:</span>{" "}
          {cantidadCoincidencias}/{totalAptitudes}
        </p>

        <p className="flex items-center gap-1">
          <span className="font-semibold">Porcentaje Match:</span>{" "}
          <span className={`font-bold text-lg ${getColor(porcentajeMatch)}`}>
            {porcentajeMatch}%
          </span>
        </p>
      </div>

      {/* Línea decorativa */}
      <div className="mt-4 h-1 bg-gradient-to-r from-blue-300 via-cyan-400 to-blue-300 rounded-full animate-pulse"></div>
    </div>
  );
}