import { createContext, useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import Loading from "../components/Loading";

export const RoleContext = createContext(null);

export function RoleSesion({ children }) {
    const [rol, setRol] = useState(null);
    const {data, loading} = useFetch("/api/usuarios/rol", "GET")
    
    useEffect(()=>{
        if(!data){
            return;
        }
        setRol(data.rolPrincipal)
    },[data])

    return (
        <RoleContext.Provider value={{ rol, setRol, loading }}>
            {children}
        </RoleContext.Provider>
    );
}
