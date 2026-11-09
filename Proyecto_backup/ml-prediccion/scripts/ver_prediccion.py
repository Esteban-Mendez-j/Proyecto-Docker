#!/usr/bin/env python3
"""Resumen legible de la prediccion: por cargo, el ultimo anio real frente al anio predicho (con su rango).
 
Uso:  python scripts/ver_prediccion.py
Lee solo data/*.csv (no toca la base de datos). Ejecutalo despues de entrenar_red.py.
"""
import sys
from pathlib import Path
 
RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "src"))
 
import pandas as pd  # noqa: E402
 
from searchjobs_ml import series  # noqa: E402
 
DATA = RAIZ / "data"
 
 
def main() -> int:
    cat = pd.read_csv(DATA / "series_catalogo.csv")
    pred = pd.read_csv(DATA / "predicciones_anuales.csv")
    panel = series.cargar_panel(DATA)
    real = panel.iloc[-12:].sum().rename("real")
    t = (pred.merge(cat[["serie_id", "cargo", "requisito", "nivel"]], on="serie_id")
             .merge(real, left_on="serie_id", right_index=True))
    t["cambio"] = 100 * (t["prediccion_anual"] / t["real"] - 1)
    ultimo, periodo = panel.index[-1], pred["periodo"].iloc[0]
    pd.set_option("display.width", 130)
 
    print(f"Ultimos 12 meses reales (hasta {ultimo}) frente a la prediccion {periodo}\n")
    cargos = t[t["nivel"] == "cargo"].sort_values("cambio", ascending=False)
    print(pd.DataFrame({
        "Cargo": cargos["cargo"].str[:42], "Real": cargos["real"].astype(int),
        "Prediccion": cargos["prediccion_anual"].astype(int), "Cambio %": cargos["cambio"].round(1),
        "Rango probable": cargos["limite_inferior"].astype(int).astype(str) + " - " + cargos["limite_superior"].astype(int).astype(str),
    }).to_string(index=False))
 
    req = t[(t["nivel"] == "requisito") & (t["real"] >= 50)].copy()
    req["Requisito (cargo)"] = req["requisito"].str[:28] + " (" + req["cargo"].str[:22] + ")"
    cols = ["Requisito (cargo)", "real", "prediccion_anual", "cambio"]
    nombres = {"real": "Real", "prediccion_anual": "Prediccion", "cambio": "Cambio %"}
    print("\nRequisitos que mas suben:")
    print(req.sort_values("cambio", ascending=False).head(5)[cols].rename(columns=nombres).round(1).to_string(index=False))
    print("\nRequisitos que mas bajan:")
    print(req.sort_values("cambio").head(5)[cols].rename(columns=nombres).round(1).to_string(index=False))
    return 0
 
 
if __name__ == "__main__":
    sys.exit(main())