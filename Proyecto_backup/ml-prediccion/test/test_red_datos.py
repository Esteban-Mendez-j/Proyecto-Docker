"""Pruebas de la preparacion de datos de la red (numpy puro) y del backtest de modelos globales."""
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

from searchjobs_ml import backtest, red_datos  # noqa: E402
from searchjobs_ml.baselines import naive_estacional  # noqa: E402


def panel_demo(T=60):
    rng = np.random.default_rng(1)
    indice = pd.period_range("2020-01", periods=T, freq="M")
    datos = rng.poisson(30, size=(T, 3)) + np.arange(T)[:, None]
    return pd.DataFrame(datos, index=indice, columns=["c1", "c1-r5", "c2"])


def test_parsear_serie_y_mapas():
    assert red_datos.parsear_serie("c127") == (127, 0)
    assert red_datos.parsear_serie("c127-r33") == (127, 33)
    assert red_datos.parsear_serie((53, 7)) == (53, 7)
    m = red_datos.mapas_ids(["c2", "c1", "c1-r5"])
    assert m["cargo"] == {1: 0, 2: 1} and m["req"] == {0: 0, 5: 1}


def test_ventanas_forma_y_sin_fuga_del_futuro():
    panel, L, h = panel_demo(), 24, 12
    m = red_datos.mapas_ids(panel.columns)
    d = red_datos.construir_ventanas(panel, m, L, h)
    S, T = panel.shape[1], len(panel)
    assert d["ventana"].shape == (S * (T - L - h + 1), L) and d["y"].shape[1] == h
    assert d["fin"].max() == T - h - 1                       # el objetivo termina en el ultimo mes disponible
    logp = np.log1p(panel.to_numpy(float))
    for k in (0, 17, len(d["fin"]) - 1):                     # la muestra k reproduce exactamente los datos
        s = k // (T - L - h + 1)
        e = d["fin"][k]
        nivel = logp[e - 11: e + 1, s].mean()
        assert np.allclose(d["ventana"][k], logp[e - L + 1: e + 1, s] - nivel)
        assert np.allclose(d["y"][k], logp[e + 1: e + 1 + h, s] - nivel)


def test_a_conteos_revierte_la_escala():
    panel, L, h = panel_demo(), 24, 12
    d = red_datos.construir_ventanas(panel, red_datos.mapas_ids(panel.columns), L, h)
    recuperado = red_datos.a_conteos(d["y"], d["nivel"])
    k, s = 5, 5 // (len(panel) - L - h + 1)
    e = d["fin"][k]
    assert np.allclose(recuperado[k], panel.to_numpy(float)[e + 1: e + 1 + h, s])
    assert (red_datos.a_conteos(np.full((2, h), -50.0), np.zeros(2)) >= 0).all()


def test_entrada_prediccion_usa_la_ultima_ventana():
    panel, L = panel_demo(), 24
    m = red_datos.mapas_ids(panel.columns)
    e = red_datos.entrada_prediccion(panel, m, L)
    logp = np.log1p(panel.to_numpy(float))
    assert e["ventana"].shape == (3, L)
    assert np.allclose(e["nivel"], logp[-12:, :].mean(axis=0))
    assert np.allclose(e["ventana"][1], logp[-L:, 1] - logp[-12:, 1].mean())
    mes_ult = panel.index.month[-1]
    assert np.allclose(e["mes"][0], [np.sin(2 * np.pi * mes_ult / 12), np.cos(2 * np.pi * mes_ult / 12)])


def test_poca_historia_da_error_claro():
    panel = panel_demo(30)
    with pytest.raises(ValueError):
        red_datos.construir_ventanas(panel, red_datos.mapas_ids(panel.columns), 24, 12)


class ModeloFalso:
    """Imita la interfaz de la red: repite los ultimos 12 meses (igual que naive_estacional)."""
    def fit(self, panel):
        return self

    def predecir(self, panel, meses_h):
        return panel.to_numpy(float)[-12:, :]


def test_evaluar_global_coincide_con_el_baseline_equivalente():
    panel = panel_demo(72)
    res_g, tiempos = backtest.evaluar_global(panel, ModeloFalso, "falso", folds=2)
    res_b = backtest.evaluar(panel, {"naive": naive_estacional}, folds=2)
    a = backtest.resumir(res_g, ["modelo"]).iloc[0]
    b = backtest.resumir(res_b, ["modelo"]).iloc[0]
    assert np.allclose(a.to_numpy(), b.to_numpy())
    assert len(tiempos) == 2 and (tiempos["segundos_entrenamiento"] >= 0).all()