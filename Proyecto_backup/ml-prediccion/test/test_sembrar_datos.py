"""Pruebas de sembrar_datos.py contra una base SQLite que imita el esquema de mydb.

Ejecutar desde ml-prediccion/:  pytest tests/ -q
"""
import hashlib
import importlib.util
import sqlite3
from pathlib import Path

import numpy as np
import pytest

RUTA = Path(__file__).resolve().parent.parent / "scripts" / "sembrar_datos.py"
spec = importlib.util.spec_from_file_location("sembrar_datos", RUTA)
sd = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sd)

CARGOS = {127: "Desarrolladores de software", 121: "Administradores de comunidades virtuales",
          78: "Diseñadores gráficos", 113: "Analistas financieros", 110: "Contadores",
          105: "Profesores de idiomas", 53: "Ingenieros civiles", 69: "Arquitecto",
          5: "Directores de talento humano", 152: "Editores y redactores",
          394: "Auxiliares en enfermería", 999: "Cargo sin movimiento"}
REQUISITOS = ["Java", "Linux", "Git", "MySQL", "Spring Boot", "Python", "JavaScript", "Google Analytics",
              "SEO y SEM", "Herramientas digitales", "Figma", "Adobe Photoshop", "Adobe Illustrator",
              "Revit", "AutoCAD", "Análisis geoespacial", "Análisis de datos", "Excel avanzado",
              "Análisis financiero", "NIIF", "Organización y planificación", "Cuidado del paciente"]
KITS = {127: ["Java", "Linux", "Git", "MySQL", "Spring Boot"], 121: ["Google Analytics", "SEO y SEM", "Herramientas digitales"],
        78: ["Figma", "Adobe Photoshop", "Adobe Illustrator"], 113: ["Excel avanzado", "Análisis financiero", "Análisis de datos"],
        110: ["Excel avanzado", "NIIF"], 105: ["Git"], 53: ["AutoCAD", "Análisis geoespacial"],
        69: ["Revit", "AutoCAD", "Organización y planificación"], 5: ["Excel avanzado"], 152: ["Herramientas digitales"]}


def crear_base() -> sd.Repo:
    conn = sqlite3.connect(":memory:")
    conn.executescript("""
        CREATE TABLE cargo (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL);
        CREATE TABLE categoria_requisito (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL);
        CREATE TABLE requisito (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, id_categoria INTEGER);
        CREATE TABLE vacante (
            nvacantes INTEGER PRIMARY KEY AUTOINCREMENT, cargo INTEGER NOT NULL, ciudad TEXT,
            comentario_admin TEXT, departamento TEXT, descripcion TEXT, experiencia INTEGER,
            fecha_publicacion TEXT, is_active INTEGER NOT NULL, modalidad TEXT, requerimientos TEXT,
            sueldo INTEGER, tipo TEXT, titulo TEXT, id_usuario_id INTEGER NOT NULL,
            totalpostulaciones INTEGER NOT NULL, activa_por_empresa INTEGER NOT NULL,
            num_compartidos INTEGER NOT NULL, video_link TEXT, visitas INTEGER NOT NULL);
        CREATE TABLE vacante_requisito (vacante_id INTEGER NOT NULL, requisito_id INTEGER NOT NULL);
        CREATE TABLE postulado (id INTEGER PRIMARY KEY, nvacante_id INTEGER);
        CREATE TABLE apelacion (id INTEGER PRIMARY KEY, vacante_id INTEGER);
        CREATE TABLE prueba_tecnica (id INTEGER PRIMARY KEY, vacante_id INTEGER);
        CREATE TABLE vacante_aptitudes (nvacantes INTEGER, aptitud TEXT);
        CREATE TABLE vacante_favorita (id INTEGER PRIMARY KEY, id_fav_vacante INTEGER);
    """)
    conn.execute("INSERT INTO categoria_requisito VALUES (1, 'Herramientas y tecnologias')")
    conn.executemany("INSERT INTO cargo VALUES (?, ?)", list(CARGOS.items()))
    ids_req = {n: i + 1 for i, n in enumerate(REQUISITOS)}
    conn.executemany("INSERT INTO requisito VALUES (?, ?, 1)", [(i, n) for n, i in ids_req.items()])
    rng = np.random.default_rng(0)
    for cargo, kit in KITS.items():                      # ~370 vacantes planas 2020-2024, como tu base
        for _ in range(370):
            y, m = int(rng.integers(2020, 2025)), int(rng.integers(1, 13))
            cur = conn.execute(
                "INSERT INTO vacante (cargo, ciudad, departamento, descripcion, experiencia, fecha_publicacion,"
                " is_active, modalidad, sueldo, tipo, titulo, id_usuario_id, totalpostulaciones,"
                " activa_por_empresa, num_compartidos, visitas) VALUES (?, 'Pereira', 'Risaralda', 'x', 5, ?, 0,"
                " 'Remoto', 1000000, 'Vacante', 't', 512, 0, 1, 0, 0)", (cargo, f"{y}-{m:02d}-10"))
            conn.executemany("INSERT INTO vacante_requisito VALUES (?, ?)", [(cur.lastrowid, ids_req[n]) for n in kit])
    conn.execute("INSERT INTO vacante (cargo, ciudad, departamento, descripcion, experiencia, fecha_publicacion,"
                 " is_active, modalidad, sueldo, tipo, titulo, id_usuario_id, totalpostulaciones,"
                 " activa_por_empresa, num_compartidos, visitas) VALUES (394, 'Cali', 'Valle', 'x', 1,"
                 " '2025-03-01', 1, 'Presencial', 1, 'Practica', 't', 754, 0, 1, 0, 0)")
    conn.execute("INSERT INTO vacante_requisito VALUES (3701, ?)", (ids_req["Cuidado del paciente"],))
    conn.commit()
    return sd.Repo(conn, "sqlite")


