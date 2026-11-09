"""Publica una prediccion en MongoDB sin dejar nunca datos a medias.

Colecciones:
  ejecuciones        una por corrida (estado, metricas, horizonte)
  predicciones_cargo un documento por cargo y corrida: {ejecucion_id, cargo_id, datos: <forma del contrato>}
  config             documento 'prediccion_vigente' que apunta a la corrida que debe servir la API

Se escribe primero la corrida completa y SOLO al final se mueve el puntero 'vigente'. Si algo falla,
se borra lo escrito y el puntero queda donde estaba: la API sigue sirviendo la prediccion anterior.
"""
from __future__ import annotations


class PublicadorMongo:
    def __init__(self, db):
        self.db = db

    def preparar_indices(self) -> None:
        col = self.db["predicciones_cargo"]
        col.create_index([("ejecucion_id", 1), ("cargo_id", 1)], unique=True)
        col.create_index([("ejecucion_id", 1), ("datos.posicion", 1)])

    def publicar(self, ejecucion: dict, cargos: list[dict], conservar: int = 5) -> str:
        if conservar < 1:
            raise ValueError("'conservar' debe ser al menos 1.")
        eid = ejecucion["_id"]
        self.db["ejecuciones"].insert_one({**ejecucion, "estado": "PUBLICANDO"})
        try:
            docs = [{"ejecucion_id": eid, "cargo_id": c["id"], "datos": c} for c in cargos]
            self.db["predicciones_cargo"].insert_many(docs)
            n = self.db["predicciones_cargo"].count_documents({"ejecucion_id": eid})
            if n != len(docs):
                raise RuntimeError(f"Verificacion fallida: se esperaban {len(docs)} documentos y hay {n}.")
            self.db["config"].update_one(
                {"_id": "prediccion_vigente"},
                {"$set": {"ejecucion_id": eid, "actualizado_en": ejecucion["finalizado_en"]}}, upsert=True)
            self.db["ejecuciones"].update_one({"_id": eid}, {"$set": {"estado": "OK"}})
        except Exception as e:
            self.db["predicciones_cargo"].delete_many({"ejecucion_id": eid})
            self.db["ejecuciones"].update_one({"_id": eid}, {"$set": {"estado": "ERROR", "mensaje": str(e)}})
            raise
        self._limpiar(conservar)
        return eid

    def _limpiar(self, conservar: int) -> None:
        ok = sorted(self.db["ejecuciones"].find({"estado": "OK"}), key=lambda d: d["iniciado_en"], reverse=True)
        viejas = [d["_id"] for d in ok[conservar:]]
        if viejas:
            self.db["predicciones_cargo"].delete_many({"ejecucion_id": {"$in": viejas}})
            self.db["ejecuciones"].delete_many({"_id": {"$in": viejas}})


def leer_vigente(db):
    """(ejecucion, cargos) de la corrida a la que apunta el puntero 'prediccion_vigente'; (None, []) si no hay."""
    punteros = list(db["config"].find({"_id": "prediccion_vigente"}))
    if not punteros:
        return None, []
    eid = punteros[0]["ejecucion_id"]
    ejecuciones = list(db["ejecuciones"].find({"_id": eid}))
    docs = sorted(db["predicciones_cargo"].find({"ejecucion_id": eid}), key=lambda d: d["datos"]["posicion"])
    return (ejecuciones[0] if ejecuciones else None), [d["datos"] for d in docs]


def verificar(db, esperados: list[dict] | None = None) -> list[str]:
    """Comprueba (solo lectura) que lo publicado esta completo y, si se pasan 'esperados', que es identico."""
    ejecucion, cargos = leer_vigente(db)
    if ejecucion is None:
        return ["No hay prediccion vigente: falta el documento 'prediccion_vigente' o su ejecucion."]
    problemas = []
    if ejecucion.get("estado") != "OK":
        problemas.append(f"La ejecucion vigente tiene estado '{ejecucion.get('estado')}', no 'OK'.")
    if not cargos:
        problemas.append("La ejecucion vigente no tiene documentos de cargo.")
    if esperados is not None:
        if len(cargos) != len(esperados):
            problemas.append(f"Hay {len(cargos)} cargos en MongoDB y {len(esperados)} en la vista previa.")
        por_id = {c["id"]: c for c in cargos}
        for e in esperados:
            if por_id.get(e["id"]) != e:
                problemas.append(f"El cargo {e['id']} ({e['nombre']}) no coincide con la vista previa.")
    return problemas