import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFetch, useSendForm } from "../hooks/useFetch.jsx"
import { connect, sendMessage, subscribe } from "../services/Websocket";
import { RoleContext } from "../services/RoleContext.jsx";
import useVisible from "../hooks/useVisible.jsx"
import Loading from "../components/Loading.jsx"
import { modalTime, QuestionModal } from "../services/Modal";
import "../style/invitado/NotificacionesCenter.css";
import { ListSvg } from "./Icons.jsx";


export default function BandejaNotificacion() {

    const { rol } = useContext(RoleContext);
    const [notificaciones, setNotificaciones] = useState(null);
    const [handleOnClick, visible] = useVisible()
    const { send } = useSendForm();
    const { data, loading, error } = useFetch("/api/notificaciones/recibidas/recientes", "GET");

    useEffect(() => {
        if (!data) { return }
        setNotificaciones(data.notificaciones)
    }, [data])

    const sendNotificacionEvent = (evento , idNotificacion) => {
        const notifi = notificaciones.find(n => n.id === idNotificacion);
        
        const notificacion = {
            cuerpo: evento,
            destinatario: notifi.destinatario,
            id:idNotificacion
        }
        sendMessage("/app/enviar/evento", notificacion);
    }

    
    const eliminarNotificacion = async (id) => {
        const confirmar = await QuestionModal("¿Deseas eliminar esta notificación?");
        if (!confirmar) return;

        const response = await send(`/api/notificaciones/edit/visibilidad/${id}?visibilidad=${false}`, "PUT")
        if (response.status == 200) {
            modalTime("Notificacion Eliminada")
            setNotificaciones((prev) =>
                prev.filter((notificacion) => notificacion.id !== id)
            );
            sendNotificacionEvent("eliminar", id)
        }

    }

    const marcarComoLeida = async (id) => {
        
        const response = await send(`/api/notificaciones/edit/estadoEnvio/${id}`, "PUT")
        if (response.status == 200) {
            setNotificaciones((prev) =>
                prev.filter((notificacion) => notificacion.id !== id)
            );
            sendNotificacionEvent("leida", id)
        }

    }


    useEffect(() => {
        if (!["CANDIDATO", "EMPRESA"].includes(rol)) { return }
        connect()

        subscribe("/user/queue/notificacion", (msg) => {
            const notificacion = JSON.parse(msg.body);
            if((["eliminar","leida"].includes(notificacion.cuerpo))){
                setNotificaciones((prev) => prev.filter((n) => n.id !== notificacion.id));
            }else{
                setNotificaciones((prev) => [...prev, notificacion]);
            }
            console.log("recibido ")
        });
    }, []);  

    return (

        <div className="notification-container">
            <button className="notification-icon" onClick={handleOnClick}>
                <ListSvg name={notificaciones?.length>0? "campanaNotificada":"campana"} height={30} width={30} />
            </button>

            {visible && (
                <div className="notification-panel">
                    <h4>Notificaciones</h4>

                    {loading && <Loading />}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <div className="notification-list">
                        {!notificaciones?.length ? (
                            <p>No tienes notificaciones nuevas</p>
                        ) : (
                            notificaciones
                                .filter(n => n.isVisible && n.estadoEnvio != "RECIBIDO")
                                .map((notificacion, index) => {
                                    const fecha = new Date(notificacion.fechaEnvio).toLocaleString('es-CO', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    });
                                    return (
                                        <div key={index} className="notification-item">
                                            <div>
                                                <h5>{notificacion.asunto}</h5>
                                                <p>{fecha}</p>
                                            </div>
                                            <div className="notification-actions">
                                                <button title="Marcar como leido" onClick={() => marcarComoLeida(notificacion.id)}>
                                                    <ListSvg name={"check"} height={18} width={18} nameClass="notification-read-icon" />
                                                </button>
                                                <button onClick={() => eliminarNotificacion(notificacion.id)}>
                                                    <ListSvg name={"basura"} height={18} width={18} nameClass="notification-delete-icon" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                        )}
                    </div>
                    <Link className="notificaciones-link" to={"/notificaciones"}>Ver mas</Link>
                </div>
            )}
        </div>
    );
}