TOPE = 3701  # ultimo id de las vacantes originales (3700 planas + 1 de enfermeria)


def huella(repo: sd.Repo) -> str:
    """Huella de las filas ORIGINALES (ids <= TOPE): debe ser identica antes y despues de sembrar."""
    filas = repo.consultar("SELECT * FROM vacante WHERE nvacantes <= {p} ORDER BY nvacantes", (TOPE,))
    return hashlib.md5(repr(filas).encode()).hexdigest()


def serie(repo: sd.Repo, cargo: int) -> dict:
    s: dict = {}
    for (f,) in repo.consultar("SELECT fecha_publicacion FROM vacante WHERE cargo = {p}", (cargo,)):
        s[f[:7]] = s.get(f[:7], 0) + 1
    return s


def anio(s: dict, y: int) -> int:
    return sum(v for k, v in s.items() if k.startswith(str(y)))


@pytest.fixture
def manifiesto(tmp_path):
    return tmp_path / "manifest.json"


@pytest.fixture(autouse=True)
def sin_csv_en_disco(tmp_path, monkeypatch):
    monkeypatch.setattr(sd, "RUTA_PLAN", tmp_path / "plan.csv")


def test_esquema_valido():
    assert crear_base().validar_esquema() == []


def test_esquema_con_columna_obligatoria_desconocida_aborta():
    repo = crear_base()
    repo.conn.executescript("DROP TABLE vacante_requisito; CREATE TABLE vacante_requisito "
                            "(vacante_id INTEGER NOT NULL, requisito_id INTEGER NOT NULL, extra TEXT NOT NULL)")
    assert any("extra" in e for e in repo.validar_esquema())


def test_dry_run_no_escribe_nada(manifiesto):
    repo = crear_base()
    antes = huella(repo)
    n_antes = repo.consultar("SELECT COUNT(*) FROM vacante")[0][0]
    assert sd.sembrar(repo, 42, 150, aplicar=False, confirmar_nombre=None, manifiesto=manifiesto) == 0
    assert repo.consultar("SELECT COUNT(*) FROM vacante")[0][0] == n_antes
    assert huella(repo) == antes and not manifiesto.exists()


