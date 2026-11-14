
import json
import os
import urllib.request
import urllib.error

def notificar_nueva_prediccion(ejecucion_id: str, anio_predicho: int) -> bool:
    url = os.getenv("SEARCHJOBS_NOTIFICATION_URL")
    secreto = os.getenv("SEARCHJOBS_NOTIFICATION_SECRET")

    if not url or not secreto:
        print("AVISO: No se notificó a Java. Faltan variables de entorno.")
        return False

    payload = {
        "tipo": "NUEVA_PREDICCION",
        "ejecucionId": ejecucion_id,
        "anioPredicho": anio_predicho
    }

    datos = json.dumps(payload).encode("utf-8")

    request = urllib.request.Request(
        url,
        data=datos,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Internal-Secret": secreto
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            cuerpo = response.read().decode("utf-8", errors="replace")

            print(f"Respuesta de Java: HTTP {response.status}")
            print(f"Cuerpo de respuesta: {cuerpo}")

            return 200 <= response.status < 300

    except urllib.error.HTTPError as e:
        cuerpo = e.read().decode("utf-8", errors="replace")

        print(f"ERROR HTTP: {e.code}")
        print(f"Respuesta de Spring Boot: {cuerpo}")

        return False

    except (urllib.error.URLError, TimeoutError) as e:
        print(f"AVISO: No se pudo comunicar la predicción a Java: {e}")
        return False
