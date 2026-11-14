
import { createContext, useContext, useEffect, useState } from "react";
import { API_CLIENT_URL } from "../services/Api.js";
import OfflinePage from "../page/usuarios/OfflinePage.jsx";


const ConnectionContext = createContext(null);

export function ConnectionProvider({ children }) {

    const [isInternetOnline, setIsInternetOnline] = useState(
        () => navigator.onLine
    );

    const [isBackendOnline, setIsBackendOnline] = useState(true);

    useEffect(() => {

        function handleOnline() {
            setIsInternetOnline(true);
            retryConnection();
        }

        function handleOffline() {
            setIsInternetOnline(false);
        }

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Comprobar el backend al iniciar la aplicación.
        retryConnection();

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };

    }, []);

    // Comprueba si el backend responde.
    async function retryConnection() {

        if (!navigator.onLine) {
            setIsInternetOnline(false);
            return false;
        }

        try {
            const controller = new AbortController();

            const timeout = setTimeout(() => {
                controller.abort();
            }, 8000);

            try {
                const response = await fetch(
                    `${API_CLIENT_URL}/api/usuarios/rol`,
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                        signal: controller.signal
                    }
                );

                // Cualquier respuesta HTTP significa que
                // conseguimos comunicarnos con el servidor.
                setIsBackendOnline(true);
                setIsInternetOnline(true);

                return true;

            } finally {
                clearTimeout(timeout);
            }

        } catch (error) {

            setIsBackendOnline(false);

            // No asumir que se perdió Internet.
            setIsInternetOnline(navigator.onLine);

            return false;
        }
    }

    return (
        <ConnectionContext.Provider
            value={{
                isInternetOnline,
                isBackendOnline,
                retryConnection
            }}
        >
            {!isInternetOnline ? (
                <OfflinePage
                    onRetry={retryConnection}
                    type="internet"
                />
            ) : !isBackendOnline ? (
                <OfflinePage
                    onRetry={retryConnection}
                    type="backend"
                />
            ) : (
                children
            )}
        </ConnectionContext.Provider>
    );
}

export function useConnection() {

    const context = useContext(ConnectionContext);

    if (!context) {
        throw new Error(
            "useConnection debe utilizarse dentro de ConnectionProvider"
        );
    }

    return context;
}