def test_apply_inserta_sin_tocar_lo_existente_y_es_reversible(manifiesto):
    repo = crear_base()
    antes = huella(repo)
    n_antes = repo.consultar("SELECT COUNT(*) FROM vacante")[0][0]
    assert sd.sembrar(repo, 42, 150, aplicar=True, confirmar_nombre=None, manifiesto=manifiesto) == 0
    n_despues = repo.consultar("SELECT COUNT(*) FROM vacante")[0][0]
    assert n_despues > n_antes + 20000
    assert huella(repo) == antes                         # lo existente quedo identico
    # integridad: todas las relaciones apuntan a vacantes y requisitos reales
    assert repo.consultar("SELECT COUNT(*) FROM vacante_requisito vr LEFT JOIN vacante v ON v.nvacantes = vr.vacante_id "
                          "WHERE v.nvacantes IS NULL")[0][0] == 0
    assert repo.consultar("SELECT COUNT(*) FROM vacante_requisito vr LEFT JOIN requisito r ON r.id = vr.requisito_id "
                          "WHERE r.id IS NULL")[0][0] == 0
    assert repo.consultar("SELECT COUNT(*) FROM vacante v WHERE NOT EXISTS (SELECT 1 FROM vacante_requisito vr "
                          "WHERE vr.vacante_id = v.nvacantes)")[0][0] == 0
    assert repo.consultar("SELECT COUNT(*) FROM vacante WHERE is_active = 1 AND nvacantes > ?", (n_antes,))[0][0] == 150
    # el cargo sin perfil queda con su unica vacante
    assert sum(serie(repo, 394).values()) == 1
    # rollback devuelve la base al estado original
    assert sd.deshacer(repo, manifiesto) == 0
    assert repo.consultar("SELECT COUNT(*) FROM vacante")[0][0] == n_antes
    assert huella(repo) == antes


def test_tendencias_visibles_y_meses_completos(manifiesto):
    repo = crear_base()
    sd.sembrar(repo, 42, 150, aplicar=True, confirmar_nombre=None, manifiesto=manifiesto)
    dev, edit = serie(repo, 127), serie(repo, 152)
    assert anio(dev, 2026) > 0 and max(dev) == "2026-12"       # llega al ultimo mes completo
    assert anio(dev, 2024) > 1.6 * anio(dev, 2021)             # crece
    assert anio(edit, 2024) < 0.8 * anio(edit, 2021)           # decrece
    meses_ctd = {k: v for k, v in serie(repo, 110).items() if k.endswith("-02")}
    otros = {k: v for k, v in serie(repo, 110).items() if k.endswith("-10")}
    assert sum(meses_ctd.values()) > 1.3 * sum(otros.values())  # estacionalidad (pico en febrero)


def test_requisitos_con_tendencia(manifiesto):
    repo = crear_base()
    sd.sembrar(repo, 42, 150, aplicar=True, confirmar_nombre=None, manifiesto=manifiesto)
    py = repo.consultar("SELECT id FROM requisito WHERE nombre = 'Python'")[0][0]

    def peso(y):
        con = repo.consultar("SELECT COUNT(*) FROM vacante_requisito vr JOIN vacante v ON v.nvacantes = vr.vacante_id "
                             "WHERE vr.requisito_id = ? AND v.cargo = 127 AND v.fecha_publicacion LIKE ?", (py, f"{y}%"))[0][0]
        return con / anio(serie(repo, 127), y)
    assert peso(2020) < 0.25 and peso(2026) > 0.45            # Python pasa de raro a frecuente


def test_semilla_fija_da_el_mismo_plan():
    planes = []
    for _ in range(2):
        repo = crear_base()
        ctx = sd.cargar_contexto(repo)
        planes.append(sd.planificar(ctx, np.random.default_rng(42)))
    assert planes[0] == planes[1]


def test_rollback_se_niega_si_hay_dependencias(manifiesto):
    repo = crear_base()
    sd.sembrar(repo, 42, 150, aplicar=True, confirmar_nombre=None, manifiesto=manifiesto)
    ultimo = repo.consultar("SELECT MAX(nvacantes) FROM vacante")[0][0]
    repo.conn.execute("INSERT INTO postulado (nvacante_id) VALUES (?)", (ultimo,))
    repo.conn.commit()
    n = repo.consultar("SELECT COUNT(*) FROM vacante")[0][0]
    assert sd.deshacer(repo, manifiesto) == 2
    assert repo.consultar("SELECT COUNT(*) FROM vacante")[0][0] == n


def test_falla_a_mitad_revierte_todo(manifiesto, monkeypatch):
    repo = crear_base()
    antes = huella(repo)
    n_antes = repo.consultar("SELECT COUNT(*) FROM vacante")[0][0]
    original = repo.insertar

    def insertar_y_fallar(vac, rel, bloque=2000):
        original(vac, rel, bloque)
        raise RuntimeError("fallo simulado")
    monkeypatch.setattr(repo, "insertar", insertar_y_fallar)
    with pytest.raises(RuntimeError):
        sd.sembrar(repo, 42, 150, aplicar=True, confirmar_nombre=None, manifiesto=manifiesto)
    assert repo.consultar("SELECT COUNT(*) FROM vacante")[0][0] == n_antes
    assert huella(repo) == antes and not manifiesto.exists()
