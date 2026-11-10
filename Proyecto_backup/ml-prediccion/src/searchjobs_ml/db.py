"""Conexión a bases de datos y manejo de variables de entorno."""
from __future__ import annotations

import os
from pathlib import Path


def agregar_argumentos(ap):
    ap.add_argument("--host", default="localhost")
    ap.add_argument("--port", type=int, default=3306)
    ap.add_argument("--user", default="root")
    ap.add_argument("--db", default="mydb")
    ap.add_argument("--ssl-ca", help="Ruta del certificado CA (bases en la nube como Aiven)")


def conectar(args):
    import pymysql  # import tardío: las pruebas usan sqlite y no lo necesitan
    kw = dict(host=args.host, port=args.port, user=args.user, database=args.db, charset="utf8mb4",
              password=os.environ.get("SEED_DB_PASSWORD", ""), autocommit=False)
    if args.ssl_ca:
        kw["ssl_ca"] = args.ssl_ca
    return pymysql.connect(**kw)


def cargar_env(ruta) -> None:
    """Carga variables de un archivo .env (CLAVE=valor) sin pisar las que ya existan en el entorno."""
    ruta = Path(ruta)
    if not ruta.exists():
        return
    for linea in ruta.read_text(encoding="utf-8").splitlines():
        linea = linea.strip()
        if not linea or linea.startswith("#") or "=" not in linea:
            continue
        clave, _, valor = linea.partition("=")
        os.environ.setdefault(clave.strip(), valor.strip().strip('"').strip("'"))


def conectar_mongo():
    """Devuelve (cliente, base). Usa MONGODB_URI y, opcionalmente, MONGODB_DB (por defecto searchjobs_prediccion)."""
    uri = os.environ.get("MONGODB_URI")
    if not uri:
        raise RuntimeError("Falta MONGODB_URI (defínela en el entorno o en el archivo .env).")
    from pymongo import MongoClient  # import tardío: las pruebas no lo necesitan
    cliente = MongoClient(uri, serverSelectionTimeoutMS=8000)
    cliente.admin.command("ping")
    return cliente, cliente[os.environ.get("MONGODB_DB", "searchjobs_prediccion")]