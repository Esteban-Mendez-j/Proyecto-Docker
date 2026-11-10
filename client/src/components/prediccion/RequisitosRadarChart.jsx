
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const ultimo = (items = []) =>
  items.length ? items[items.length - 1] : null;

export default function RequisitosRadarChart({ cargo }) {
  const requisitos = cargo?.requisitos ?? [];

  // Ordenar y preparar los requisitos reales.
  const dataReal = requisitos.map((req) => {
    const historicoOrdenado = [
      ...(req.demanda_historica ?? []),
    ].sort((a, b) => a.periodo - b.periodo);

    const actual = Number(
      ultimo(historicoOrdenado)?.cantidad ?? 0
    );

    const futuro = Number(
      req.prediccion?.[0]?.cantidad_predicha ?? 0
    );

    return {
      requisito: req.nombre,
      actual,
      futuro,
    };
  });

  // Si no existen requisitos reales, no mostrar el radar.
  if (!cargo || !dataReal.length) {
    return (
      <div className="prediction-empty">
        Este cargo no tiene requisitos con datos suficientes para el radar.
      </div>
    );
  }

  // Obtener la mayor demanda entre los requisitos reales.
  const maximo = Math.max(
    1,
    ...dataReal.flatMap((req) => [
      req.actual,
      req.futuro,
    ])
  );

  // Normalizar los valores reales a una escala de 0 a 100.
  const data = dataReal.map((req) => ({
    ...req,
    actualRelativo: Math.round(
      (req.actual / maximo) * 100
    ),
    futuroRelativo: Math.round(
      (req.futuro / maximo) * 100
    ),
  }));

  // Completar hasta tener tres ejes en el radar.
  while (data.length < 3) {
    data.push({
      requisito: "",
      actual: 0,
      futuro: 0,
      actualRelativo: 0,
      futuroRelativo: 0,
      ficticio: true,
    });
  }

  // Calcular promedios únicamente con requisitos reales.
  const promedioActual = Math.round(
    dataReal.reduce(
      (sum, item) =>
        sum + Math.round((item.actual / maximo) * 100),
      0
    ) / dataReal.length
  );

  const promedioFuturo = Math.round(
    dataReal.reduce(
      (sum, item) =>
        sum + Math.round((item.futuro / maximo) * 100),
      0
    ) / dataReal.length
  );

  return (
    <>
      <div className="prediction-radar-averages">
        <span>
          <i className="legend-line legend-line--actual" />
          Nivel actual <strong>{promedioActual}/100</strong>
        </span>

        <span>
          <i className="legend-line legend-line--future" />
          Demanda proyectada <strong>{promedioFuturo}/100</strong>
        </span>
      </div>

      <div className="prediction-radar-chart">
        <ResponsiveContainer width="100%" height={330}>
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="#cbd3e8" />

            <PolarAngleAxis
              dataKey="requisito"
              tick={{
                fill: "#34405a",
                fontSize: 11,
                fontWeight: 600,
              }}
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />

            <Radar
              name="Nivel actual"
              dataKey="actualRelativo"
              stroke="#8390a7"
              fill="#aab5c8"
              fillOpacity={0.13}
              strokeWidth={2}
              strokeDasharray="4 3"
            />

            <Radar
              name="Demanda proyectada"
              dataKey="futuroRelativo"
              stroke="#2865ed"
              fill="#2865ed"
              fillOpacity={0.2}
              strokeWidth={2.5}
            />

            <Tooltip
              formatter={(value, name, item) => {
                if (item.payload.ficticio) {
                  return null;
                }

                const cantidad =
                  name === "Nivel actual"
                    ? item.payload.actual
                    : item.payload.futuro;

                return [
                  `${value}/100 · ${Number(cantidad).toLocaleString("es-CO")} vacantes`,
                  name,
                ];
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
