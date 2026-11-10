"""Red neuronal TensorFlow/Keras que predice los h meses siguientes de cada serie de demanda.

Un UNICO modelo global para todas las series (cargos y requisitos). Entradas:
  - ventana: ultimos L meses en escala relativa (ver red_datos)
  - mes: seno y coseno del mes del ultimo dato (estacionalidad)
  - cargo y requisito: identificadores que la red convierte en vectores cortos (embeddings)
Salida: h valores (los meses siguientes) en escala relativa. Se entrenan varias semillas y se promedian.
"""
from __future__ import annotations

import os
import time

import numpy as np

from . import red_datos

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")      # menos ruido en consola
os.environ.setdefault("TF_ENABLE_ONEDNN_OPTS", "0")      # resultados mas reproducibles en CPU


class RedDemanda:
    def __init__(self, L: int = 24, h: int = 12, semillas: int = 5, epocas: int = 300, paciencia: int = 25,
                 lote: int = 64, emb_dim: int = 4, lr: float = 1e-3, l2: float = 1e-4, dropout: float = 0.1,
                 val_fines: int = 6, verbose: int = 0):
        self.L, self.h, self.semillas, self.epocas, self.paciencia = L, h, semillas, epocas, paciencia
        self.lote, self.emb_dim, self.lr, self.l2, self.dropout = lote, emb_dim, lr, l2, dropout
        self.val_fines, self.verbose = val_fines, verbose
        self.modelos, self.epocas_usadas, self.segundos = [], [], 0.0
        self.historiales = []          # error por epoca (entrenamiento y validacion) de cada red

    def _construir(self, n_cargos: int, n_reqs: int):
        from tensorflow import keras
        capas = keras.layers
        ventana = keras.Input(shape=(self.L,), name="ventana")
        mes = keras.Input(shape=(2,), name="mes")
        cargo = keras.Input(shape=(1,), dtype="int32", name="cargo")
        req = keras.Input(shape=(1,), dtype="int32", name="requisito")
        e_cargo = capas.Flatten()(capas.Embedding(n_cargos, self.emb_dim)(cargo))
        e_req = capas.Flatten()(capas.Embedding(n_reqs, self.emb_dim)(req))
        x = capas.Concatenate()([ventana, mes, e_cargo, e_req])
        reg = keras.regularizers.l2(self.l2)
        x = capas.Dense(64, activation="relu", kernel_regularizer=reg)(x)
        x = capas.Dropout(self.dropout)(x)
        x = capas.Dense(32, activation="relu", kernel_regularizer=reg)(x)
        salida = capas.Dense(self.h, name="meses_siguientes")(x)
        modelo = keras.Model([ventana, mes, cargo, req], salida)
        modelo.compile(optimizer=keras.optimizers.Adam(self.lr), loss="mae")   # MAE ~ mediana: robusto al ruido
        return modelo

    @staticmethod
    def _entradas(d: dict, filtro=None) -> dict:
        claves = ("ventana", "mes", "cargo", "requisito")
        return {k: (d[k] if filtro is None else d[k][filtro]) for k in claves}

    def fit(self, panel):
        from tensorflow import keras
        keras.backend.clear_session()
        self.mapas = red_datos.mapas_ids(panel.columns)
        d = red_datos.construir_ventanas(panel, self.mapas, self.L, self.h)
        es_val = d["fin"] > d["fin"].max() - self.val_fines          # ultimas posiciones en el tiempo
        if (~es_val).sum() < 50:
            raise ValueError("Muy pocas muestras de entrenamiento: revisa L, h y la historia disponible.")
        x_ent, y_ent = self._entradas(d, ~es_val), d["y"][~es_val]
        x_val, y_val = self._entradas(d, es_val), d["y"][es_val]

        self.modelos, self.epocas_usadas, self.historiales = [], [], []
        inicio = time.time()
        for k in range(self.semillas):
            keras.utils.set_random_seed(1000 + k)
            modelo = self._construir(len(self.mapas["cargo"]), len(self.mapas["req"]))
            hist = modelo.fit(
                x_ent, y_ent, validation_data=(x_val, y_val), epochs=self.epocas, batch_size=self.lote,
                shuffle=True, verbose=self.verbose,
                callbacks=[keras.callbacks.EarlyStopping(monitor="val_loss", patience=self.paciencia,
                                                         restore_best_weights=True)])
            self.modelos.append(modelo)
            self.epocas_usadas.append(len(hist.history["loss"]))
            self.historiales.append({k: [float(v) for v in vals] for k, vals in hist.history.items()})
        self.segundos = time.time() - inicio
        self.n_muestras = int((~es_val).sum())
        return self

    def predecir(self, panel, meses_h=None) -> np.ndarray:
        """Devuelve (h, S): vacantes esperadas por mes para cada serie, a partir del ultimo mes del panel."""
        e = red_datos.entrada_prediccion(panel, self.mapas, self.L)
        x = self._entradas(e)
        relativo = np.mean([m.predict(x, verbose=0) for m in self.modelos], axis=0)    # (S, h)
        return red_datos.a_conteos(relativo, e["nivel"]).T