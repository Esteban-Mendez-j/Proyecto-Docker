from pyexpat import model

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from pyomo.environ import *

app = FastAPI()


class Vacancy(BaseModel):
    id: int
    compatibility: float
    salary: float
    days: int
    postulations: int


class OptimizationRequest(BaseModel):
    vacancies: List[Vacancy]


@app.post("/optimize")
async def optimize(request: OptimizationRequest):  # 1. Agregado 'async' para evitar conflictos de hilos

    model = ConcreteModel()

    vacancy_ids = [v.id for v in request.vacancies]
    model.V = Set(initialize=vacancy_ids)

    model.x = Var(model.V, domain=Binary)

    vacancy_map = {v.id: v for v in request.vacancies}

    # FUNCIÓN OBJETIVO
    def objective_rule(model):
        return sum(
            (
                0.6 * vacancy_map[i].compatibility
                + 0.2 * vacancy_map[i].salary
                - 0.1 * vacancy_map[i].days
                - 0.1 * vacancy_map[i].postulations
            ) * model.x[i]
            for i in model.V
        )

    model.objective = Objective(
        rule=objective_rule,
        sense=maximize
    )

    # RESTRICCIÓN COMPATIBILIDAD
    def compatibility_rule(model, i):
        if vacancy_map[i].compatibility < 0.6:
            return model.x[i] == 0
        return Constraint.Skip

    model.compatibility_constraint = Constraint(
        model.V,
        rule=compatibility_rule
    )

    # RESTRICCIÓN DÍAS
    def days_rule(model, i):
        if vacancy_map[i].days > 1000:
            return model.x[i] == 0
        return Constraint.Skip

    model.days_constraint = Constraint(
        model.V,
        rule=days_rule
    )

    # RESTRICCIÓN POSTULACIONES
    def postulation_rule(model, i):
        if vacancy_map[i].postulations > 10:
            return model.x[i] == 0
        return Constraint.Skip

    model.postulation_constraint = Constraint(
        model.V,
        rule=postulation_rule
    )

    # MÁXIMO DE RECOMENDACIONES
    model.max_recommendations = Constraint(
        expr=sum(model.x[i] for i in model.V) <= 200
    )

    # SOLVER
    solver = SolverFactory("highs")
    # 2. 'tee=False' evita que Pyomo intente duplicar los streams de la consola de HiGHS
    solver.solve(model, tee=False)

    optimos = []
    no_optimos = []

    # Clasificamos las vacantes en dos grupos
    for i in model.V:
        vacancy_data = vacancy_map[i].model_dump()
        
        if model.x[i].value is not None and model.x[i].value > 0.5:
            vacancy_data["is_optimized"] = True  # ⭐ Marcamos como recomendada
            optimos.append(vacancy_data)
        else:
            vacancy_data["is_optimized"] = False # ⭐ Marcamos como normal
            no_optimos.append(vacancy_data)

    no_optimos.sort(key=lambda v: v['compatibility'], reverse=True)
    resultados_totales = optimos + no_optimos

    return {
        "status": "Optimo",
        "vacantes_recomendadas": resultados_totales
    }