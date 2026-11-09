#!/usr/bin/env python3
"""Fase C, paso 1: lee MySQL (solo SELECT) y deja el dataset de series en data/*.csv.

Uso (desde ml-prediccion/, entorno activado):
    python scripts/preparar_series.py
    python scripts/preparar_series.py --corte 2026-12 --max-series 100
La contrasena, si la hay, va en la variable SEED_DB_PASSWORD.
"""
import argparse
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "src"))

import pandas as pd  # noqa: E402

from searchjobs_ml import db, series  # noqa: E402


def main() -> int:
    ap = argparse.ArgumentParser(description="Construye el dataset de series mensuales desde la base de datos.")
    db.agregar_argumentos(ap)
    ap.add_argument("--corte", help="Ultimo mes a incluir (AAAA-MM). Por defecto se deduce de los datos.")
    ap.add_argument("--max-series", type=int, default=100)
    ap.add_argument("--min-total", type=int, default=100, help="Vacantes minimas en toda la historia")
    args = ap.parse_args()

    conn = db.conectar(args)
    try:
        tablas = series.extraer_tablas(conn)
    finally:
        conn.close()

    corte = pd.Period(args.corte, "M") if args.corte else series.inferir_corte(tablas["vac"])
    panel = series.construir_panel(tablas, corte)
    catalogo, elegidas = series.seleccionar(panel, tablas, args.min_total, max_series=args.max_series)
    series.guardar(elegidas, catalogo, RAIZ / "data", corte)

    print(f"Corte (ultimo mes incluido): {corte}   Primer mes: {panel.index.min()}   Meses: {len(panel)}")
    print(f"Series incluidas: {elegidas.shape[1]} de {len(catalogo)}  "
          f"(cargos: {int(catalogo[catalogo.incluida]['nivel'].eq('cargo').sum())})")
    excl = catalogo[~catalogo["incluida"] & (catalogo["total"] > 0)]
    if len(excl):
        print("\nExcluidas con datos (se devolveran como success=false / sin prediccion):")
        print(excl.groupby(["cargo_id", "cargo", "motivo_exclusion"]).size().rename("series").to_string())
    print(f"\nArchivos en {RAIZ / 'data'}: series_mensuales.csv, series_catalogo.csv, dataset_meta.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
