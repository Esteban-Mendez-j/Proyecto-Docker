"""Prueba de la grafica de curvas de entrenamiento (se omite sola si no hay matplotlib)."""
import sys
from pathlib import Path

import numpy as np
import pytest

pytest.importorskip("matplotlib")
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

from searchjobs_ml import graficas  # noqa: E402


def historial_falso(parar=60, minimo_en=20, ruido=0.002, semilla=0):
    """Entrenamiento siempre baja; la validacion baja y luego sube (sobreajuste) pasada la epoca minimo_en."""
    rng = np.random.default_rng(semilla)
    ep = np.arange(1, parar + 1)
    entrenamiento = 0.6 * np.exp(-ep / 10) + 0.08 + rng.normal(0, ruido, parar)
    validacion = 0.6 * np.exp(-ep / 10) + 0.10 + 0.0004 * np.maximum(0, ep - minimo_en) ** 2 + rng.normal(0, ruido, parar)
    return {"loss": entrenamiento.tolist(), "val_loss": validacion.tolist()}


def test_graficar_curvas_crea_el_archivo_y_encuentra_el_mejor_punto(tmp_path):
    historiales = [historial_falso(60 + 3 * k, 20, semilla=k) for k in range(3)]
    ruta = tmp_path / "curva.png"
    r = graficas.graficar_curvas(historiales, ruta)
    assert ruta.exists() and ruta.stat().st_size > 5000
    assert r["epocas_ejecutadas"] == [60, 63, 66]
    esperado = [int(np.argmin(h["val_loss"])) + 1 for h in historiales]
    assert r["mejores_epocas"] == esperado                          # marca exactamente el minimo de validacion
    assert r["mejor_epoca_promedio"] == pytest.approx(np.mean(esperado))
    assert all(m < n for m, n in zip(r["mejores_epocas"], r["epocas_ejecutadas"]))   # despues del minimo, la curva sube