"""Pruebas de la fase E: forma del contrato, coherencia de los numeros y publicacion segura en Mongo (con una base falsa)."""
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

from searchjobs_ml import contrato, db  # noqa: E402
from searchjobs_ml.mongo_publicador import PublicadorMongo  # noqa: E402

CLAVES_CARGO = {"id", "nombre", "posicion", "success", "motivo_sin_prediccion", "demanda_historica",
                "prediccion", "crecimiento_estimado", "requisitos"}
CLAVES_REQUISITO = {"id", "nombre", "tipo", "success", "motivo_sin_prediccion", "demanda_historica",
                    "prediccion", "crecimiento_estimado"}
CLAVES_PREDICCION = {"periodo", "cantidad_predicha", "limite_inferior", "limite_superior"}


def insumos():
    """Panel 2020-2026 completo (84 meses) con 3 cargos incluidos, 2 requisitos y un cargo sin historial."""
    meses = pd.period_range("2020-01", "2026-12", freq="M")
    panel = pd.DataFrame({"c1": 30, "c1-r5": 20, "c1-r6": 29, "c2": 10, "c2-r5": 4, "c3": 50}, index=meses)
    panel.loc["2026-01":"2026-12", "c1"] = 40                      # el ultimo anio real de c1 = 480
    catalogo = pd.DataFrame([
        dict(serie_id="c1", cargo_id=1, requisito_id=0, nivel="cargo", cargo="Cargo Uno", requisito="(total del cargo)", categoria=None, incluida=True, motivo_exclusion="", total=2800),
        dict(serie_id="c1-r5", cargo_id=1, requisito_id=5, nivel="requisito", cargo="Cargo Uno", requisito="Python", categoria="Herramientas", incluida=True, motivo_exclusion="", total=1700),
        dict(serie_id="c1-r6", cargo_id=1, requisito_id=6, nivel="requisito", cargo="Cargo Uno", requisito="Excel", categoria=None, incluida=True, motivo_exclusion="", total=2400),
        dict(serie_id="c2", cargo_id=2, requisito_id=0, nivel="cargo", cargo="Cargo Dos", requisito="(total del cargo)", categoria=None, incluida=True, motivo_exclusion="", total=840),
        dict(serie_id="c2-r5", cargo_id=2, requisito_id=5, nivel="requisito", cargo="Cargo Dos", requisito="Python", categoria="Herramientas", incluida=True, motivo_exclusion="", total=336),
        dict(serie_id="c3", cargo_id=3, requisito_id=0, nivel="cargo", cargo="Cargo Tres", requisito="(total del cargo)", categoria=None, incluida=True, motivo_exclusion="", total=4200),
        dict(serie_id="c9", cargo_id=9, requisito_id=0, nivel="cargo", cargo="Sin Historial", requisito="(total del cargo)", categoria=None, incluida=False, motivo_exclusion="historial insuficiente (total < 100)", total=6),
    ])
    pred = pd.DataFrame([
        dict(serie_id="c1", prediccion_anual=520.4, limite_inferior=450.0, limite_superior=640.0, periodo=2027),
        dict(serie_id="c1-r5", prediccion_anual=300.0, limite_inferior=250.0, limite_superior=380.0, periodo=2027),
        dict(serie_id="c1-r6", prediccion_anual=560.0, limite_inferior=500.0, limite_superior=700.0, periodo=2027),   # supera a su cargo
        dict(serie_id="c2", prediccion_anual=100.0, limite_inferior=90.0, limite_superior=125.0, periodo=2027),
        dict(serie_id="c2-r5", prediccion_anual=50.0, limite_inferior=40.0, limite_superior=70.0, periodo=2027),
        dict(serie_id="c3", prediccion_anual=700.0, limite_inferior=620.0, limite_superior=800.0, periodo=2027),
    ])
    return catalogo, panel, pred


def sin_numpy(obj):
    if isinstance(obj, dict):
        return all(isinstance(k, str) and sin_numpy(v) for k, v in obj.items())
    if isinstance(obj, list):
        return all(sin_numpy(v) for v in obj)
    return type(obj) in (int, float, str, bool, type(None)) and not isinstance(obj, np.generic)


def test_forma_exacta_del_contrato_y_tipos_nativos():
    cargos, resumen = contrato.construir(*insumos())
    assert sin_numpy(cargos) and json.dumps(cargos)                    # serializable (BSON/JSON) sin tipos numpy
    for c in cargos:
        assert set(c) == CLAVES_CARGO
        for p in c["prediccion"]:
            assert set(p) == CLAVES_PREDICCION
        for r in c["requisitos"]:
            assert set(r) == CLAVES_REQUISITO
    assert resumen["anio_prediccion"] == 2027 and resumen["cargos_ok"] == 3 and resumen["cargos_sin_prediccion"] == 1


