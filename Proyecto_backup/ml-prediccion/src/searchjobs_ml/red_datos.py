"""Preparacion de datos para la red neuronal (numpy puro, sin TensorFlow).

Idea: cada muestra es "los ultimos L meses de UNA serie" y el objetivo son los h meses siguientes.
Para que un solo modelo sirva a series de tamanos muy distintos, todo se expresa en escala relativa:
    nivel = promedio de log(1 + demanda) de los ultimos 12 meses de la ventana
    entrada  = log(1 + ventana) - nivel
    objetivo = log(1 + siguientes h meses) - nivel
Asi la red aprende la FORMA (tendencia y estacionalidad), no el tamano. Se revierte con a_conteos().
"""
from __future__ import annotations

import numpy as np
import pandas as pd

H = 12


def parsear_serie(serie_id) -> tuple[int, int]:
    """'c127' -> (127, 0)   'c127-r33' -> (127, 33)   (tuplas (cargo, requisito) se devuelven tal cual)."""
    if isinstance(serie_id, tuple):
        return int(serie_id[0]), int(serie_id[1])
    texto = str(serie_id)
    cargo, _, req = texto[1:].partition("-r")
    return int(cargo), int(req) if req else 0


def mapas_ids(columnas) -> dict:
    """Indices consecutivos para los embeddings. El requisito 0 significa 'total del cargo'."""
    pares = [parsear_serie(c) for c in columnas]
    return {"cargo": {c: i for i, c in enumerate(sorted({c for c, _ in pares}))},
            "req": {r: i for i, r in enumerate(sorted({r for _, r in pares}))}}


def _mes_sen_cos(mes_fin) -> np.ndarray:
    ang = 2 * np.pi * np.asarray(mes_fin, dtype=float) / 12
    return np.column_stack([np.sin(ang), np.cos(ang)])


def _ids_por_serie(panel, mapas):
    pares = [parsear_serie(c) for c in panel.columns]
    return (np.array([mapas["cargo"][c] for c, _ in pares], dtype="int32"),
            np.array([mapas["req"][r] for _, r in pares], dtype="int32"))


def construir_ventanas(panel: pd.DataFrame, mapas: dict, L: int = 24, h: int = H) -> dict:
    """Todas las ventanas posibles cuyo objetivo cae por completo dentro del panel (sin mirar el futuro)."""
    T, S = panel.shape
    if T < L + h:
        raise ValueError(f"Historia insuficiente: hay {T} meses y se necesitan al menos {L + h}.")
    logp = np.log1p(panel.to_numpy(float))
    meses = panel.index.month.to_numpy()
    cargo_s, req_s = _ids_por_serie(panel, mapas)
    fines = np.arange(L - 1, T - h)

    ventana, y, nivel, fin, mes, cargo, req = [], [], [], [], [], [], []
    for s in range(S):
        for e in fines:
            w = logp[e - L + 1: e + 1, s]
            n = w[-12:].mean()
            ventana.append(w - n)
            y.append(logp[e + 1: e + 1 + h, s] - n)
            nivel.append(n)
            fin.append(e)
            mes.append(meses[e])
            cargo.append(cargo_s[s])
            req.append(req_s[s])
    return {"ventana": np.array(ventana), "y": np.array(y), "nivel": np.array(nivel), "fin": np.array(fin),
            "mes": _mes_sen_cos(mes), "cargo": np.array(cargo, dtype="int32")[:, None],
            "requisito": np.array(req, dtype="int32")[:, None]}


def entrada_prediccion(panel: pd.DataFrame, mapas: dict, L: int = 24) -> dict:
    """La ultima ventana de cada serie: desde ahi se predicen los h meses siguientes al ultimo dato."""
    T, S = panel.shape
    if T < L:
        raise ValueError(f"Historia insuficiente: hay {T} meses y se necesitan al menos {L}.")
    logp = np.log1p(panel.to_numpy(float))
    cargo_s, req_s = _ids_por_serie(panel, mapas)
    w = logp[T - L:, :].T                                   # (S, L)
    nivel = w[:, -12:].mean(axis=1)
    return {"ventana": w - nivel[:, None], "nivel": nivel,
            "mes": _mes_sen_cos(np.full(S, panel.index.month[-1])),
            "cargo": cargo_s[:, None], "requisito": req_s[:, None]}


def a_conteos(relativo: np.ndarray, nivel: np.ndarray) -> np.ndarray:
    """Revierte la escala relativa: vuelve a vacantes por mes (nunca negativas)."""
    return np.clip(np.expm1(np.asarray(relativo) + np.asarray(nivel)[:, None]), 0, None)