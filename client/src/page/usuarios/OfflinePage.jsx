
import { useState } from "react";
import "../../style/usuarios/offlinePage.css";
import { ListSvg } from "../../components/icons.jsx";

export default function OfflinePage({ onRetry }) {
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
                    <ListSvg name={"offline"} width={50} height={50} />
                </div>

                <span className="offline-label">
                    CONEXIÓN INTERRUMPIDA
                </span>

                <h1>
                    ¡Ups! Parece que no tienes conexión.
                </h1>

                <p className="offline-description">
                    No podemos conectarnos con SearchJobs en este momento.
                    Comprueba tu conexión a Internet e inténtalo nuevamente.
                </p>

                <button
                    className="offline-button"
                    onClick={handleRetry}
                    disabled={checking}
                >
                    {checking ? (
                        <>
                            Comprobando conexión...
                        </>
                    ) : (
                        <>
                            Reintentar conexión
                        </>
                    )}
                </button>

                <p className="offline-footer">
                    SearchJobs · Conectando oportunidades
                </p>

            </div>

        </main>
    );
}