def test_historia_crecimiento_y_posicion():
    cargos, _ = contrato.construir(*insumos())
    por_id = {c["id"]: c for c in cargos}
    c1 = por_id[1]
    assert [h["periodo"] for h in c1["demanda_historica"]] == [2024, 2025, 2026]       # ultimos 3 anios completos
    assert [h["cantidad"] for h in c1["demanda_historica"]] == [360, 360, 480]
    assert c1["prediccion"][0]["cantidad_predicha"] == 520
    assert c1["crecimiento_estimado"] == pytest.approx(100 * (520 - 480) / 480, abs=0.01)
    assert [c["id"] for c in cargos] == [3, 1, 2, 9]                                  # ordenados por prediccion; sin historial al final
    assert [c["posicion"] for c in cargos] == [1, 2, 3, 4]


def test_requisitos_nunca_superan_a_su_cargo_y_el_rango_es_coherente():
    cargos, resumen = contrato.construir(*insumos())
    assert resumen["requisitos_ajustados"] == 1
    for c in cargos:
        if not c["success"]:
            continue
        pc = c["prediccion"][0]
        assert pc["limite_inferior"] <= pc["cantidad_predicha"] <= pc["limite_superior"]
        for r in c["requisitos"]:
            pr = r["prediccion"][0]
            assert pr["limite_inferior"] <= pr["cantidad_predicha"] <= pr["limite_superior"]
            assert pr["cantidad_predicha"] <= pc["cantidad_predicha"] and pr["limite_superior"] <= pc["limite_superior"]
    c1 = next(c for c in cargos if c["id"] == 1)
    assert [r["id"] for r in c1["requisitos"]] == [6, 5]                              # ordenados de mayor a menor
    assert c1["requisitos"][0]["tipo"] == contrato.SIN_CATEGORIA and c1["requisitos"][1]["tipo"] == "Herramientas"


def test_cargo_sin_historial_se_devuelve_como_success_false():
    cargos, _ = contrato.construir(*insumos())
    c = next(c for c in cargos if c["id"] == 9)
    assert c["success"] is False and "insuficiente" in c["motivo_sin_prediccion"] and "6 vacantes" in c["motivo_sin_prediccion"]
    assert c["demanda_historica"] == [] and c["prediccion"] == [] and c["requisitos"] == []


def test_rechaza_una_prediccion_que_no_es_del_anio_siguiente():
    catalogo, panel, pred = insumos()
    pred["periodo"] = 2028
    with pytest.raises(ValueError):
        contrato.construir(catalogo, panel, pred)
    pred["periodo"] = "2026-10..2027-09"
    with pytest.raises(ValueError):
        contrato.construir(catalogo, panel, pred)


# ---------- publicacion con una base de datos falsa ----------
class Coleccion:
    def __init__(self):
        self.docs = []

    def create_index(self, *a, **k):
        pass

    def insert_one(self, d):
        assert all(d["_id"] != x.get("_id") for x in self.docs if "_id" in x), "_id duplicado"
        self.docs.append(dict(d))

    def insert_many(self, ds):
        self.docs.extend(dict(d) for d in ds)

    def _coincide(self, d, f):
        for k, v in f.items():
            if isinstance(v, dict) and "$in" in v:
                if d.get(k) not in v["$in"]:
                    return False
            elif d.get(k) != v:
                return False
        return True

    def find(self, f=None):
        return [dict(d) for d in self.docs if self._coincide(d, f or {})]

    def count_documents(self, f):
        return len(self.find(f))

    def delete_many(self, f):
        self.docs = [d for d in self.docs if not self._coincide(d, f)]

    def update_one(self, f, cambio, upsert=False):
        for d in self.docs:
            if self._coincide(d, f):
                d.update(cambio["$set"])
                return
        if upsert:
            self.docs.append({**f, **cambio["$set"]})


class BaseFalsa:
    def __init__(self):
        self.cols = {}

    def __getitem__(self, nombre):
        return self.cols.setdefault(nombre, Coleccion())


def ejecucion(n, cargos_ok=3):
    t0 = datetime(2026, 11, 10, 12, 0, tzinfo=timezone.utc) + timedelta(hours=n)
    return {"_id": f"run{n}", "iniciado_en": t0, "finalizado_en": t0 + timedelta(minutes=2),
            "horizonte": {"inicio": 2027, "fin": 2027}, "resumen": {"cargos_ok": cargos_ok}}


