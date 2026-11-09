#!/usr/bin/env python3
"""Grafica como baja el error de la red en cada epoca y en que punto deja de mejorar.

Requiere: pip install matplotlib   (ademas de TensorFlow y haber ejecutado preparar_series.py)

Uso:
    python scripts/curva_entrenamiento.py                 # con parada anticipada (como entrena de verdad)
    python scripts/curva_entrenamiento.py --sin-parada    # fuerza todas las epocas para ver el sobreajuste
    python scripts/curva_entrenamiento.py --mostrar       # ademas abre la ventana de la grafica
Genera data/curva_entrenamiento.png (o curva_sin_parada.png).
"""
import argparse
import os
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "src"))
os.environ.setdefault("TF_ENABLE_ONEDNN_OPTS", "0")
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

from searchjobs_ml import graficas, series  # noqa: E402

DATA = RAIZ / "data"


def main() -> int:
    ap = argparse.ArgumentParser(description="Curva de entrenamiento (error por epoca).")
    ap.add_argument("--semillas", type=int, default=3)
    ap.add_argument("--epocas", type=int, default=300)
    ap.add_argument("--paciencia", type=int, default=25, help="Epocas sin mejorar antes de detener")
    ap.add_argument("--sin-parada", action="store_true", help="No detener: ejecutar todas las epocas")
    ap.add_argument("--mostrar", action="store_true")
    args = ap.parse_args()

    try:
        import matplotlib  # noqa: F401
        import tensorflow  # noqa: F401
    except ImportError as e:
        print(f"Falta una libreria ({e.name}). Instalala con:  pip install {e.name}")
        return 2
    from searchjobs_ml.red_tf import RedDemanda

    panel = series.cargar_panel(DATA)
    paciencia = args.epocas if args.sin_parada else args.paciencia
    red = RedDemanda(L=24, semillas=args.semillas, epocas=args.epocas, paciencia=paciencia).fit(panel)

    salida = DATA / ("curva_sin_parada.png" if args.sin_parada else "curva_entrenamiento.png")
    r = graficas.graficar_curvas(
        red.historiales, salida, mostrar=args.mostrar,
        titulo="Sin parada anticipada" if args.sin_parada else "Con parada anticipada (como se entrena de verdad)")

    print(f"{'Red':<5}{'Epocas ejecutadas':>20}{'Mejor epoca':>14}{'Error de validacion minimo':>30}")
    for i, h in enumerate(red.historiales):
        print(f"{i + 1:<5}{len(h['loss']):>20}{r['mejores_epocas'][i]:>14}{min(h['val_loss']):>30.4f}")
    if args.sin_parada:
        print(f"\nSin parada se ejecutaron {args.epocas} epocas, pero la mejor fue la ~{r['mejor_epoca_promedio']:.0f}: "
              "lo que viene despues solo memoriza los datos de entrenamiento.")
    else:
        print(f"\nLa parada anticipada detuvo cada red a las {r['epocas_ejecutadas']} epocas (limite: {args.epocas}).")
    print(f"Grafica guardada en {salida}   (tiempo de entrenamiento: {red.segundos:.0f} s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())