
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Literal
from pyomo.environ import *

app = FastAPI()

class Vacancy(BaseModel):
    id: int
    tipo: Literal["Vacante", "Practica"]  # ⭐ NUEVO: Necesario para saber en qué variable asignarlo
    compatibility: float
    salary: float
    days: int
    postulations: int

class OptimizationRequest(BaseModel):
    vacancies: List[Vacancy]

@app.post("/optimize")
async def optimize(request: OptimizationRequest):

    model = ConcreteModel()

    # 1. SEPARAR CONJUNTOS POR TIPO
    vacantes_ids = [v.id for v in request.vacancies if v.tipo == "Vacante"]
    practicas_ids = [v.id for v in request.vacancies if v.tipo == "Practica"]

    model.V1 = Set(initialize=vacantes_ids)   # Conjunto de Vacantes
    model.V2 = Set(initialize=practicas_ids)  # Conjunto de Prácticas

    # 2. DOS VARIABLES BINARIAS INDEPENDIENTES
    model.x1 = Var(model.V1, domain=Binary)   # X1 para Vacantes
    model.x2 = Var(model.V2, domain=Binary)   # X2 para Prácticas

    # Mapeo general para buscar datos rápido
    data_map = {v.id: v for v in request.vacancies}

    # 3. FUNCIÓN OBJETIVO (Compatibilidad pura, sumando ambas variables)
    def objective_rule(model):
        obj_vacantes = sum(data_map[i].compatibility * model.x1[i] for i in model.V1)
        obj_practicas = sum(data_map[j].compatibility * model.x2[j] for j in model.V2)
        return obj_vacantes + obj_practicas

    model.objective = Objective(rule=objective_rule, sense=maximize)

    # =========================================================
    # 4. RESTRICCIONES PARA VACANTES (Variable X1)
    # =========================================================
    def salary_v1_rule(model, i):
        return data_map[i].salary * model.x1[i] >= 1750905 * model.x1[i]
    model.salary_v1_const = Constraint(model.V1, rule=salary_v1_rule)

    def days_v1_rule(model, i):
        return data_map[i].days * model.x1[i] <= 1000 * model.x1[i]
    model.days_v1_const = Constraint(model.V1, rule=days_v1_rule)

    def post_v1_rule(model, i):
        return data_map[i].postulations * model.x1[i] <= 10 * model.x1[i]
    model.post_v1_const = Constraint(model.V1, rule=post_v1_rule)

    def comp_v1_rule(model, i):
        return data_map[i].compatibility * model.x1[i] >= 0.6 * model.x1[i]
    model.comp_v1_const = Constraint(model.V1, rule=comp_v1_rule)

    # =========================================================
    # 5. RESTRICCIONES PARA PRÁCTICAS (Variable X2)
    # =========================================================
    # Ajusta el valor del salario mínimo para prácticas si aplica (dejé >= 0 por defecto)
    def salary_v2_rule(model, j):
        return data_map[j].salary * model.x2[j] >= 0 * model.x2[j] 
    model.salary_v2_const = Constraint(model.V2, rule=salary_v2_rule)

    def days_v2_rule(model, j):
        return data_map[j].days * model.x2[j] <= 1000 * model.x2[j]
    model.days_v2_const = Constraint(model.V2, rule=days_v2_rule)

    def post_v2_rule(model, j):
        return data_map[j].postulations * model.x2[j] <= 10 * model.x2[j]
    model.post_v2_const = Constraint(model.V2, rule=post_v2_rule)

    def comp_v2_rule(model, j):
        return data_map[j].compatibility * model.x2[j] >= 0.6 * model.x2[j]
    model.comp_v2_const = Constraint(model.V2, rule=comp_v2_rule)

    # =========================================================
    # 6. CAPACIDAD DEL SISTEMA (Ambas variables suman <= 200)
    # =========================================================
    def max_rec_rule(model):
        return sum(model.x1[i] for i in model.V1) + sum(model.x2[j] for j in model.V2) <= 200
    model.max_recommendations = Constraint(rule=max_rec_rule)

    # =========================================================
    # SOLVER Y PROCESAMIENTO DE RESPUESTA
    # =========================================================
    solver = SolverFactory("highs")
    solver.solve(model, tee=False)

    optimos = []
    no_optimos = []

    for v in request.vacancies:
        v_data = v.model_dump()
        is_selected = False
        
        # Validamos en qué variable buscar según el tipo
        if v.tipo == "Vacante" and v.id in model.V1:
            if model.x1[v.id].value is not None and model.x1[v.id].value > 0.5:
                is_selected = True
        elif v.tipo == "Practica" and v.id in model.V2:
            if model.x2[v.id].value is not None and model.x2[v.id].value > 0.5:
                is_selected = True

        v_data["is_optimized"] = is_selected
        
        if is_selected:
            optimos.append(v_data)
        else:
            no_optimos.append(v_data)

    #  Ordenamos los óptimos por compatibilidad (mayor a menor)
    optimos.sort(key=lambda x: x['compatibility'], reverse=True)

    no_optimos.sort(key=lambda x: x['compatibility'], reverse=True)
    
    # listas están ordenadas 
    resultados_totales = optimos + no_optimos

    return {
        "status": "Optimo",
        "vacantes_recomendadas": resultados_totales
    }