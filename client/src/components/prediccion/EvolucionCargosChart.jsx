import {
  CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const COLORS = ["#1749b8", "#0798d5", "#2868f2", "#786bff", "#7e91a8"];

function CustomTooltip({ active, payload, label, cargos }) {
  if (!active || !payload?.length) return null;

  const datosPorCargo = new Map();

  payload.forEach((item) => {
    if (item.value == null) return;

    const tipo = item.dataKey.substring(0, 2);
    const idCargo = item.dataKey.substring(2);

    const cargo = cargos.find((c) => String(c.id) === idCargo);
    if (!cargo) return;

    const actual = datosPorCargo.get(idCargo);

    if (!actual || tipo === "h_") {
      datosPorCargo.set(idCargo, {
        nombre: cargo.nombre,
        valor: item.value,
        color: item.color || item.stroke,
      });
    }
  });

  return (
    <div
      className="prediction-custom-tooltip"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #dce2ed",
        borderRadius: "10px",
        padding: "12px 14px",
        boxShadow: "0 4px 15px rgba(30, 50, 100, 0.15)",
        minWidth: "190px",
        opacity: 1,
      }}
    >
      <p className="prediction-custom-tooltip__title">
        Periodo {label}
      </p>

      {[...datosPorCargo.entries()].map(([id, dato]) => (
        <div className="prediction-custom-tooltip__item" key={id}>
          <span
            className="prediction-custom-tooltip__dot"
            style={{
              backgroundColor: dato.color,
              border: `1px solid ${dato.color}`,
            }}
          />

          <div className="prediction-custom-tooltip__info">
            <strong>{dato.nombre}</strong>
            <span>
              {Number(dato.valor).toLocaleString("es-CO")} vacantes
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EvolucionCargosChart({ cargos = [], horizonte }) {
  const periodos = [...new Set(cargos.flatMap((cargo) => [
    ...(cargo.demanda_historica ?? []).map((item) => item.periodo),
    ...(cargo.prediccion ?? []).map((item) => item.periodo),
  ]))].sort((a, b) => a - b);

  const data = periodos.map((periodo) => {
    const row = { periodo: String(periodo) };
    cargos.forEach((cargo) => {
      const historico = cargo.demanda_historica?.find((item) => item.periodo === periodo);
      const predicho = cargo.prediccion?.find((item) => item.periodo === periodo);
      row[`h_${cargo.id}`] = historico?.cantidad ?? null;
      row[`p_${cargo.id}`] = predicho?.cantidad_predicha ?? null;
      // La proyección parte del último dato histórico para conectar visualmente ambos tramos.
      if (periodo === Math.max(...(cargo.demanda_historica ?? []).map((item) => item.periodo))) {
        row[`p_${cargo.id}`] = historico?.cantidad ?? null;
      }
    });
    return row;
  });

  if (!cargos.length || !periodos.length) {
    return <div className="prediction-empty">No hay suficientes periodos para construir la evolución.</div>;
  }

  const inicioProyeccion = String(horizonte?.inicio ?? (periodos.at(-1) + 1));

  return (
    <>
      <div className="prediction-evolution-summary">
        <div>
          <span>Crecimiento estimado promedio</span>
          <strong>
            {(
              cargos.reduce((sum, cargo) => sum + Number(cargo.crecimiento_estimado ?? 0), 0) /
              Math.max(cargos.length, 1)
            ).toFixed(2)}%
          </strong>
        </div>
        <div>
          <span>Cargo destacado</span>
          <strong>{cargos[0]?.nombre ?? "—"}</strong>
        </div>
      </div>

      <div className="prediction-evolution-chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 14, right: 10, left: -12, bottom: 4 }}>
            <CartesianGrid stroke="#e9ecfa" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="periodo" axisLine={false} tickLine={false} tick={{ fill: "#657087", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8790a5", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip cargos={cargos} />} />
            <ReferenceLine x={inicioProyeccion} stroke="#2865ed" strokeDasharray="4 4" />
            {cargos.map((cargo, index) => (
              <Line
                key={`hist-${cargo.id}`}
                type="monotone"
                dataKey={`h_${cargo.id}`}
                name={cargo.nombre}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2.2}
                dot={{ r: 3, fill: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            ))}
            {cargos.map((cargo, index) => (
              <Line
                key={`pred-${cargo.id}`}
                type="monotone"
                dataKey={`p_${cargo.id}`}
                name={`${cargo.nombre} (proyección)`}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2.2}
                strokeDasharray="5 4"
                dot={{ r: 3, fill: "#fff", strokeWidth: 2 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="prediction-series-legend">
        {cargos.map((cargo, index) => (
          <span key={cargo.id}>
            <i style={{ background: COLORS[index % COLORS.length] }} />
            {cargo.nombre}
          </span>
        ))}
        <span className="prediction-series-legend__projection"><i /> Proyección</span>
      </div>
    </>
  );
}