def test_publicar_deja_todo_en_su_lugar():
    cargos, _ = contrato.construir(*insumos())
    base = BaseFalsa()
    pub = PublicadorMongo(base)
    pub.preparar_indices()
    assert pub.publicar(ejecucion(1), cargos) == "run1"
    docs = base["predicciones_cargo"].find({"ejecucion_id": "run1"})
    assert len(docs) == len(cargos) and {d["cargo_id"] for d in docs} == {1, 2, 3, 9}
    assert docs[0]["datos"]["id"] == docs[0]["cargo_id"]
    assert base["config"].find({"_id": "prediccion_vigente"})[0]["ejecucion_id"] == "run1"
    assert base["ejecuciones"].find({"_id": "run1"})[0]["estado"] == "OK"


def test_si_falla_se_limpia_y_el_puntero_no_cambia():
    cargos, _ = contrato.construir(*insumos())
    base = BaseFalsa()
    pub = PublicadorMongo(base)
    pub.publicar(ejecucion(1), cargos)
    original = base["predicciones_cargo"].insert_many

    def fallar(docs):
        original(docs)
        raise RuntimeError("caida de red simulada")
    base["predicciones_cargo"].insert_many = fallar
    with pytest.raises(RuntimeError):
        pub.publicar(ejecucion(2), cargos)
    assert base["predicciones_cargo"].count_documents({"ejecucion_id": "run2"}) == 0          # nada a medias
    assert base["config"].find({"_id": "prediccion_vigente"})[0]["ejecucion_id"] == "run1"     # la API sigue con la anterior
    est = base["ejecuciones"].find({"_id": "run2"})[0]
    assert est["estado"] == "ERROR" and "caida de red" in est["mensaje"]


def test_conserva_solo_las_ultimas_corridas():
    cargos, _ = contrato.construir(*insumos())
    base = BaseFalsa()
    pub = PublicadorMongo(base)
    for n in (1, 2, 3, 4):
        pub.publicar(ejecucion(n), cargos, conservar=2)
    assert sorted(d["_id"] for d in base["ejecuciones"].find({"estado": "OK"})) == ["run3", "run4"]
    assert base["predicciones_cargo"].count_documents({"ejecucion_id": "run1"}) == 0
    assert base["config"].find({"_id": "prediccion_vigente"})[0]["ejecucion_id"] == "run4"
    with pytest.raises(ValueError):
        pub.publicar(ejecucion(5), cargos, conservar=0)


def test_cargar_env_no_pisa_variables_existentes(tmp_path, monkeypatch):
    import os
    archivo = tmp_path / ".env"
    archivo.write_text('# comentario\nMONGODB_DB="mi_base"\nOTRA=valor\nYA_EXISTE=nuevo\n', encoding="utf-8")
    monkeypatch.setattr(os, "environ", {"YA_EXISTE": "original"})
    db.cargar_env(archivo)
    assert os.environ["MONGODB_DB"] == "mi_base" and os.environ["OTRA"] == "valor" and os.environ["YA_EXISTE"] == "original"


# ---------- verificacion de lo publicado ----------
from searchjobs_ml.mongo_publicador import leer_vigente, verificar  # noqa: E402


def test_verificar_confirma_lo_publicado_y_detecta_diferencias():
    cargos, _ = contrato.construir(*insumos())
    esperados = json.loads(json.dumps(cargos))                     # como queda al leer el JSON de la vista previa
    base = BaseFalsa()
    PublicadorMongo(base).publicar(ejecucion(1), cargos)
    assert verificar(base, esperados) == []
    ejec, leidos = leer_vigente(base)
    assert ejec["_id"] == "run1" and [c["posicion"] for c in leidos] == [1, 2, 3, 4]
    base["predicciones_cargo"].docs[0]["datos"]["crecimiento_estimado"] = 999.0       # alguien altera un dato
    assert any("no coincide" in p for p in verificar(base, esperados))


def test_verificar_avisa_si_no_hay_nada_publicado_o_la_corrida_no_esta_ok():
    base = BaseFalsa()
    assert "No hay prediccion vigente" in verificar(base)[0]
    cargos, _ = contrato.construir(*insumos())
    PublicadorMongo(base).publicar(ejecucion(1), cargos)
    base["ejecuciones"].docs[0]["estado"] = "ERROR"
    assert any("estado 'ERROR'" in p for p in verificar(base))