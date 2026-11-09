"""Graficas de apoyo con matplotlib (se importa solo al usarlas)."""
from __future__ import annotations

import numpy as np


def graficar_curvas(historiales: list[dict], ruta, mostrar: bool = False,
                    titulo: str = "Curva de entrenamiento de la red neuronal") -> dict:
    """Dibuja el error por epoca (entrenamiento vs validacion) y marca el mejor punto.

    historiales: lista de diccionarios {'loss': [...], 'val_loss': [...]}, uno por red entrenada.
    Devuelve un resumen con la mejor epoca de cada red y cuantas epocas se ejecutaron.
    """
    import matplotlib
    if not mostrar:
        matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(9.5, 5.4))
    for h in historiales:                                    # cada red, en tenue
        ep = np.arange(1, len(h["loss"]) + 1)
        ax.plot(ep, h["loss"], color="tab:blue", alpha=0.18, lw=1)
        ax.plot(ep, h["val_loss"], color="tab:orange", alpha=0.18, lw=1)

    n = min(len(h["loss"]) for h in historiales)             # promedio hasta donde todas llegaron
    ep = np.arange(1, n + 1)
    ax.plot(ep, np.mean([h["loss"][:n] for h in historiales], axis=0), color="tab:blue", lw=2.4,
            label="Entrenamiento (datos con los que aprende)")
    ax.plot(ep, np.mean([h["val_loss"][:n] for h in historiales], axis=0), color="tab:orange", lw=2.4,
            label="Validacion (datos que no usa para aprender)")

    mejores = [int(np.argmin(h["val_loss"])) + 1 for h in historiales]
    mejor = float(np.mean(mejores))
    ax.axvline(mejor, color="gray", ls="--", lw=1.4, label=f"Mejor punto (epoca ~{mejor:.0f})")
    ejecutadas = [len(h["loss"]) for h in historiales]
    ax.set_xlabel("Epoca (una vuelta completa por los datos de entrenamiento)")
    ax.set_ylabel("Error (MAE, escala relativa)")
    ax.set_title(f"{titulo}\n({len(historiales)} redes; las lineas tenues son cada red, las gruesas el promedio)", fontsize=11)
    ax.grid(alpha=0.25)
    ax.legend()
    fig.tight_layout()
    fig.savefig(ruta, dpi=140)
    if mostrar:
        plt.show()
    plt.close(fig)
    return {"mejor_epoca_promedio": mejor, "mejores_epocas": mejores, "epocas_ejecutadas": ejecutadas}