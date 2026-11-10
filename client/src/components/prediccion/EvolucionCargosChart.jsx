
import { useEffect, useState } from "react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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

export default function EvolucionCargosChart({
  cargos = [],
  horizonte,
}) {
  // Identificadores de los cargos disponibles.
  const idsDisponibles = cargos.map((cargo) => String(cargo.id));
  const idsKey = idsDisponibles.join("|");

  // Inicialmente todos los cargos aparecen seleccionados.
  const [seleccionados, setSeleccionados] = useState(
    () => idsDisponibles
  );

  // Si cambia la lista de cargos recibida desde el padre,
  // se seleccionan los nuevos cargos disponibles.
  useEffect(() => {
    setSeleccionados(idsDisponibles);
  }, [idsKey]);

  // Alternar la selección de un cargo.
  const toggleCargo = (id) => {
    setSeleccionados((actuales) =>
      actuales.includes(id)
        ? actuales.filter((item) => item !== id)
        : [...actuales, id]
    );
  };

  // Solo se utilizan los cargos seleccionados para construir la gráfica.
  const cargosSeleccionados = cargos.filter((cargo) =>
    seleccionados.includes(String(cargo.id))
  );

  // Obtener los periodos de los cargos seleccionados.
  const periodos = [
    ...new Set(
      cargosSeleccionados.flatMap((cargo) => [
        ...(cargo.demanda_historica ?? []).map(
          (item) => item.periodo
        ),
        ...(cargo.prediccion ?? []).map(
          (item) => item.periodo
        ),
      ])
    ),
  ].sort((a, b) => a - b);

  // Construir los datos de la gráfica.
  const data = periodos.map((periodo) => {
    const row = { periodo: String(periodo) };

    cargosSeleccionados.forEach((cargo) => {
      const historico = cargo.demanda_historica?.find(
        (item) => item.periodo === periodo
      );

      const predicho = cargo.prediccion?.find(
        (item) => item.periodo === periodo
      );

      row[`h_${cargo.id}`] = historico?.cantidad ?? null;
      row[`p_${cargo.id}`] =
        predicho?.cantidad_predicha ?? null;

      // La proyección parte del último dato histórico
      // para conectar visualmente ambos tramos.
      const periodosHistoricos = (
        cargo.demanda_historica ?? []
      ).map((item) => item.periodo);

      const ultimoPeriodoHistorico = periodosHistoricos.length
        ? Math.max(...periodosHistoricos)
        : null;

      if (periodo === ultimoPeriodoHistorico) {
        row[`p_${cargo.id}`] = historico?.cantidad ?? null;
      }
    });

    return row;
  });

  if (!cargos.length) {
    return (
      <div className="prediction-empty">
        No hay suficientes cargos para construir la evolución.
      </div>
    );
  }

  // Calcular el crecimiento promedio únicamente de los seleccionados.
  const promedioCrecimiento = cargosSeleccionados.length
    ? (
        cargosSeleccionados.reduce(
          (sum, cargo) =>
            sum + Number(cargo.crecimiento_estimado ?? 0),
          0
        ) / cargosSeleccionados.length
      ).toFixed(2)
    : null;

  const inicioProyeccion = String(
    horizonte?.inicio ?? ((periodos.at(-1) ?? 0) + 1)
  );

  return (
    <>
      <div className="prediction-evolution-summary">
        <div>
          <span>Crecimiento estimado promedio</span>
          <strong>
            {promedioCrecimiento !== null
              ? `${promedioCrecimiento}%`
              : "—"}
          </strong>
        </div>

        <div>
          <span>Cargo destacado</span>
          <strong>
            {cargosSeleccionados[0]?.nombre ?? "—"}
          </strong>
        </div>
      </div>

      <div className="prediction-evolution-chart">
        {cargosSeleccionados.length > 0 && periodos.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{
                top: 14,
                right: 10,
                left: -12,
                bottom: 4,
              }}
            >
              <CartesianGrid
                stroke="#e9ecfa"
                strokeDasharray="2 4"
                vertical={false}
              />

              <XAxis
                dataKey="periodo"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#657087",
                  fontSize: 12,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#8790a5",
                  fontSize: 10,
                }}
              />

              <Tooltip
                content={
                  <CustomTooltip
                    cargos={cargosSeleccionados}
                  />
                }
              />

              <ReferenceLine
                x={inicioProyeccion}
                stroke="#2865ed"
                strokeDasharray="4 4"
              />

              {/* Líneas históricas */}
              {cargosSeleccionados.map((cargo) => {
                const index = cargos.findIndex(
                  (c) => String(c.id) === String(cargo.id)
                );

                return (
                  <Line
                    key={`hist-${cargo.id}`}
                    type="monotone"
                    dataKey={`h_${cargo.id}`}
                    name={cargo.nombre}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2.2}
                    dot={{
                      r: 3,
                      fill: "#fff",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                );
              })}

              {/* Líneas de proyección */}
              {cargosSeleccionados.map((cargo) => {
                const index = cargos.findIndex(
                  (c) => String(c.id) === String(cargo.id)
                );

                return (
                  <Line
                    key={`pred-${cargo.id}`}
                    type="monotone"
                    dataKey={`p_${cargo.id}`}
                    name={`${cargo.nombre} (proyección)`}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2.2}
                    strokeDasharray="5 4"
                    dot={{
                      r: 3,
                      fill: "#fff",
                      strokeWidth: 2,
                    }}
                    connectNulls
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="prediction-empty">
            Selecciona al menos un cargo para visualizar su evolución.
          </div>
        )}
      </div>

      {/* Selectores de cargos */}
      <div className="prediction-series-selector">
        {cargos.map((cargo, index) => {
          const id = String(cargo.id);
          const seleccionado = seleccionados.includes(id);
          const color = COLORS[index % COLORS.length];

          return (
            <label
              key={id}
              className={`prediction-series-selector__item ${seleccionado ? "prediction-series-selector__item--active" : ""
                }`}
            >
              <input
                type="checkbox"
                checked={seleccionado}
                onChange={() => toggleCargo(id)}
              />

              <span
                className="prediction-series-selector__checkbox"
                style={{ "--cargo-color": color }}
              >
                {seleccionado && <span>✓</span>}
              </span>

              <span
                className="prediction-series-selector__color"
                style={{ backgroundColor: color }}
              />

              <span className="prediction-series-selector__name">
                {cargo.nombre}
              </span>
            </label>
          );
        })}
      </div>
    </>
  );
}
