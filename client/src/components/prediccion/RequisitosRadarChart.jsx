import {
  PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip,
} from "recharts";

const ultimo = (items = []) => items.length ? items[items.length - 1] : null;

export default function RequisitosRadarChart({ cargo }) {
  const requisitos = cargo?.requisitos ?? [];

  // El endpoint entrega cantidades absolutas, no porcentajes. Se normalizan contra
  // el requisito de mayor demanda del mismo cargo para construir una escala relativa 0–100.
  const maximo = Math.max(
    1,
    ...requisitos.flatMap((req) => [
      Number(ultimo(req.demanda_historica ? [...req.demanda_historica].sort((a, b) => a.periodo - b.periodo) : [])?.cantidad ?? 0),
      Number(req.prediccion?.[0]?.cantidad_predicha ?? 0),
    ])
  );

  const data = requisitos.map((req) => {
    const historicoOrdenado = [...(req.demanda_historica ?? [])].sort((a, b) => a.periodo - b.periodo);
    const actual = Number(ultimo(historicoOrdenado)?.cantidad ?? 0);
    const futuro = Number(req.prediccion?.[0]?.cantidad_predicha ?? 0);
    return {
      requisito: req.nombre,
      actual,
      futuro,
      actualRelativo: Math.round((actual / maximo) * 100),
      futuroRelativo: Math.round((futuro / maximo) * 100),
    };
  });

  if (!cargo || !data.length) {
    return <div className="prediction-empty">Este cargo no tiene requisitos con datos suficientes para el radar.</div>;
  }

  const promedioActual = Math.round(data.reduce((sum, item) => sum + item.actualRelativo, 0) / data.length);
  const promedioFuturo = Math.round(data.reduce((sum, item) => sum + item.futuroRelativo, 0) / data.length);

  return (
    <>
      <div className="prediction-radar-averages">
        <span><i className="legend-line legend-line--actual" /> Nivel actual <strong>{promedioActual}/100</strong></span>
        <span><i className="legend-line legend-line--future" /> Demanda proyectada <strong>{promedioFuturo}/100</strong></span>
      </div>
      <div className="prediction-radar-chart">
        <ResponsiveContainer width="100%" height={330}>
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="#cbd3e8" />
            <PolarAngleAxis dataKey="requisito" tick={{ fill: "#34405a", fontSize: 11, fontWeight: 600 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
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
                const cantidad = name === "Nivel actual" ? item.payload.actual : item.payload.futuro;
                return [`${value}/100 · ${Number(cantidad).toLocaleString("es-CO")} vacantes`, name];
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="prediction-radar-note">
        Escala relativa: 100 representa el requisito con mayor demanda dentro de este cargo.
        Las cantidades originales se consultan al pasar sobre cada eje.
      </p>
    </>
  );
}
