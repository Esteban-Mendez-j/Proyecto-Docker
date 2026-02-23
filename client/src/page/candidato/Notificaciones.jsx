import React, { useState, useEffect, useContext } from "react";
import { useFetchV2, useSendFormV2 } from "../../hooks/useFetch";
import Pagination from "../../components/Paginacion";
import "../../style/invitado/notificacionesCenter.css";
import Loading from "../../components/Loading";
import { ListSvg } from "../../components/Icons";
import { modalTime, QuestionModal } from "../../services/Modal";
import Layout from "../../layouts/Layout";
import { Link, useNavigate } from "react-router-dom";
import { RoleContext } from "../../services/RoleContext";
import { connect, sendMessage, subscribe } from "../../services/Websocket";
import exceptionControl from "../../services/exceptionControl"

const Notificaciones = () => {
  const { rol, logout } = useContext(RoleContext);
  const [currentPage, setCurrentPage] = useState(1);
  const { send } = useSendFormV2();
  const { data, loading, error } = useFetchV2(`/api/notificaciones/recibidas?page=${currentPage - 1}`, "GET");
  const [notificaciones, setNotificaciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setNotificaciones(data);
    }
  }, [data]);

  const sendNotificacionEvent = (evento, idNotificacion) => {
    const notifi = notificaciones.find(n => n.id === idNotificacion);

    const notificacion = {
      cuerpo: evento,
      destinatario: notifi.destinatario,
      id: idNotificacion
    }
    sendMessage("/app/enviar/evento", notificacion);
  }


  useEffect(() => {
    if (!["CANDIDATO", "EMPRESA"].includes(rol)) { return }
    connect()
    // Eventos (eliminar, marcar leído)
    subscribe("/user/queue/notificacion/evento", (msg) => {
      const evento = JSON.parse(msg.body);
      
      setNotificaciones((prev) => {
        if (evento.cuerpo === "eliminar") {
          return prev.filter((n) => n.id !== evento.id);
        }

        if (evento.cuerpo === "leida") {
          return prev.map((n) =>
            n.id === evento.id ? { ...n, estadoEnvio: "RECIBIDO" } : n
          );
        }
        return prev;
      });
    });
  }, [])


  const eliminarNotificacion = async (id) => {
    const confirmar = await QuestionModal("¿Deseas eliminar esta notificación?");
    if (!confirmar) return;

    try {
      await send(`/api/notificaciones/edit/visibilidad/${id}?visibilidad=${false}`, "PUT");
      modalTime("Notificacion Eliminada");
      setNotificaciones((prev) =>
        prev.filter((notificacion) => notificacion.id !== id)
      );
      sendNotificacionEvent("eliminar", id);
    } catch (error) {
      exceptionControl(error, logout, navigate, "Error al eliminar la notificación" );
    }

  }
 
  const marcarComoLeida = async (id) => {
    try {
      await send(`/api/notificaciones/edit/estadoEnvio/${id}`, "PUT");
      modalTime("Marcada como leida")
      setNotificaciones((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, estadoEnvio: "RECIBIDO" } : n
        )
      );
      sendNotificacionEvent("leida", id);
    } catch (error) {
      exceptionControl(error, logout, navigate, "Error al marcar como leida la notificación");
    }
  };



  return (
    <Layout>
      <div className="notifications-page">
        <h2 className="notifications-title">Centro de Notificaciones</h2>

        {loading && <Loading />}
        {error && <p className="notifications-error">Error: {error.message}</p>}

        {!loading && !error && notificaciones.length === 0 && (
          <p className="notifications-empty">No tienes notificaciones nuevas</p>
        )}

        {!loading && notificaciones.length > 0 && (
          <div className="notifications-list">
            {notificaciones.map((n) => {
              const fecha = new Date(n.fechaEnvio).toLocaleString("es-CO", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div key={n.id} className="notification-card">
                  <div className="notification-info">
                    <h4>{n.asunto}</h4>
                    <Link to={`/perfil/empresa/${n.idRemitente}`} className="notification-sender">De: {n.nameRemitente}</Link>
                    <Link to={`/empleos/${n.idVacante}`} className="notification-sender">Ver informacion de la Vacante</Link>
                    <p className="notification-message">{n.cuerpo}</p>
                    <span className="notification-date">{fecha}</span>
                  </div>

                  <div className="notification-actions">
                    {n.estadoEnvio != "RECIBIDO" &&
                      <button title="Marcar como leido" onClick={() => marcarComoLeida(n.id)}>
                        <ListSvg name={"check"} height={18} width={18} nameClass="notification-read-icon" />
                      </button>
                    }
                    <button onClick={() => eliminarNotificacion(n.id)} className="delete-btn">
                      <ListSvg name={"basura"} height={20} width={20} nameClass="notification-delete-icon" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 🔹 Paginación */}
        {data?.totalPage > 1 && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={data.totalPage}
          />
        )}
      </div>
    </Layout>
  );
};

export default Notificaciones;
