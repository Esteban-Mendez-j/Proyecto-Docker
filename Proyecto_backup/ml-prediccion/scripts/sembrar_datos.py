#!/usr/bin/env python3
"""
sembrar_datos.py - Siembra vacantes SINTETICAS con tendencias para entrenar el modelo.

Seguro por diseno:
  * Por defecto es DRY-RUN: calcula y muestra el plan, pero NO escribe nada (usa --apply).
  * Nunca borra ni modifica filas existentes: solo INSERTA lo que falta para llegar a la
    curva objetivo de cada cargo (objetivo - existentes, minimo 0).
  * Todo en una sola transaccion: si algo falla, no queda nada a medias.
  * Pide escribir el nombre de la base antes de aplicar (evita sembrar la base equivocada).
  * Guarda un manifiesto (rango de ids) para poder deshacer con --rollback.
  * Semilla fija: mismos conteos en la base local y en la desplegada.

Uso (desde ml-prediccion/, con el entorno virtual activado):
  python scripts/sembrar_datos.py                       # dry-run en la base local
  python scripts/sembrar_datos.py --apply               # siembra de verdad
  python scripts/sembrar_datos.py --rollback            # deshace la ultima siembra

La contrasena NUNCA va en la linea de comandos: se lee de la variable SEED_DB_PASSWORD.
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

import numpy as np

# ============================================================================
# 1. CONFIGURACION DEL GENERADOR (aqui se "disenan" las tendencias)
# ============================================================================
INICIO = (2020, 1)          # primer mes a cubrir
FIN = (2026, 12)             # ultimo mes COMPLETO (octubre 2026 esta incompleto)
P_BASE = 0.97               # probabilidad de los requisitos "centrales" (estables)
UMBRAL_KIT = 0.5            # un requisito es "central" si aparece en >=50% de las vacantes del cargo

# nivel : promedio de vacantes/mes del periodo (INCLUYE las ya existentes)
# g     : crecimiento anual (0.20 = +20% por ano; negativo = decrece)
# picos : meses de mayor contratacion (1=enero ... 12=diciembre)
# amp   : intensidad de la estacionalidad (0 = ninguna)
# ciclo : amplitud de un ciclo largo de ~4 anos (sector construccion, por ejemplo)
# choque: sensibilidad a la caida de 2020 (0 = inmune, 1 = muy afectado)
PERFILES = {
    127: dict(nivel=42, g=0.22, picos=[], amp=0.00, ciclo=0.00, choque=0.3),   # Desarrolladores de software
    121: dict(nivel=38, g=0.20, picos=[2, 9], amp=0.10, ciclo=0.00, choque=0.5),  # Admin. comunidades virtuales
    78:  dict(nivel=38, g=0.08, picos=[], amp=0.00, ciclo=0.05, choque=0.8),   # Disenadores graficos
    113: dict(nivel=40, g=0.02, picos=[1, 2], amp=0.30, ciclo=0.00, choque=0.7),  # Analistas financieros
    110: dict(nivel=40, g=0.00, picos=[2], amp=0.45, ciclo=0.00, choque=0.5),  # Contadores
    105: dict(nivel=38, g=0.03, picos=[1, 8], amp=0.45, ciclo=0.00, choque=0.8),  # Profesores de idiomas
    53:  dict(nivel=40, g=0.07, picos=[], amp=0.08, ciclo=0.15, choque=1.0),   # Ingenieros civiles
    69:  dict(nivel=36, g=0.06, picos=[], amp=0.08, ciclo=0.15, choque=1.0),   # Arquitecto
    5:   dict(nivel=36, g=-0.04, picos=[1], amp=0.12, ciclo=0.00, choque=0.8),  # Directores de talento humano
    152: dict(nivel=38, g=-0.10, picos=[], amp=0.10, ciclo=0.00, choque=0.9),  # Editores y redactores
}
# El cargo 394 (Auxiliares en enfermeria) NO tiene perfil: se deja con su unica vacante para
# demostrar el caso success=false ("historial insuficiente") del contrato.

# (cargo_id, nombre del requisito): (probabilidad al inicio, probabilidad al final)
# Si el requisito no es "central" para ese cargo, se agrega como requisito extra.
TENDENCIAS = {
    (127, "Python"): (0.08, 0.70),
    (127, "JavaScript"): (0.08, 0.50),
    (127, "Spring Boot"): (0.55, 0.95),
    (127, "Java"): (0.98, 0.80),
    (121, "Google Analytics"): (0.60, 0.97),
    (121, "SEO y SEM"): (0.55, 0.97),
    (78, "Figma"): (0.45, 0.97),
    (78, "Adobe Photoshop"): (0.98, 0.75),
    (69, "Revit"): (0.45, 0.97),
    (69, "AutoCAD"): (0.99, 0.80),
    (53, "Análisis geoespacial"): (0.35, 0.85),
    (113, "Análisis de datos"): (0.55, 0.97),
}

NIVELES = [(0, 2, "Junior"), (3, 5, "Semi Senior"), (6, 99, "Senior")]

# ============================================================================
# 2. ESQUEMA ESPERADO (segun lo que se verifico en la base)
# ============================================================================
COLUMNAS_VACANTE = [
    "nvacantes", "cargo", "ciudad", "comentario_admin", "departamento", "descripcion",
    "experiencia", "fecha_publicacion", "is_active", "modalidad", "requerimientos", "sueldo",
    "tipo", "titulo", "id_usuario_id", "totalpostulaciones", "activa_por_empresa",
    "num_compartidos", "video_link", "visitas",
]
COLUMNAS_RELACION = ["vacante_id", "requisito_id"]
# Tablas que apuntan a vacante: el rollback se niega a borrar si alguna usa las filas sembradas.
DEPENDIENTES = [
    ("postulado", "nvacante_id"),
    ("apelacion", "vacante_id"),
    ("prueba_tecnica", "vacante_id"),
    ("vacante_aptitudes", "nvacantes"),
    ("vacante_favorita", "id_fav_vacante"),
]

RAIZ = Path(__file__).resolve().parent.parent
RUTA_MANIFIESTO = RAIZ / "data" / "seed_manifest.json"
RUTA_PLAN = RAIZ / "data" / "plan_mensual.csv"


# ============================================================================
# 3. ACCESO A DATOS (DB-API: pymysql en uso real, sqlite3 en las pruebas)
# ============================================================================
class Repo:
    def __init__(self, conn, dialect: str = "mysql"):
        self.conn = conn
        self.dialect = dialect
        self.ph = "%s" if dialect == "mysql" else "?"

    def consultar(self, sql: str, params=()):
        cur = self.conn.cursor()
        cur.execute(sql.replace("{p}", self.ph), params)
        filas = cur.fetchall()
        cur.close()
        return filas

    def ejecutar_muchos(self, sql: str, filas):
        cur = self.conn.cursor()
        cur.executemany(sql, filas)
        cur.close()

    def ejecutar(self, sql: str, params=()):
        cur = self.conn.cursor()
        cur.execute(sql.replace("{p}", self.ph), params)
        n = cur.rowcount
        cur.close()
        return n

    def columnas(self, tabla: str) -> dict:
        if self.dialect == "mysql":
            filas = self.consultar(
                "SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT, EXTRA "
                "FROM information_schema.COLUMNS "
                "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = {p}", (tabla,))
            return {f[0]: {"obligatoria": f[1] == "NO" and f[2] is None
                           and "auto_increment" not in (f[3] or "").lower()} for f in filas}
        filas = self.consultar(f"PRAGMA table_info({tabla})")
        return {f[1]: {"obligatoria": bool(f[3]) and f[4] is None and not f[5]} for f in filas}

    def validar_esquema(self) -> list[str]:
        errores = []
        for tabla, propias in (("vacante", COLUMNAS_VACANTE), ("vacante_requisito", COLUMNAS_RELACION)):
            cols = self.columnas(tabla)
            if not cols:
                errores.append(f"No existe la tabla '{tabla}'.")
                continue
            faltan = [c for c in propias if c not in cols]
            if faltan:
                errores.append(f"A la tabla '{tabla}' le faltan las columnas {faltan}.")
            extra = [c for c, i in cols.items() if i["obligatoria"] and c not in propias]
            if extra:
                errores.append(f"'{tabla}' tiene columnas obligatorias que este script no llena: {extra}.")
        for tabla in ("cargo", "requisito"):
            if not self.columnas(tabla):
                errores.append(f"No existe la tabla '{tabla}'.")
        return errores

    def siguiente_id(self) -> int:
        return int(self.consultar("SELECT COALESCE(MAX(nvacantes), 0) + 1 FROM vacante")[0][0])

    def insertar(self, vac_rows, rel_rows, bloque: int = 2000):
        sql_v = (f"INSERT INTO vacante ({', '.join(COLUMNAS_VACANTE)}) "
                 f"VALUES ({', '.join([self.ph] * len(COLUMNAS_VACANTE))})")
        sql_r = f"INSERT INTO vacante_requisito (vacante_id, requisito_id) VALUES ({self.ph}, {self.ph})"
        for i in range(0, len(vac_rows), bloque):
            self.ejecutar_muchos(sql_v, vac_rows[i:i + bloque])
        for i in range(0, len(rel_rows), bloque * 2):
            self.ejecutar_muchos(sql_r, rel_rows[i:i + bloque * 2])

    def contar_rango(self, id_min: int, id_max: int) -> tuple[int, int]:
        v = self.consultar("SELECT COUNT(*) FROM vacante WHERE nvacantes BETWEEN {p} AND {p}", (id_min, id_max))[0][0]
        r = self.consultar("SELECT COUNT(*) FROM vacante_requisito WHERE vacante_id BETWEEN {p} AND {p}",
                           (id_min, id_max))[0][0]
        return int(v), int(r)


# ============================================================================
# 4. LOGICA PURA (sin base de datos)
# ============================================================================
def meses_del_periodo() -> list[tuple[int, int]]:
    y, m = INICIO
    salida = []
    while (y, m) <= FIN:
        salida.append((y, m))
        m += 1
        if m == 13:
            y, m = y + 1, 1
    return salida


def a_anio_mes(valor) -> tuple[int, int]:
    if hasattr(valor, "year"):
        return valor.year, valor.month
    texto = str(valor)
    return int(texto[:4]), int(texto[5:7])


def estacionalidad(picos: list[int], amp: float) -> np.ndarray:
    if not picos or amp == 0:
        return np.ones(12)
    meses = np.arange(1, 13)
    v = np.zeros(12)
    for p in picos:
        d = np.abs(meses - p)
        d = np.minimum(d, 12 - d)
        v += np.exp(-(d ** 2) / (2 * 1.3 ** 2))
    v = (v - v.min()) / (v.max() - v.min())
    s = 1 + amp * (v - v.mean()) * 2
    return s / s.mean()


def curva_objetivo(perfil: dict, meses: list[tuple[int, int]]) -> np.ndarray:
    t = np.arange(len(meses))
    calendario = np.array([m for _, m in meses])
    tendencia = (1 + perfil["g"]) ** (t / 12)
    estacional = estacionalidad(perfil["picos"], perfil["amp"])[calendario - 1]
    ciclo = 1 + perfil["ciclo"] * np.sin(2 * np.pi * t / 48)
    choque = 1 - 0.45 * perfil["choque"] * np.exp(-((t - 4) ** 2) / (2 * 2.5 ** 2))  # caida ~mayo 2020
    bruto = tendencia * estacional * ciclo * choque
    return perfil["nivel"] * bruto / bruto.mean()


def cargar_contexto(repo: Repo) -> dict:
    cargos = {int(i): str(n) for i, n in repo.consultar("SELECT id, nombre FROM cargo")}
    requisitos = {str(n): int(i) for i, n in repo.consultar("SELECT id, nombre FROM requisito")}
    req_nombre = {i: n for n, i in requisitos.items()}

    existentes: dict = defaultdict(int)
    total_cargo: dict = defaultdict(int)
    for cargo, fecha in repo.consultar("SELECT cargo, fecha_publicacion FROM vacante"):
        existentes[(int(cargo), a_anio_mes(fecha))] += 1
        total_cargo[int(cargo)] += 1

    kits: dict = defaultdict(list)
    for cargo, req, n in repo.consultar(
            "SELECT v.cargo, vr.requisito_id, COUNT(*) FROM vacante v "
            "JOIN vacante_requisito vr ON vr.vacante_id = v.nvacantes GROUP BY v.cargo, vr.requisito_id"):
        if total_cargo[int(cargo)] and n / total_cargo[int(cargo)] >= UMBRAL_KIT:
            kits[int(cargo)].append(int(req))

    ctx = {
        "cargos": cargos, "requisitos": requisitos, "req_nombre": req_nombre,
        "existentes": existentes, "kits": kits, "avisos": [],
        "empresas": [int(r[0]) for r in repo.consultar(
            "SELECT DISTINCT id_usuario_id FROM vacante WHERE id_usuario_id IS NOT NULL")],
        "ciudades": [(str(a), str(b)) for a, b in repo.consultar(
            "SELECT DISTINCT ciudad, departamento FROM vacante "
            "WHERE ciudad IS NOT NULL AND departamento IS NOT NULL")],
        "modalidades": [str(r[0]) for r in repo.consultar(
            "SELECT DISTINCT modalidad FROM vacante WHERE modalidad IS NOT NULL")],
        "tipos": [str(r[0]) for r in repo.consultar("SELECT DISTINCT tipo FROM vacante WHERE tipo IS NOT NULL")],
    }
    for clave in ("empresas", "ciudades", "modalidades", "tipos"):
        if not ctx[clave]:
            raise RuntimeError(f"No hay datos de referencia para '{clave}' en la tabla vacante.")
    return ctx


def planificar(ctx: dict, rng: np.random.Generator) -> list[dict]:
    meses = meses_del_periodo()
    plan = []
    for cargo_id in sorted(PERFILES):
        if cargo_id not in ctx["cargos"]:
            ctx["avisos"].append(f"El cargo {cargo_id} no existe en la tabla cargo: se omite.")
            continue
        objetivo = rng.poisson(curva_objetivo(PERFILES[cargo_id], meses))
        for i, (y, m) in enumerate(meses):
            existente = ctx["existentes"].get((cargo_id, (y, m)), 0)
            plan.append({"cargo_id": cargo_id, "mes": f"{y}-{m:02d}", "idx": i, "existente": existente,
                         "objetivo": int(objetivo[i]), "nuevas": max(0, int(objetivo[i]) - existente)})
    return plan


def probabilidades_por_cargo(ctx: dict, cargo_id: int, T: int):
    """Devuelve (ids de requisito, nombres, matriz T x R de probabilidades)."""
    candidatos: dict = {rid: None for rid in sorted(ctx["kits"].get(cargo_id, []))}
    for (c, nombre), (p0, p1) in TENDENCIAS.items():
        if c != cargo_id:
            continue
        rid = ctx["requisitos"].get(nombre)
        if rid is None:
            ctx["avisos"].append(f"Requisito '{nombre}' no existe en la tabla requisito: se omite.")
            continue
        candidatos[rid] = np.linspace(p0, p1, T)
    for rid, parr in candidatos.items():
        if parr is None:
            candidatos[rid] = np.full(T, P_BASE)
    ids = list(candidatos)
    return ids, [ctx["req_nombre"][i] for i in ids], np.vstack([candidatos[i] for i in ids]).T


def generar(ctx: dict, plan: list[dict], rng: np.random.Generator, max_activas: int, id_inicial: int):
    T = len(meses_del_periodo())
    sueldo_base = {c: int(rng.uniform(1_300_000, 3_800_000)) for c in sorted(PERFILES)}
    pesos_tipo = np.array([0.8 if t.lower().startswith("vac") else 0.2 for t in ctx["tipos"]])
    pesos_tipo = pesos_tipo / pesos_tipo.sum()

    vacantes, relaciones, fechas = [], [], []
    siguiente = id_inicial
    por_cargo: dict = {}

    for p in plan:
        if p["nuevas"] == 0:
            continue
        cargo_id = p["cargo_id"]
        if cargo_id not in por_cargo:
            por_cargo[cargo_id] = probabilidades_por_cargo(ctx, cargo_id, T)
        ids, nombres, P = por_cargo[cargo_id]
        if not ids:
            ctx["avisos"].append(f"El cargo {cargo_id} no tiene requisitos centrales: se omite.")
            continue
        n = p["nuevas"]
        anio, mes = int(p["mes"][:4]), int(p["mes"][5:7])
        elegidos = rng.random((n, len(ids))) < P[p["idx"]]
        for fila in np.where(~elegidos.any(axis=1))[0]:      # toda vacante debe tener >=1 requisito
            elegidos[fila, int(np.argmax(P[p["idx"]]))] = True

        for k in range(n):
            exp = int(rng.integers(0, 11))
            nivel = next(nombre for lo, hi, nombre in NIVELES if lo <= exp <= hi)
            ciudad, depto = ctx["ciudades"][int(rng.integers(len(ctx["ciudades"])))]
            reqs = [nombres[j] for j in np.where(elegidos[k])[0]]
            cargo_txt = ctx["cargos"][cargo_id]
            sueldo = int(round(sueldo_base[cargo_id] * (1 + 0.06 * exp + rng.normal(0, 0.05)), -3))
            fecha = f"{anio}-{mes:02d}-{int(rng.integers(1, 29)):02d}"
            vacantes.append([
                siguiente, cargo_id, ciudad, None, depto,
                f"Se requiere {cargo_txt} con {exp} anos de experiencia.",
                exp, fecha, 0, ctx["modalidades"][int(rng.integers(len(ctx["modalidades"])))],
                ("Requisitos: " + ", ".join(reqs) + ".")[:250], sueldo,
                ctx["tipos"][int(rng.choice(len(ctx["tipos"]), p=pesos_tipo))],
                f"{cargo_txt} {nivel}"[:100],
                ctx["empresas"][int(rng.integers(len(ctx["empresas"])))],
                0, 1, 0, None, 0,
            ])
            fechas.append((fecha, siguiente))
            relaciones.extend((siguiente, int(ids[j])) for j in np.where(elegidos[k])[0])
            siguiente += 1

    # Solo las vacantes mas recientes quedan activas, para no inundar la app ni el optimizador.
    indice = {v[0]: i for i, v in enumerate(vacantes)}
    for _, vid in sorted(fechas, reverse=True)[:max_activas]:
        vacantes[indice[vid]][8] = 1
    return vacantes, relaciones


# ============================================================================
# 5. REPORTE Y ARCHIVOS
# ============================================================================
def reportar(ctx: dict, plan: list[dict], vacantes: list, relaciones: list):
    acum: dict = defaultdict(lambda: {"existente": 0, "objetivo": 0, "nuevas": 0, "serie": []})
    for p in plan:
        a = acum[p["cargo_id"]]
        a["existente"] += p["existente"]
        a["objetivo"] += p["objetivo"]
        a["nuevas"] += p["nuevas"]
        a["serie"].append(max(p["objetivo"], p["existente"]))
    print(f"\n{'cargo':<46}{'existentes':>11}{'a insertar':>11}{'total':>8}{'ult12/prim12':>14}")
    for cargo_id, a in sorted(acum.items()):
        s = a["serie"]
        razon = sum(s[-12:]) / max(1, sum(s[:12]))
        print(f"{cargo_id:>4} {ctx['cargos'][cargo_id][:40]:<41}{a['existente']:>11}{a['nuevas']:>11}"
              f"{a['existente'] + a['nuevas']:>8}{razon:>14.2f}")
    activas = sum(1 for v in vacantes if v[8] == 1)
    print(f"\nVacantes a insertar : {len(vacantes):,}  (activas: {activas})")
    print(f"Filas vacante_requisito a insertar: {len(relaciones):,}")
    for aviso in ctx["avisos"]:
        print(f"AVISO: {aviso}")
    print("\nMuestra de 3 vacantes que se insertarian:")
    for v in vacantes[:3]:
        print("  ", dict(zip(COLUMNAS_VACANTE, v)))


def escribir_plan_csv(plan: list[dict]):
    RUTA_PLAN.parent.mkdir(parents=True, exist_ok=True)
    with open(RUTA_PLAN, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["cargo_id", "mes", "existente", "objetivo", "nuevas"])
        w.writeheader()
        for p in plan:
            w.writerow({k: p[k] for k in w.fieldnames})


# ============================================================================
# 6. OPERACIONES: SEMBRAR Y DESHACER
# ============================================================================
def sembrar(repo: Repo, seed: int, max_activas: int, aplicar: bool, confirmar_nombre: str | None,
            manifiesto: Path = RUTA_MANIFIESTO, destino: str = "") -> int:
    errores = repo.validar_esquema()
    if errores:
        print("ESQUEMA NO COMPATIBLE. No se escribio nada:")
        for e in errores:
            print("  -", e)
        return 2

    ctx = cargar_contexto(repo)
    rng = np.random.default_rng(seed)
    plan = planificar(ctx, rng)
    id_inicial = repo.siguiente_id()
    vacantes, relaciones = generar(ctx, plan, rng, max_activas, id_inicial)
    reportar(ctx, plan, vacantes, relaciones)
    escribir_plan_csv(plan)
    print(f"\nPlan mensual guardado en {RUTA_PLAN}")

    if not vacantes:
        print("No hay nada que insertar.")
        return 0
    if not aplicar:
        repo.conn.rollback()
        print("\nDRY-RUN: no se escribio nada en la base. Usa --apply para sembrar.")
        return 0

    if confirmar_nombre is not None:
        escrito = input(f"\nVas a ESCRIBIR en la base '{destino}'. Escribe su nombre para confirmar: ").strip()
        if escrito != destino:
            print("Nombre distinto: cancelado, no se escribio nada.")
            return 1

    try:
        repo.insertar(vacantes, relaciones)
        id_min, id_max = vacantes[0][0], vacantes[-1][0]
        v, r = repo.contar_rango(id_min, id_max)
        if v != len(vacantes) or r < len(relaciones):
            raise RuntimeError(f"Verificacion fallida: esperaba {len(vacantes)}/{len(relaciones)}, hay {v}/{r}.")
        repo.conn.commit()
    except Exception:
        repo.conn.rollback()
        print("ERROR: se revirtio la transaccion, la base quedo intacta.")
        raise

    manifiesto.parent.mkdir(parents=True, exist_ok=True)
    manifiesto.write_text(json.dumps({
        "id_min": id_min, "id_max": id_max, "n_vacantes": len(vacantes), "n_relaciones": len(relaciones),
        "seed": seed, "base": destino, "fecha": datetime.now().isoformat(timespec="seconds"),
    }, indent=2), encoding="utf-8")
    print(f"\nListo: {len(vacantes):,} vacantes y {len(relaciones):,} relaciones (ids {id_min}-{id_max}).")
    print(f"Manifiesto: {manifiesto}")
    return 0


def deshacer(repo: Repo, manifiesto: Path = RUTA_MANIFIESTO) -> int:
    if not manifiesto.exists():
        print(f"No encuentro el manifiesto {manifiesto}. No se borro nada.")
        return 2
    m = json.loads(manifiesto.read_text(encoding="utf-8"))
    a, b = m["id_min"], m["id_max"]
    v, r = repo.contar_rango(a, b)
    if v != m["n_vacantes"]:
        print(f"El rango {a}-{b} tiene {v} vacantes y el manifiesto dice {m['n_vacantes']}. No se borro nada.")
        return 2
    for tabla, col in DEPENDIENTES:
        if not repo.columnas(tabla):
            continue
        usados = repo.consultar(f"SELECT COUNT(*) FROM {tabla} WHERE {col} BETWEEN {{p}} AND {{p}}", (a, b))[0][0]
        if usados:
            print(f"'{tabla}' ya referencia {usados} vacantes sembradas. No se borro nada.")
            return 2
    try:
        repo.ejecutar("DELETE FROM vacante_requisito WHERE vacante_id BETWEEN {p} AND {p}", (a, b))
        repo.ejecutar("DELETE FROM vacante WHERE nvacantes BETWEEN {p} AND {p}", (a, b))
        repo.conn.commit()
    except Exception:
        repo.conn.rollback()
        raise
    manifiesto.rename(manifiesto.with_suffix(".deshecho.json"))
    print(f"Deshecho: {v:,} vacantes y {r:,} relaciones eliminadas (ids {a}-{b}).")
    return 0


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Siembra vacantes sinteticas con tendencias (dry-run por defecto).")
    ap.add_argument("--host", default="localhost")
    ap.add_argument("--port", type=int, default=3306)
    ap.add_argument("--user", default="root")
    ap.add_argument("--db", default="mydb")
    ap.add_argument("--ssl-ca", help="Ruta del certificado CA (bases en la nube como Aiven)")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--max-activas", type=int, default=150, help="Cuantas vacantes sembradas quedan activas")
    ap.add_argument("--apply", action="store_true", help="Escribe de verdad (sin esto es dry-run)")
    ap.add_argument("--yes", action="store_true", help="No pedir confirmacion escrita")
    ap.add_argument("--rollback", action="store_true", help="Deshace la ultima siembra (usa el manifiesto)")
    args = ap.parse_args(argv)

    import pymysql  # se importa aqui para que las pruebas no lo necesiten
    kw = dict(host=args.host, port=args.port, user=args.user, database=args.db, charset="utf8mb4",
              password=os.environ.get("SEED_DB_PASSWORD", ""), autocommit=False)
    if args.ssl_ca:
        kw["ssl_ca"] = args.ssl_ca
    repo = Repo(pymysql.connect(**kw), "mysql")
    try:
        if args.rollback:
            return deshacer(repo)
        return sembrar(repo, args.seed, args.max_activas, args.apply,
                       None if args.yes else args.db, destino=args.db)
    finally:
        repo.conn.close()


if __name__ == "__main__":
    sys.exit(main())