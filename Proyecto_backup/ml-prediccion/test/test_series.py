"""Pruebas de la fase C. Usan la misma base SQLite simulada que test_sembrar_datos.py.

Ejecutar desde ml-prediccion/:  pytest tests -q
"""
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

import test_sembrar_datos as ts  # noqa: E402
from searchjobs_ml import backtest, series  # noqa: E402
from searchjobs_ml.baselines import BASELINES, log_lineal_estacional, naive_estacional  # noqa: E402

sd = ts.sd


def base_sembrada(monkeypatch, tmp_path, fin=(2026, 12)):
    monkeypatch.setattr(sd, "RUTA_PLAN", tmp_path / "plan.csv")
    monkeypatch.setattr(sd, "FIN", fin)
    repo = ts.crear_base()
    sd.sembrar(repo, 42, 150, aplicar=True, confirmar_nombre=None, manifiesto=tmp_path / "m.json")
    return repo


def test_corte_ignora_meses_sueltos():
    repo = ts.crear_base()                       # 3700 planas hasta 2024 + 1 vacante suelta en 2025-03
    tablas = series.extraer_tablas(repo.conn)
    assert str(series.inferir_corte(tablas["vac"])) == "2024-12"


def test_panel_completo_y_seleccion(monkeypatch, tmp_path):
    repo = base_sembrada(monkeypatch, tmp_path)
    tablas = series.extraer_tablas(repo.conn)
    corte = series.inferir_corte(tablas["vac"])
    assert str(corte) == "2026-12"
    panel = series.construir_panel(tablas, corte)
    assert len(panel) == 84 and panel.index.is_monotonic_increasing          # 2020-01..2026-12 sin huecos
    assert (panel.diff().index == pd.period_range("2020-01", "2026-12", freq="M")).all()
    catalogo, elegidas = series.seleccionar(panel, tablas, max_series=100)
    enf = catalogo[catalogo.cargo_id == 394]
    assert not enf["incluida"].any() and enf["motivo_exclusion"].str.contains("insuficiente").all()
    assert elegidas.shape[1] <= 100 and (elegidas.columns.get_level_values(1) == 0).sum() == 10
    # la serie del cargo es el total mensual de vacantes de ese cargo
    esperado = repo.consultar("SELECT COUNT(*) FROM vacante WHERE cargo = 127")[0][0]
    assert int(panel[(127, 0)].sum()) == esperado
    # un requisito nunca supera a su cargo en ningun mes
    for (c, r) in elegidas.columns:
        if r != 0:
            assert (panel[(c, r)] <= panel[(c, 0)]).all()


def test_max_series_limita_y_prioriza_cargos(monkeypatch, tmp_path):
    repo = base_sembrada(monkeypatch, tmp_path)
    tablas = series.extraer_tablas(repo.conn)
    panel = series.construir_panel(tablas, series.inferir_corte(tablas["vac"]))
    catalogo, elegidas = series.seleccionar(panel, tablas, max_series=15)
    assert elegidas.shape[1] == 15 and (elegidas.columns.get_level_values(1) == 0).sum() == 10
    assert catalogo["motivo_exclusion"].str.contains("top 15").any()


def test_guardar_y_cargar_ida_y_vuelta(monkeypatch, tmp_path):
    repo = base_sembrada(monkeypatch, tmp_path)
    tablas = series.extraer_tablas(repo.conn)
    corte = series.inferir_corte(tablas["vac"])
    panel = series.construir_panel(tablas, corte)
    catalogo, elegidas = series.seleccionar(panel, tablas)
    series.guardar(elegidas, catalogo, tmp_path / "data", corte)
    leido = series.cargar_panel(tmp_path / "data")
    assert leido.shape == elegidas.shape and int(leido.to_numpy().sum()) == int(elegidas.to_numpy().sum())


def test_baselines_formas_y_recuperacion_de_patron():
    meses = np.tile(np.arange(1, 13), 5)                       # 60 meses
    estacion = 1 + 0.4 * np.sin(2 * np.pi * (meses - 1) / 12)
    y = np.round(30 * (1.01 ** np.arange(60)) * estacion)      # tendencia + estacionalidad sin ruido
    m_h = np.arange(1, 13)
    real = np.round(30 * (1.01 ** np.arange(60, 72)) * (1 + 0.4 * np.sin(2 * np.pi * (m_h - 1) / 12)))
    assert naive_estacional(y, meses, m_h).shape == (12,)
    err_log = np.abs(log_lineal_estacional(y, meses, m_h) - real).sum() / real.sum()
    err_naive = np.abs(naive_estacional(y, meses, m_h) - real).sum() / real.sum()
    assert err_log < 0.06 and err_log < err_naive


def test_backtest_corre_y_la_tendencia_se_nota(monkeypatch, tmp_path):
    repo = base_sembrada(monkeypatch, tmp_path)
    tablas = series.extraer_tablas(repo.conn)
    panel = series.construir_panel(tablas, series.inferir_corte(tablas["vac"]))
    _, elegidas = series.seleccionar(panel, tablas)
    res = backtest.evaluar(elegidas, BASELINES, folds=3)
    assert res["origen"].nunique() == 3 and set(res["modelo"]) == set(BASELINES)
    assert np.isfinite(res[["real_anual", "pred_anual", "error_abs_mensual"]].to_numpy()).all()
    global_ = backtest.resumir(res, ["modelo"])
    assert global_.loc["log_lineal_estacional", "WAPE_mensual_%"] < global_.loc["naive_estacional", "WAPE_mensual_%"]
