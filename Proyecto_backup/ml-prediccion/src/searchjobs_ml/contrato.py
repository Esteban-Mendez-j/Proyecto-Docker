"""Arma los documentos con la forma EXACTA del contrato de la API (los mismos campos que los DTO de Java).

Entradas: catalogo de series, panel mensual, predicciones anuales (todo sale de data/*.csv).
Salida: una lista de dicts (uno por cargo) con solo tipos nativos de Python (int, float, str, list, dict),
aptos para JSON y para MongoDB.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd

SIN_CATEGORIA = "Sin categoria"


def _entero(x) -> int:
    return int(round(float(x)))


def _crecimiento(prediccion: int, ultimo_real: int) -> float:
    return round(100.0 * (prediccion - ultimo_real) / ultimo_real, 2) if ultimo_real > 0 else 0.0


def anuales_completos(panel: pd.DataFrame) -> pd.DataFrame:
    """Suma por anio calendario, solo anios con los 12 meses."""
    grupos = panel.groupby(panel.index.year)
    return grupos.sum()[grupos.size() == 12]


def _periodo_prediccion(pred_anual: pd.DataFrame, ultimo_anio: int) -> int:
    try:
        anio = int(pred_anual["periodo"].iloc[0])
    except (ValueError, TypeError):
        raise ValueError("La prediccion no corresponde a un anio calendario completo: "
                         "usa datos hasta diciembre (ver --corte en preparar_series.py).")
    if anio != ultimo_anio + 1:
        raise ValueError(f"La prediccion es de {anio} pero el ultimo anio completo es {ultimo_anio}.")
    return anio


def construir(catalogo: pd.DataFrame, panel: pd.DataFrame, pred_anual: pd.DataFrame,
              anios_historia: int = 3) -> tuple[list[dict], dict]:
    anuales = anuales_completos(panel)
    pred = pred_anual.set_index("serie_id")
    ultimo_anio = int(anuales.index.max())
    anio_pred = _periodo_prediccion(pred_anual, ultimo_anio)

    def historia(serie_id: str) -> list[dict]:
        return [{"periodo": int(a), "cantidad": int(v)} for a, v in anuales[serie_id].tail(anios_historia).items()]

    def datos_prediccion(serie_id: str):
        p = pred.loc[serie_id]
        cant = _entero(p["prediccion_anual"])
        return cant, min(_entero(p["limite_inferior"]), cant), max(_entero(p["limite_superior"]), cant)

    cat = catalogo[catalogo["nivel"] == "cargo"]
    cargos, ajustados, n_req = [], 0, 0
    for _, c in cat[cat["incluida"]].iterrows():
        sid = c["serie_id"]
        if sid not in pred.index or sid not in anuales.columns:
            continue
        cant, lo, hi = datos_prediccion(sid)
        requisitos = []
        filas = catalogo[(catalogo["cargo_id"] == c["cargo_id"]) & (catalogo["nivel"] == "requisito") & catalogo["incluida"]]
        for _, r in filas.iterrows():
            rid = r["serie_id"]
            if rid not in pred.index or rid not in anuales.columns:
                continue
            rc, rlo, rhi = datos_prediccion(rid)
            if rc > cant:                                  # un requisito no puede superar a su cargo
                rc, ajustados = cant, ajustados + 1
            rhi, rlo = max(min(rhi, hi), rc), min(rlo, rc)
            requisitos.append({
                "id": int(r["requisito_id"]), "nombre": str(r["requisito"]),
                "tipo": SIN_CATEGORIA if pd.isna(r["categoria"]) else str(r["categoria"]),
                "success": True, "motivo_sin_prediccion": "",
                "demanda_historica": historia(rid),
                "prediccion": [{"periodo": anio_pred, "cantidad_predicha": rc,
                                "limite_inferior": rlo, "limite_superior": rhi}],
                "crecimiento_estimado": _crecimiento(rc, int(anuales[rid].iloc[-1]))})
        requisitos.sort(key=lambda x: (-x["prediccion"][0]["cantidad_predicha"], x["id"]))
        n_req += len(requisitos)
        cargos.append({
            "id": int(c["cargo_id"]), "nombre": str(c["cargo"]), "posicion": 0,
            "success": True, "motivo_sin_prediccion": "",
            "demanda_historica": historia(sid),
            "prediccion": [{"periodo": anio_pred, "cantidad_predicha": cant,
                            "limite_inferior": lo, "limite_superior": hi}],
            "crecimiento_estimado": _crecimiento(cant, int(anuales[sid].iloc[-1])),
            "requisitos": requisitos})

    cargos.sort(key=lambda x: (-x["prediccion"][0]["cantidad_predicha"], x["id"]))
    for i, c in enumerate(cargos, start=1):                # posicion 1 = mayor demanda predicha
        c["posicion"] = i

    sin_pred = cat[~cat["incluida"] & (cat["total"] > 0)].sort_values("cargo_id")
    for k, (_, c) in enumerate(sin_pred.iterrows(), start=len(cargos) + 1):
        cargos.append({
            "id": int(c["cargo_id"]), "nombre": str(c["cargo"]), "posicion": k, "success": False,
            "motivo_sin_prediccion": (f"Sin prediccion: {c['motivo_exclusion']} "
                                      f"({int(c['total'])} {'vacante registrada' if int(c['total']) == 1 else 'vacantes registradas'})."),
            "demanda_historica": [], "prediccion": [], "crecimiento_estimado": 0.0, "requisitos": []})

    resumen = {"anio_prediccion": anio_pred, "cargos_ok": len(cargos) - len(sin_pred),
               "cargos_sin_prediccion": len(sin_pred), "requisitos": n_req, "requisitos_ajustados": ajustados}
    return cargos, resumen


def construir_ejecucion(resumen: dict, meta: dict, intervalos: dict | None, backtest: pd.DataFrame | None,
                        inicio: datetime, fin: datetime) -> dict:
    """Metadatos de la corrida (para auditoria y para mostrar 'ultima actualizacion')."""
    metricas = None
    if backtest is not None and not backtest.empty:
        from . import backtest as bt
        g = bt.resumir(backtest, ["modelo"])
        metricas = {m: {k: float(v) for k, v in fila.items()} for m, fila in g.iterrows()}
    eid = fin.strftime("%Y%m%dT%H%M%SZ")
    return {
        "_id": eid, "iniciado_en": inicio, "finalizado_en": fin,
        "horizonte": {"inicio": resumen["anio_prediccion"], "fin": resumen["anio_prediccion"]},
        "datos": {"corte": meta.get("corte"), "primer_mes": meta.get("primer_mes"),
                  "series_incluidas": meta.get("series_incluidas")},
        "modelo": {"tipo": "red_tensorflow", "version": eid},
        "metricas_backtest": metricas, "intervalos_empiricos": intervalos, "resumen": resumen}


def cargar_insumos(carpeta: Path):
    """Lee lo que dejaron preparar_series.py y entrenar_red.py en data/."""
    from . import series
    catalogo = pd.read_csv(carpeta / "series_catalogo.csv")
    pred = pd.read_csv(carpeta / "predicciones_anuales.csv")
    panel = series.cargar_panel(carpeta)
    meta = json.loads((carpeta / "dataset_meta.json").read_text(encoding="utf-8"))
    ruta_i, ruta_b = carpeta / "intervalos_empiricos.json", carpeta / "backtest_comparacion.csv"
    intervalos = json.loads(ruta_i.read_text(encoding="utf-8")) if ruta_i.exists() else None
    backtest = pd.read_csv(ruta_b) if ruta_b.exists() else None
    return catalogo, panel, pred, meta, intervalos, backtest


def respuesta_vista_previa(cargos: list[dict], ejecucion: dict) -> dict:
    """La parte 'data' de la respuesta del contrato (PrediccionResponse), para revisar o alimentar a Flutter."""
    return {"data": {"success": True, "mensaje": "Prediccion generada correctamente",
                     "fecha_generacion": ejecucion["finalizado_en"].isoformat(timespec="seconds"),
                     "horizonte_prediccion": ejecucion["horizonte"], "cargos": cargos}}


def ahora_utc() -> datetime:
    return datetime.now(timezone.utc)