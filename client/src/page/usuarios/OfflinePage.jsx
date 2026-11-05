import { useState } from "react";
import "../../style/usuarios/offlinePage.css";
import { ListSvg } from "../../components/icons.jsx";

export default function OfflinePage({ onRetry, type }) {

    const isInternetError = type === "internet";
    const [checking, setChecking] = useState(false);

    async function handleRetry() {
        setChecking(true);

        try {
            await onRetry();
        } finally {
            setChecking(false);
        }
    }

    return (
        <main className="offline-container">

            <div className="offline-card">

                <div className="offline-icon">
                    {isInternetError
                        ? <ListSvg name={"offline"} width={50} height={50} />
                        : <ListSvg name={"error"} width={50} height={50} />
                    }
                </div>

                <span className="offline-label">
                    {isInternetError
                        ? "Sin conexión a Internet"
                        : "Servidor no disponible"}
                </span>

                <h1>
                    {isInternetError
                        ? "¡Ups! Parece que perdiste la conexión."
                        : "¡Ups! No podemos conectar con SearchJobs."}
                </h1>

                <p className="offline-description">
                    {isInternetError
                        ? "No detectamos una conexión a Internet. Comprueba tu conexión e inténtalo nuevamente."
                        : "No podemos comunicarnos con nuestros servidores en este momento. Inténtalo nuevamente más tarde."}
                </p>

                <button
                    className="offline-button"
                    onClick={handleRetry}
                    disabled={checking}
                >
                    {checking
                        ? "Comprobando conexión..."
                        : "Reintentar conexión"}
                </button>

                <p className="offline-footer">
                    SeedJobs · Conectando oportunidades
                </p>

            </div>

        </main>
    );
}