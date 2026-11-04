
import { createContext, useContext, useEffect, useState } from "react";
import { API_CLIENT_URL } from "../services/Api.js";
import OfflinePage from "../page/usuarios/OfflinePage.jsx";

const ConnectionContext = createContext(null);

export function ConnectionProvider({ children }) {

    const [isOnline, setIsOnline] = useState(
        () => navigator.onLine
    );

    useEffect(() => {

        function handleOnline() {
            setIsOnline(true);
        }

        function handleOffline() {
            setIsOnline(false);
        }

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };

    }, []);

    // Comprueba si el backend vuelve a responder.
    async function retryConnection() {

        try {
            const response = await fetch(
                `${API_CLIENT_URL}/api/usuarios/rol`,
                {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store"
                }
            );

            // Cualquier respuesta HTTP indica que el servidor respondió.
            setIsOnline(true);

        } catch (error) {
            setIsOnline(false);
        }
    }

    return (
        <ConnectionContext.Provider
            value={{ isOnline, setIsOnline, retryConnection }}
        >
            {isOnline ? children : <OfflinePage onRetry={retryConnection} />}
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
