import { createContext, useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import Loading from "../components/Loading";

export const RoleContext = createContext(null);

export function RoleSesion({ children }) {
    const [rol, setRol] = useState("ROLE_INVITADO");
    const {data} = useFetch("/api/usuarios/rol", "GET")
    
    useEffect(()=>{
        if(!data){
            return;
        }
        setRol(data.rolPrincipal)
    },[data])

    return (
        <RoleContext.Provider value={{ rol, setRol }}>
            {children}
        </RoleContext.Provider>
    );
}
