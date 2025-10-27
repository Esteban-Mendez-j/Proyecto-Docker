import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch.jsx";
import Loading from "./Loading";

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
          {resultadoPrediccion === "1.0" ? (
            <span className="text-green-600 font-medium">Tu Perfil es adecuado para esta vacante!</span>
          ) : (
            <span className="text-red-600 font-medium"> tu perfil no cumple con los requisitos</span>
          )}
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