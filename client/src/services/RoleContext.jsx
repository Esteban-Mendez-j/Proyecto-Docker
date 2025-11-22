import { createContext, useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch.jsx";
import { modalResponse } from "./Modal";
import { API_CLIENT_URL } from "./Api";

export const RoleContext = createContext(null);

export function RoleSesion({ children }) {
    const [rol, setRol] = useState(null);
    const {data, loading, error} = useFetch("/api/usuarios/rol", "GET");
    
    async function logout (mensaje) {
        const res = await modalResponse(mensaje, "error");
        if(res){
            window.location.href = `${API_CLIENT_URL}/usuarios/cerrarSesion`;
            return;
        }
    }

    useEffect(()=>{
        if(error){
            logout(error);
        }
        if(!data){
            return;
        }
        setRol(data.rolPrincipal)
    },[data, error])

    return (
        <RoleContext.Provider value={{ rol, setRol, loading, error}}>
            {children}
        </RoleContext.Provider>
    );
}
