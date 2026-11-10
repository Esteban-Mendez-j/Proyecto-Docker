"""Backtest con origen movil: entrena con el pasado y predice los 12 meses siguientes, varias veces."""
from __future__ import annotations

import time

import numpy as np
import pandas as pd


def origenes(panel: pd.DataFrame, folds: int = 3, h: int = 12, historia_minima: int = 36):
    ultimo = panel.index.max()
    salida = [ultimo - h * k for k in range(folds, 0, -1)]
    return [o for o in salida if len(panel.loc[:o]) >= historia_minima]


def evaluar(panel: pd.DataFrame, modelos: dict, folds: int = 3, h: int = 12) -> pd.DataFrame:
    filas = []
    for origen in origenes(panel, folds, h):
        entrena, prueba = panel.loc[:origen], panel.loc[origen + 1: origen + h]
        if len(prueba) < h:
            continue
        for col in panel.columns:
            real = prueba[col].to_numpy(float)
            for nombre, f in modelos.items():
                pred = f(entrena[col].to_numpy(float), entrena.index.month.to_numpy(), prueba.index.month.to_numpy())
                filas.append({"serie_id": col, "origen": str(origen), "modelo": nombre,
                              "real_anual": real.sum(), "pred_anual": float(np.sum(pred)),
                              "error_abs_mensual": float(np.abs(real - pred).sum())})
    return pd.DataFrame(filas)


def evaluar_global(panel: pd.DataFrame, fabrica, nombre: str, folds: int = 3, h: int = 12,
                   historia_minima: int = 36):
    """Igual que evaluar(), pero para modelos GLOBALES (una red para todas las series).

    fabrica() debe devolver un objeto con fit(panel_entrenamiento) y predecir(panel_entrenamiento, meses_h) -> (h, S).
    Devuelve (resultados, tiempos de entrenamiento por origen).
    """
    filas, tiempos = [], []
    for origen in origenes(panel, folds, h, historia_minima):
        entrena, prueba = panel.loc[:origen], panel.loc[origen + 1: origen + h]
        if len(prueba) < h:
            continue
        modelo = fabrica()
        t0 = time.time()
        modelo.fit(entrena)
        tiempos.append({"modelo": nombre, "origen": str(origen), "segundos_entrenamiento": time.time() - t0})
        pred = np.asarray(modelo.predecir(entrena, prueba.index.month.to_numpy()), dtype=float)
        for j, col in enumerate(panel.columns):
            real = prueba[col].to_numpy(float)
            filas.append({"serie_id": col, "origen": str(origen), "modelo": nombre,
                          "real_anual": real.sum(), "pred_anual": float(pred[:, j].sum()),
                          "error_abs_mensual": float(np.abs(real - pred[:, j]).sum())})
    return pd.DataFrame(filas), pd.DataFrame(tiempos)


def resumir(res: pd.DataFrame, por: list[str]) -> pd.DataFrame:
    def metricas(g):
        return pd.Series({
            "WAPE_mensual_%": 100 * g["error_abs_mensual"].sum() / g["real_anual"].sum(),
            "error_anual_medio_%": 100 * (abs(g["pred_anual"] - g["real_anual"]) / g["real_anual"].clip(lower=1)).mean(),
            "sesgo_anual_%": 100 * (g["pred_anual"].sum() / g["real_anual"].sum() - 1)})
    return res.groupby(por).apply(metricas, include_groups=False).round(1)