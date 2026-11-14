"""Modelos de referencia (baselines). La red neuronal debe superarlos para justificarse.

Todos reciben: y (conteos mensuales hasta el origen), m_y (mes calendario 1-12 de cada punto de y)
y m_h (mes calendario de cada mes a predecir). Devuelven un arreglo de len(m_h) predicciones.
"""
from __future__ import annotations

import numpy as np


def naive_estacional(y, m_y, m_h):
    """Repite los ultimos 12 meses: 'el proximo ano sera igual al anterior'."""
    return np.resize(np.asarray(y[-12:], dtype=float), len(m_h))


def naive_crecimiento(y, m_y, m_h):
    """Ultimos 12 meses multiplicados por el crecimiento interanual mas reciente (acotado a 0.5x-2x)."""
    ultimo, previo = float(np.sum(y[-12:])), float(np.sum(y[-24:-12]))
    g = np.clip(ultimo / previo, 0.5, 2.0) if previo > 0 else 1.0
    return np.resize(np.asarray(y[-12:], dtype=float), len(m_h)) * g


def log_lineal_estacional(y, m_y, m_h, ventana: int = 36):
    """Regresion sobre log(1+y) con tendencia lineal y un efecto por mes del ano (ultimos 36 meses)."""
    y, m_y = np.asarray(y[-ventana:], dtype=float), np.asarray(m_y[-ventana:])

    def diseno(t, meses):
        return np.column_stack([np.ones(len(t)), t] + [(meses == k).astype(float) for k in range(2, 13)])

    beta, *_ = np.linalg.lstsq(diseno(np.arange(len(y)), m_y), np.log1p(y), rcond=None)
    pred = np.expm1(diseno(np.arange(len(y), len(y) + len(m_h)), np.asarray(m_h)) @ beta)
    return np.clip(pred, 0, None)


BASELINES = {
    "naive_estacional": naive_estacional,
    "naive_crecimiento": naive_crecimiento,
    "log_lineal_estacional": log_lineal_estacional,
}
