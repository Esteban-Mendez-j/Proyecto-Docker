import { createContext, useState, useEffect } from "react";
import { useFetchV2, useSendFormV2 } from "../hooks/useFetch";
import { modalResponse } from "./Modal";
import { API_CLIENT_URL } from "./Api";

export const RoleContext = createContext(null);

export function RoleSesion({ children }) {
    const [rol, setRol] = useState(null);
    const [userDataSession, setUserDataSession] = useState();
    const { data, loading, error} = useFetchV2("/api/usuarios/rol", "GET");
    const { send } = useSendFormV2();
    
    async function logout (mensaje) {
        const res = await modalResponse(mensaje, "info");
        if(res){
            window.location.href = `${API_CLIENT_URL}/usuarios/cerrarSesion`;
            return;
        }
    }

    async function peticion() {
        try {
            const dataSession = await send("/api/usuarios/datos", "GET");
            setUserDataSession(dataSession.data);
        } catch (error) {
            if( error.code === "EXPIRED_TOKEN" ) logout(error.message); 
        }
    }

    useEffect(() =>{
        peticion()
    },[ rol ])

    useEffect(()=>{
        if( !data ){ return; }
        setRol(data.rolPrincipal);
    },[ data ])
    
    useEffect(()=>{
        if(!error) return
        if( error.code === "EXPIRED_TOKEN" ){ logout(error.message); }
    },[error])

    return (
        <RoleContext.Provider value={{ rol, setRol, loading, error, userDataSession, logout}}>
            {children}
        </RoleContext.Provider>
    );
}
