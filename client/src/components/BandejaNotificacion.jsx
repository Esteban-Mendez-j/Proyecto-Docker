import { useContext, useEffect, useState } from "react";
import {useFetch} from "../hooks/useFetch"
import { connect, subscribe } from "../services/Websocket";
import { RoleContext } from "../services/RoleContext";

export default function BandejaNotificacion (){

    const {rol} = useContext(RoleContext);
    const [notificaciones, setNotificaciones] = useState(null);

    const {data} = useFetch("/api/notificaciones/recibidas/recientes", "GET");
 
    useEffect(()=>{
        if(!data ){return}

        setNotificaciones(data.notificaciones)
    }, [data])


    useEffect(() => {
        if(!["CANDIDATO", "EMPRESA"].includes(rol)){return}
        connect()
        subscribe("/user/queue/notificacion", (msg) => {
            const notificacion = JSON.parse(msg.body);
            setNotificaciones((prev) => [...prev, notificacion]);
        });
    
    }, [])

    return (
        <>
            {notificaciones?.map((notificacion, index) => {
                return (
                    <div key={index} className="p-2 border-b">
                        <h1 className="font-semibold">{notificacion.asunto}</h1>
                        <h2 className="text-sm text-gray-600">{notificacion.fechaEnvio}</h2>
                    </div>
                );
            })}
        </>
    );
}