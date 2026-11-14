"""Extraccion y preparacion de las series de demanda (una fila por serie y mes).

Serie = demanda mensual de un cargo (requisito_id = 0) o de un requisito dentro de un cargo.
El resultado es un panel: indice = meses (PeriodIndex), columnas = (cargo_id, requisito_id).
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd


def _leer(conn, sql: str, columnas: list[str]) -> pd.DataFrame:
    cur = conn.cursor()
    cur.execute(sql)
    filas = cur.fetchall()
    cur.close()
    return pd.DataFrame(list(filas), columns=columnas)


def extraer_tablas(conn) -> dict:
    """Lee de la base (solo SELECT). Consultas portables: la agregacion se hace en pandas."""
    vac = _leer(conn, "SELECT nvacantes, cargo, fecha_publicacion FROM vacante",
                ["vacante_id", "cargo_id", "fecha"])
    rel = _leer(conn, "SELECT vacante_id, requisito_id FROM vacante_requisito", ["vacante_id", "requisito_id"])
    cargos = _leer(conn, "SELECT id, nombre FROM cargo", ["cargo_id", "cargo"])
    req = _leer(conn, "SELECT r.id, r.nombre, cr.nombre FROM requisito r "
                      "LEFT JOIN categoria_requisito cr ON cr.id = r.id_categoria",
                ["requisito_id", "requisito", "categoria"])
    for df, cols in ((vac, ["vacante_id", "cargo_id"]), (rel, ["vacante_id", "requisito_id"]),
                     (cargos, ["cargo_id"]), (req, ["requisito_id"])):
        for c in cols:
            df[c] = df[c].astype("int64")
    vac["mes"] = pd.to_datetime(vac["fecha"]).dt.to_period("M")
    return {"vac": vac, "rel": rel, "cargos": cargos, "req": req}


def inferir_corte(vac: pd.DataFrame, umbral: float = 0.2) -> pd.Period:
    """Ultimo mes con actividad real: ignora meses sueltos (p. ej. una vacante de prueba)."""
    totales = vac.groupby("mes").size()
    return totales[totales >= umbral * totales.median()].index.max()


def construir_panel(tablas: dict, corte: pd.Period) -> pd.DataFrame:
    vac = tablas["vac"][tablas["vac"]["mes"] <= corte]
    meses = pd.period_range(vac["mes"].min(), corte, freq="M")

    por_cargo = vac.groupby(["cargo_id", "mes"]).size().rename("cantidad").reset_index()
    por_cargo["requisito_id"] = 0

    rr = tablas["rel"].merge(vac[["vacante_id", "cargo_id", "mes"]], on="vacante_id")
    por_req = (rr.groupby(["cargo_id", "requisito_id", "mes"])["vacante_id"].nunique()
                 .rename("cantidad").reset_index())

    largo = pd.concat([por_cargo, por_req], ignore_index=True)
    panel = largo.pivot_table(index="mes", columns=["cargo_id", "requisito_id"], values="cantidad",
                              aggfunc="sum", fill_value=0)
    return panel.reindex(meses, fill_value=0).astype(int)   # los meses sin vacantes cuentan como 0


def seleccionar(panel: pd.DataFrame, tablas: dict, min_total: int = 100, min_meses_activos: int = 24,
                max_series: int = 100, ventana_volumen: int = 36):
    """Filtra series con historia suficiente y limita a las max_series de mayor volumen reciente."""
    cat = pd.DataFrame({
        "cargo_id": [c for c, _ in panel.columns], "requisito_id": [r for _, r in panel.columns],
        "total": panel.sum().values, "volumen_reciente": panel.iloc[-ventana_volumen:].sum().values,
        "meses_activos": (panel > 0).sum().values})
    cat["nivel"] = np.where(cat["requisito_id"] == 0, "cargo", "requisito")
    cat["serie_id"] = [f"c{c}" if r == 0 else f"c{c}-r{r}" for c, r in zip(cat["cargo_id"], cat["requisito_id"])]
    cat["motivo_exclusion"] = ""
    cat.loc[cat["total"] < min_total, "motivo_exclusion"] = f"historial insuficiente (total < {min_total})"
    cat.loc[(cat["motivo_exclusion"] == "") & (cat["meses_activos"] < min_meses_activos),
            "motivo_exclusion"] = f"pocos meses con datos (< {min_meses_activos})"

    aptas = cat[cat["motivo_exclusion"] == ""]
    prioridad = pd.concat([aptas[aptas["nivel"] == "cargo"],
                           aptas[aptas["nivel"] == "requisito"].sort_values("volumen_reciente", ascending=False)])
    fuera = prioridad.index[max_series:]
    cat.loc[fuera, "motivo_exclusion"] = f"fuera del top {max_series} por volumen"
    cat["incluida"] = cat["motivo_exclusion"] == ""

    cat = (cat.merge(tablas["cargos"], on="cargo_id", how="left")
              .merge(tablas["req"], on="requisito_id", how="left"))
    cat["requisito"] = cat["requisito"].fillna("(total del cargo)")
    cat = cat.sort_values(["cargo_id", "requisito_id"]).reset_index(drop=True)

    elegidas = [(int(c), int(r)) for c, r, ok in zip(cat["cargo_id"], cat["requisito_id"], cat["incluida"]) if ok]
    return cat, panel[elegidas]


def guardar(panel: pd.DataFrame, catalogo: pd.DataFrame, carpeta: Path, corte: pd.Period):
    carpeta.mkdir(parents=True, exist_ok=True)
    largo = panel.copy()
    largo.columns = [f"c{c}" if r == 0 else f"c{c}-r{r}" for c, r in panel.columns]
    largo = largo.rename_axis("mes").reset_index().melt(id_vars="mes", var_name="serie_id", value_name="cantidad")
    largo["mes"] = largo["mes"].astype(str)
    largo.to_csv(carpeta / "series_mensuales.csv", index=False)
    catalogo.to_csv(carpeta / "series_catalogo.csv", index=False, encoding="utf-8")
    (carpeta / "dataset_meta.json").write_text(json.dumps({
        "corte": str(corte), "primer_mes": str(panel.index.min()), "meses": int(len(panel)),
        "series_incluidas": int(panel.shape[1]), "series_totales": int(len(catalogo))}, indent=2), encoding="utf-8")


def cargar_panel(carpeta: Path) -> pd.DataFrame:
    largo = pd.read_csv(carpeta / "series_mensuales.csv")
    ancho = largo.pivot(index="mes", columns="serie_id", values="cantidad")
    ancho.index = pd.PeriodIndex(ancho.index, freq="M")
    return ancho.sort_index()
