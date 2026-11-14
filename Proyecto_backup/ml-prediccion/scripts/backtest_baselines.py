#!/usr/bin/env python3
"""Fase C, paso 2: evalua los baselines con backtest de origen movil sobre data/series_mensuales.csv.

Uso:  python scripts/backtest_baselines.py [--folds 3]
Esta tabla es la vara que la red neuronal (fase D) debe superar.
"""
import argparse
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "src"))

import pandas as pd  # noqa: E402

from searchjobs_ml import backtest, series  # noqa: E402
from searchjobs_ml.baselines import BASELINES  # noqa: E402


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--folds", type=int, default=3, help="Cuantos anos moviles se predicen para evaluar")
    args = ap.parse_args()

    panel = series.cargar_panel(RAIZ / "data")
    res = backtest.evaluar(panel, BASELINES, folds=args.folds)
    if res.empty:
        print("No hay suficiente historia para el backtest.")
        return 2
    res["nivel"] = res["serie_id"].map(lambda s: "requisito" if "-r" in s else "cargo")
    res.to_csv(RAIZ / "data" / "backtest_baselines.csv", index=False)

    pd.set_option("display.width", 120)
    print(f"Series: {panel.shape[1]}   Origenes evaluados: {sorted(res['origen'].unique())}\n")
    print("== Global (todas las series, todos los origenes) ==")
    print(backtest.resumir(res, ["modelo"]).to_string())
    print("\n== Por nivel ==")
    print(backtest.resumir(res, ["nivel", "modelo"]).to_string())
    print("\n== Por origen ==")
    print(backtest.resumir(res, ["origen", "modelo"]).to_string())
    print("\nWAPE_mensual: error absoluto mensual total / demanda real total (menor es mejor).")
    print("error_anual_medio: error del total anual por serie, promedio. sesgo_anual: tendencia a sobre/subestimar.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
