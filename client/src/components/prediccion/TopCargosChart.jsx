import {
  Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const PALETTE = ["#063b9b", "#0757d8", "#3474f5", "#3c59c9", "#aeb8d1"];

const CustomYAxisTick = ({ x, y, payload }) => {
  const palabras = payload.value.split(" ");
  const lineas = [];
  let lineaActual = "";

  palabras.forEach((palabra) => {
    const prueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;

    if (prueba.length > 17 && lineaActual) {
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
      y={y}
      textAnchor="end"
      fill="#34405a"
      fontSize={12}
      fontWeight={600}
    >
      {lineas.map((linea, index) => (
        <tspan
          key={index}
          x={x}
          dy={index === 0 ? (lineas.length > 1 ? -6 : 4) : 14}
        >
          {linea}
        </tspan>
      ))}
    </text>
  );
};

export default function TopCargosChart({ cargos = [] }) {
  const data = cargos.map((cargo) => ({
    id: cargo.id,
    nombre: cargo.nombre,
    cantidad: Number(cargo.prediccion?.[0]?.cantidad_predicha ?? 0),
  })).filter((item) => item.cantidad > 0);

  if (!data.length) return <div className="prediction-empty">No hay datos de demanda para mostrar.</div>;

  return (
    <div className="prediction-top-chart">
      <ResponsiveContainer width="100%" height={Math.max(250, data.length * 68)}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 56, left: 4, bottom: 4 }} barCategoryGap={15}>
          <CartesianGrid horizontal={false} vertical={false} />
          <XAxis type="number" hide domain={[0, "dataMax"]} />
          <YAxis
            type="category"
            dataKey="nombre"
            width={180}
            axisLine={false}
            tickLine={false}
            tick={<CustomYAxisTick />}
          />
          <Tooltip
            cursor={{ fill: "#f2f4ff" }}
            formatter={(value) => [`${Number(value).toLocaleString("es-CO")} vacantes`, "Demanda proyectada"]}
          />
          <Bar dataKey="cantidad" radius={[0, 8, 8, 0]} maxBarSize={18}>
            {data.map((item, index) => (
              <Cell key={item.id} fill={PALETTE[index % PALETTE.length]} />
            ))}
            <LabelList
              dataKey="cantidad"
              position="right"
              formatter={(value) => Number(value).toLocaleString("es-CO")}
              fill="#34405a"
              fontSize={11}
              fontWeight={600}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="prediction-axis-caption">
        <span>0</span><span>Demanda estimada en vacantes</span><span>{Math.max(...data.map((d) => d.cantidad)).toLocaleString("es-CO")}</span>
      </div>
    </div>
  );
}
