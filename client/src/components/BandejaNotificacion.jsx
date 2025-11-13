import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFetch, useSendForm } from "../hooks/useFetch"
import { connect, subscribe } from "../services/Websocket";
import { RoleContext } from "../services/RoleContext";
import useVisible from "../hooks/useVisible"
import Loading from "../components/Loading"
import { modalTime, QuestionModal } from "../services/Modal";
import "../style/invitado/notificacionesCenter.css";
import { ListSvg } from "./Icons";


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

    
    const eliminarNotificacion = async (id) => {
        const confirmar = await QuestionModal("¿Deseas eliminar esta notificación?");
        if (!confirmar) return;

        const response = await send(`/api/notificaciones/edit/visibilidad/${id}?visibilidad=${false}`, "PUT")
        if (response.status == 200) {
            modalTime("Notificacion Eliminada")
            setNotificaciones((prev) =>
                prev.filter((notificacion) => notificacion.id !== id)
            );
        }

    }

    const marcarComoLeida = async (id) => {
        
        const response = await send(`/api/notificaciones/edit/estadoEnvio/${id}`, "PUT")
        if (response.status == 200) {
            setNotificaciones((prev) =>
                prev.filter((notificacion) => notificacion.id !== id)
            );
        }

    }


    useEffect(() => {
        if (!["CANDIDATO", "EMPRESA"].includes(rol)) { return }
        connect()
        subscribe("/user/queue/notificacion", (msg) => {
            const notificacion = JSON.parse(msg.body);
            setNotificaciones((prev) => [...prev, notificacion]);
        });

    }, [])

    return (

        <div className="notification-container">
            <button className="notification-icon" onClick={handleOnClick}>
                <ListSvg name={"campana"} height={30} width={30} />
            </button>

            {visible && (
                <div className="notification-panel">
                    <h4>Notificaciones</h4>

                    {loading && <Loading />}
                    {error && <p style={{ color: "red" }}>{error}</p>}

                    {!notificaciones?.length ? (
                        <p>No tienes notificaciones nuevas</p>
                    ) : (
                        notificaciones
                            .filter(n => n.isVisible)
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
                    <Link className="notificaciones-link" to={"/notificaciones"}>Ver mas</Link>
                </div>
            )}
        </div>
    );
}