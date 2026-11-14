
import { useEffect, useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomXAxisTick = ({ x, y, payload }) => {
  const palabras = payload.value.split(" ");
  const lineas = [];
  let lineaActual = "";

  palabras.forEach((palabra) => {
    const prueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;

    if (prueba.length > 12 && lineaActual) {
      lineas.push(lineaActual);
      lineaActual = palabra;
    } else {
      lineaActual = prueba;
    }
  });

  if (lineaActual) lineas.push(lineaActual);

  return (
    <text
      x={x}
      y={y + 5}
      textAnchor="middle"
      fill="#59647c"
      fontSize={10}
    >
      {lineas.map((linea, index) => (
        <tspan
          key={index}
          x={x}
          dy={index === 0 ? 0 : 12}
        >
          {linea}
        </tspan>
      ))}
    </text>
  );
};

const numero = (value) => Number(value ?? 0);

export default function DemandaComparativaChart({ cargos = [] }) {
  const [esMovil, setEsMovil] = useState(
    window.innerWidth <= 600
  );

  useEffect(() => {
    const actualizarPantalla = () => {
      setEsMovil(window.innerWidth <= 600);
    };

    window.addEventListener("resize", actualizarPantalla);

    return () => {
      window.removeEventListener("resize", actualizarPantalla);
    };
  }, []);

  const data = cargos.map((cargo) => ({
    nombre: cargo.nombre,
    actual: numero(cargo.demanda_historica?.at(-1)?.cantidad),
    futura: numero(cargo.prediccion?.[0]?.cantidad_predicha),
  })).filter((item) => item.actual || item.futura);

  if (!data.length) {
    return (
      <div className="prediction-empty">
        No hay información comparativa disponible.
      </div>
    );
  }

  return (
    <div className="prediction-comparison-chart">
      <div className="prediction-chart-legend">
        <span>
          <i className="legend-dot legend-dot--actual" />
          Demanda actual
        </span>
        <span>
          <i className="legend-dot legend-dot--future" />
          Demanda proyectada
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 12, right: 12, left: 8, bottom: 55 }}
          barGap={4}
          barCategoryGap="20%"
        >
          <CartesianGrid
            stroke="#e8ebfa"
            strokeDasharray="2 4"
            vertical={false}
          />

          <XAxis
            dataKey="nombre"
            axisLine={false}
            tickLine={false}
            interval={0}
            height={esMovil ? 10 : 65}
            tick={esMovil ? false : <CustomXAxisTick />}
            tickMargin={8}
          />

          <YAxis
            width={42}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8790a5", fontSize: 10 }}
            tickFormatter={(value) =>
              value >= 1000
                ? `${(value / 1000).toFixed(1)}k`
                : value
            }
          />

          <Tooltip
            labelFormatter={(label, payload) =>
              payload?.[0]?.payload?.nombre ?? label
            }
            formatter={(value, name) => [
              `${numero(value).toLocaleString("es-CO")} vacantes`,
              name === "actual" ? "Actual" : "Predicción",
            ]}
          />

          <Bar
            dataKey="actual"
            name="actual"
            fill="#98a5b9"
            radius={[3, 3, 0, 0]}
            maxBarSize={18}
          />

          <Bar
            dataKey="futura"
            name="futura"
            fill="#2865ed"
            radius={[3, 3, 0, 0]}
            maxBarSize={18}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="prediction-chart-footnote">
        <span>↗ Comparación por cargo</span>
        <strong>
          {data.reduce((sum, item) => sum + item.futura, 0)
            .toLocaleString("es-CO")} vacantes proyectadas en el top {data.length}
        </strong>
      </div>
    </div>
  );
}
