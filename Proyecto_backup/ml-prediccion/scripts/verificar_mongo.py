#!/usr/bin/env python3
"""Comprueba (SOLO LECTURA) lo que hay publicado en MongoDB y lo compara con data/contrato_preview.json.

Uso (desde ml-prediccion/, entorno activado, despues de publicar_mongo.py --publicar):
    python scripts/verificar_mongo.py
Lee MONGODB_URI (y MONGODB_DB) del entorno o de .env. No escribe ni borra nada.
"""
import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "src"))

from searchjobs_ml import db  # noqa: E402
from searchjobs_ml.mongo_publicador import leer_vigente, verificar  # noqa: E402

DATA = RAIZ / "data"


def main() -> int:
    db.cargar_env(RAIZ / ".env")
    try:
        cliente, base = db.conectar_mongo()
    except Exception as e:
        print(f"No se pudo conectar a MongoDB: {e}\n(Si es un tiempo de espera, revisa en Atlas > Network Access que tu IP este permitida.)")
        return 2
    try:
        print(f"Base de datos: {base.name}")
        nombres = sorted(base.list_collection_names())
        if not nombres:
            print("  (vacia: todavia no se ha publicado nada)")
        for n in nombres:
            print(f"  coleccion {n:<22} {base[n].count_documents({}):>4} documentos")

        ejecucion, cargos = leer_vigente(base)
        if ejecucion:
            h = ejecucion.get("horizonte", {})
            print(f"\nPrediccion vigente: ejecucion {ejecucion['_id']}  estado={ejecucion.get('estado')}  "
                  f"horizonte {h.get('inicio')}-{h.get('fin')}  finalizada {ejecucion.get('finalizado_en')}")
            for c in cargos:
                p = c["prediccion"][0]["cantidad_predicha"] if c["prediccion"] else "-"
                print(f"  {c['posicion']:>2}. {c['nombre'][:44]:<45} prediccion={p!s:>5}  requisitos={len(c['requisitos'])}")

        ruta = DATA / "contrato_preview.json"
        esperados = json.loads(ruta.read_text(encoding="utf-8"))["data"]["cargos"] if ruta.exists() else None
        problemas = verificar(base, esperados)
    finally:
        cliente.close()

    if problemas:
        print("\nPROBLEMAS ENCONTRADOS:")
        for p in problemas:
            print("  -", p)
        return 1
    print("\nTODO OK" + (": lo publicado coincide exactamente con data/contrato_preview.json." if esperados is not None
                         else " (no hay vista previa para comparar)."))
    return 0


if __name__ == "__main__":
    sys.exit(main())