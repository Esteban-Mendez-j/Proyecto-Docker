# Proyecto de Plataforma de Empleo

Este proyecto es una plataforma de empleo desarrollada con un **frontend en React**, un **backend en Spring Boot**, y se ejecuta con **Docker Compose** para facilitar la configuración del entorno.


## 🚀 Requisitos

- Docker
- Docker Compose
- Node.js (solo si deseas correr React localmente fuera de Docker)
- Java 17 o superior (solo si deseas correr Spring Boot localmente)

---

## 🔧 Comandos útiles

### 🐳 Docker Compose

> Ejecutar todo el entorno con un solo comando

```
docker-compose up --build -d
```
>Detener todos los contenedores
```
docker-compose down
```
>Ver logs de todos los servicios

```
docker-compose logs -f
```
>Acceder a un contenedor específico (por ejemplo, al backend)

```
docker exec -it nombre_contenedor_backend bash
```



### 🐍 Configuración del Módulo de Optimización (FastAPI + Pyomo)

Sigue estos pasos en la terminal para activar el entorno virtual e instalar las dependencias matemáticas (Pyomo y el solucionador HiGHS):

```bash
# 1. Navegar a la carpeta del módulo de Python
cd optimizer-api

# 2. Crear el entorno virtual (venv)
# En Windows:
python -m venv venv
# En macOS/Linux:
python3 -m venv venv

# 3. Activar el entorno virtual
# En Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# En Windows (CMD):
.\venv\Scripts\activate.bat
# En macOS/Linux:
source venv/bin/activate

# 4. Instalar las dependencias base del proyecto (FastAPI, Pyomo, etc.)
pip install -r requirements.txt

# 5. Instalar y enlazar el solucionador matemático HiGHS
pip install highspy

# 6. Ejecutar el servidor de desarrollo
uvicorn main:app --reload