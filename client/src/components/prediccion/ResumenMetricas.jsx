import { ListSvg } from "../icons.jsx";

const obtenerPrediccion = (cargo) => cargo?.prediccion?.[0]?.cantidad_predicha ?? 0;

export default function ResumenMetricas({ cargos = [], totalAnalizados = 0, horizonte }) {
  const principal = cargos[0];
  const crecimiento = Number(principal?.crecimiento_estimado ?? 0);
  const periodo = horizonte
    ? `${horizonte.inicio}-${horizonte.fin}`
    : "—";

  return (
    <section className="prediction-metrics">
      <article className="prediction-metric-card prediction-metric-card--soft">
        <div className="prediction-metric-top">
          <span className="prediction-metric-icon"> 
            <ListSvg name={"maleta"} width={20} height={20}/>
          </span>
          <span className="prediction-chip">{periodo}</span>
        </div>
        <strong>{Number(totalAnalizados).toLocaleString("es-CO")}</strong>
        <p>Total Cargos encontrados</p>
      </article>

      <article className="prediction-metric-card prediction-metric-card--soft">
        <div className="prediction-metric-top">
          <span className="prediction-metric-icon">↗</span>
          <span className="prediction-chip">Top #{principal?.posicion ? principal.posicion : "-"}</span>
        </div>
        <span className="prediction-metric-label">MAYOR DEMANDA</span>
        <h3>{principal?.nombre ?? "Sin resultados"}</h3>
        <p className="prediction-metric-growth">
          ↗ {crecimiento >= 0 ? "+" : ""}{crecimiento.toFixed(2)}% proyectado
        </p>
        {principal && (
          <span className="prediction-metric-sub">
            {obtenerPrediccion(principal).toLocaleString("es-CO")} vacantes estimadas
          </span>
        )}
      </article>
    </section>
  );
}
