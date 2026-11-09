#!/usr/bin/env python3
"""Fase E: convierte la prediccion en documentos del contrato y (opcionalmente) los publica en MongoDB Atlas.

Requiere haber ejecutado preparar_series.py y entrenar_red.py (usa data/*.csv). Para publicar: pip install pymongo.

Uso (desde ml-prediccion/, entorno activado):
    python scripts/publicar_mongo.py               # SIMULACRO: arma los documentos y los muestra, no toca Mongo
    python scripts/publicar_mongo.py --publicar    # escribe en MongoDB (lee MONGODB_URI del entorno o de .env)
Siempre genera data/contrato_preview.json: la respuesta del contrato con la prediccion real (util para Flutter).
"""
import argparse
import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "src"))

from searchjobs_ml import contrato, db  # noqa: E402

DATA = RAIZ / "data"


def main() -> int:
    ap = argparse.ArgumentParser(description="Publica la prediccion en MongoDB (simulacro por defecto).")
    ap.add_argument("--publicar", action="store_true", help="Escribe de verdad en MongoDB")
    ap.add_argument("--anios-historia", type=int, default=3, help="Anios de historia que acompanan a cada prediccion")
    ap.add_argument("--conservar", type=int, default=5, help="Cuantas corridas mantener en la base")
    ap.add_argument("--env", default=str(RAIZ / ".env"))
    args = ap.parse_args()

    inicio = contrato.ahora_utc()
    catalogo, panel, pred, meta, intervalos, bt = contrato.cargar_insumos(DATA)
    cargos, resumen = contrato.construir(catalogo, panel, pred, args.anios_historia)
    ejecucion = contrato.construir_ejecucion(resumen, meta, intervalos, bt, inicio, contrato.ahora_utc())

    print(f"Prediccion {resumen['anio_prediccion']}: {resumen['cargos_ok']} cargos con prediccion, "
          f"{resumen['cargos_sin_prediccion']} sin prediccion, {resumen['requisitos']} requisitos "
          f"({resumen['requisitos_ajustados']} ajustados para no superar a su cargo)\n")
    print(f"{'#':>3} {'cargo':<44}{'real ' + str(resumen['anio_prediccion'] - 1):>10}{'prediccion':>12}{'rango':>16}{'cambio %':>10}{'req.':>6}")
    for c in cargos:
        if c["success"]:
            p, h = c["prediccion"][0], c["demanda_historica"][-1]["cantidad"]
            print(f"{c['posicion']:>3} {c['nombre'][:43]:<44}{h:>10}{p['cantidad_predicha']:>12}"
                  f"{str(p['limite_inferior']) + ' - ' + str(p['limite_superior']):>16}{c['crecimiento_estimado']:>10.1f}{len(c['requisitos']):>6}")
        else:
            print(f"{c['posicion']:>3} {c['nombre'][:43]:<44}  -> {c['motivo_sin_prediccion']}")

    vista = contrato.respuesta_vista_previa(cargos, ejecucion)
    (DATA / "contrato_preview.json").write_text(json.dumps(vista, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nVista previa del contrato guardada en {DATA / 'contrato_preview.json'}")

    if not args.publicar:
        print("SIMULACRO: no se escribio nada en MongoDB. Usa --publicar para publicar.")
        return 0

    db.cargar_env(args.env)
    try:
        cliente, base = db.conectar_mongo()
    except Exception as e:
        print(f"No se pudo conectar a MongoDB: {e}\n(Si es un tiempo de espera, revisa en Atlas > Network Access que tu IP este permitida.)")
        return 2
    try:
        from searchjobs_ml.mongo_publicador import PublicadorMongo
        pub = PublicadorMongo(base)
        pub.preparar_indices()
        eid = pub.publicar(ejecucion, cargos, args.conservar)
    finally:
        cliente.close()
    print(f"\nPublicado en MongoDB (base '{base.name}'): ejecucion {eid} ahora es la vigente.")
    return 0


if __name__ == "__main__":
    sys.exit(main())