#!/usr/bin/env python3
"""Fase D: entrena la red TensorFlow, la compara con los baselines (mismo backtest) y genera la prediccion.

Requiere haber ejecutado antes preparar_series.py y tener TensorFlow instalado (pip install tensorflow).

Uso (desde ml-prediccion/, entorno activado):
    python scripts/entrenar_red.py                  # backtest + prediccion del anio siguiente
    python scripts/entrenar_red.py --solo-backtest  # solo la comparacion
    python scripts/entrenar_red.py --semillas 2 --epocas 100   # prueba rapida
"""
import argparse
import json
import os
import sys
import time
from pathlib import Path

os.environ.setdefault("TF_ENABLE_ONEDNN_OPTS", "0")   # antes de importar TensorFlow
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "src"))

import pandas as pd  # noqa: E402

from searchjobs_ml import backtest, series  # noqa: E402
from searchjobs_ml.baselines import BASELINES  # noqa: E402

DATA = RAIZ / "data"


def tensorflow_disponible() -> bool:
    try:
        import tensorflow  # noqa: F401
        return True
    except ImportError:
        return False


def main() -> int:
    ap = argparse.ArgumentParser(description="Entrena y evalua la red neuronal de demanda laboral.")
    ap.add_argument("--folds", type=int, default=3)
    ap.add_argument("--L", type=int, default=24, help="Meses de historia que ve la red")
    ap.add_argument("--semillas", type=int, default=5, help="Cuantas redes se entrenan y se promedian")
    ap.add_argument("--epocas", type=int, default=300)
    ap.add_argument("--l2", type=float, default=1e-4, help="Regularizacion: mas alto = red mas conservadora")
    ap.add_argument("--dropout", type=float, default=0.1)
    ap.add_argument("--solo-backtest", action="store_true")
    args = ap.parse_args()

    if not tensorflow_disponible():
        print("TensorFlow no esta instalado en este entorno. Instalalo con:  pip install tensorflow")
        return 2
    from searchjobs_ml.red_tf import RedDemanda

    panel = series.cargar_panel(DATA)
    meta = json.loads((DATA / "dataset_meta.json").read_text(encoding="utf-8"))
    print(f"Panel: {panel.shape[1]} series x {len(panel)} meses (corte {meta['corte']})")

    def fabrica():
        return RedDemanda(L=args.L, semillas=args.semillas, epocas=args.epocas, l2=args.l2, dropout=args.dropout)

    t0 = time.time()
    res_base = backtest.evaluar(panel, BASELINES, folds=args.folds)
    res_red, tiempos = backtest.evaluar_global(panel, fabrica, "red_tensorflow", folds=args.folds)
    if res_red.empty:
        print("No hay suficiente historia para el backtest de la red.")
        return 2
    res = pd.concat([res_base, res_red], ignore_index=True)
    res.to_csv(DATA / "backtest_comparacion.csv", index=False)

    pd.set_option("display.width", 120)
    glob = backtest.resumir(res, ["modelo"])
    print("\n== Comparacion global (mismos anos de prueba para todos) ==")
    print(glob.to_string())
    print("\n== Por origen ==")
    print(backtest.resumir(res, ["origen", "modelo"]).to_string())
    print("\n== Tiempo de entrenamiento de la red ==")
    print(tiempos.round(1).to_string(index=False))

    mejor_base = glob.drop(index="red_tensorflow")["WAPE_mensual_%"].idxmin()
    d_wape = glob.loc["red_tensorflow", "WAPE_mensual_%"] - glob.loc[mejor_base, "WAPE_mensual_%"]
    d_anual = glob.loc["red_tensorflow", "error_anual_medio_%"] - glob.loc[mejor_base, "error_anual_medio_%"]
    print(f"\nRed vs mejor baseline ({mejor_base}): WAPE mensual {d_wape:+.1f} puntos, "
          f"error anual {d_anual:+.1f} puntos (negativo = la red es mejor).")

    # Intervalos empiricos: cuanto se desvio el real respecto a lo predicho por la red en el backtest.
    validos = res_red[res_red["pred_anual"] > 0]
    razon = (validos["real_anual"] / validos["pred_anual"]).clip(0.2, 5.0)
    q = {"q10": float(razon.quantile(0.10)), "q50": float(razon.quantile(0.50)),
         "q90": float(razon.quantile(0.90)), "n": int(len(razon))}
    (DATA / "intervalos_empiricos.json").write_text(json.dumps(q, indent=2), encoding="utf-8")
    print(f"Razon real/predicho (backtest): p10={q['q10']:.2f}  p50={q['q50']:.2f}  p90={q['q90']:.2f}  (n={q['n']})")

    if args.solo_backtest:
        print(f"\nListo en {time.time() - t0:.0f} s. Archivos: backtest_comparacion.csv, intervalos_empiricos.json")
        return 0

    print("\nEntrenando el modelo final con toda la historia...")
    red = fabrica().fit(panel)
    pred = red.predecir(panel)                                           # (12, S)
    meses = pd.period_range(panel.index.max() + 1, periods=pred.shape[0], freq="M")
    mensual = pd.DataFrame(pred, index=meses, columns=panel.columns).round(2)
    largo = mensual.rename_axis("mes").reset_index().melt(id_vars="mes", var_name="serie_id", value_name="prediccion")
    largo["mes"] = largo["mes"].astype(str)
    largo.to_csv(DATA / "predicciones_mensuales.csv", index=False)

    anual = mensual.sum().rename("prediccion_anual").to_frame()
    anual["limite_inferior"] = (anual["prediccion_anual"] * q["q10"]).round()
    anual["limite_superior"] = (anual["prediccion_anual"] * q["q90"]).round()
    anual["prediccion_anual"] = anual["prediccion_anual"].round()
    anual["periodo"] = meses[0].year if meses[-1].year == meses[0].year else f"{meses[0]}..{meses[-1]}"
    anual.rename_axis("serie_id").reset_index().to_csv(DATA / "predicciones_anuales.csv", index=False)
    print(f"Prediccion {meses[0]}..{meses[-1]} guardada en predicciones_mensuales.csv y predicciones_anuales.csv")
    print(f"Tiempo total: {time.time() - t0:.0f} s  (epocas por red: {red.epocas_usadas})")
    return 0


if __name__ == "__main__":
    sys.exit(main())