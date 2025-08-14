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
docker-compose up --build
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

