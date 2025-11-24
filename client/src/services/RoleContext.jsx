import { createContext, useState, useEffect } from "react";
import { useFetch, useSendForm } from "../hooks/useFetch.jsx";
import { modalResponse } from "./Modal";
export const RoleContext = createContext(null);

export function RoleSesion({ children }) {
    const [rol, setRol] = useState(null);
    const {data, loading, error} = useFetch("/api/usuarios/rol", "GET");
    const {send} = useSendForm();

    async function logout(mensaje, type) {
        const res = await modalResponse(mensaje, type);
        if (res) {
            const resultado = await send("/api/usuarios/cerrarSesion", "POST");
            if (resultado.ok) {
                window.location.href = "/login";
            } else {
                console.error("Error al cerrar sesión");
                window.location.href = "/login"; // opcionalmente siempre redirigir
            }
        }
    }

    useEffect(()=>{
        if(error){
            logout(error, "error");
        }
        if(!data){
            return;
        }
        setRol(data.rolPrincipal)
    },[data, error])

    return (
        <RoleContext.Provider value={{ rol, setRol, loading, error, logout}}>
            {children}
        </RoleContext.Provider>
    );
}
