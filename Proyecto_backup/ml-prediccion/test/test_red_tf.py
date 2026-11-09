"""Pruebas de la red Keras. Se omiten solas si TensorFlow no esta instalado."""
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

pytest.importorskip("tensorflow")
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

from searchjobs_ml.red_tf import RedDemanda  # noqa: E402


def panel_demo(T=72):
    rng = np.random.default_rng(3)
    t = np.arange(T)[:, None]
    base = np.array([[30, 60, 15]])
    estacion = 1 + 0.3 * np.sin(2 * np.pi * t / 12)
    datos = rng.poisson(base * estacion * (1.01 ** t))
    return pd.DataFrame(datos, index=pd.period_range("2020-01", periods=T, freq="M"), columns=["c1", "c1-r5", "c2"])


def test_entrena_y_predice_con_la_forma_correcta():
    panel = panel_demo()
    copia = panel.copy()
    red = RedDemanda(L=24, semillas=1, epocas=3).fit(panel)
    pred = red.predecir(panel)
    assert pred.shape == (12, 3) and np.isfinite(pred).all() and (pred >= 0).all()
    pd.testing.assert_frame_equal(panel, copia)                 # no modifica los datos de entrada
    assert len(red.modelos) == 1 and red.segundos >= 0


def test_la_semilla_fija_da_resultados_cercanos():
    panel = panel_demo()
    a = RedDemanda(L=24, semillas=1, epocas=5).fit(panel).predecir(panel)
    b = RedDemanda(L=24, semillas=1, epocas=5).fit(panel).predecir(panel)
    assert np.allclose(a, b, rtol=0.05, atol=1.0)