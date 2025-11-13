import React, { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useSendForm } from "../../hooks/useFetch";
import Pagination from "../../components/Paginacion";
import "../../style/invitado/notificacionesCenter.css";
import Loading from "../../components/Loading";
import { ListSvg } from "../../components/Icons";
import { QuestionModal } from "../../services/Modal";
import Layout from "../../layouts/Layout";

const Notificaciones = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { send } = useSendForm();
  const { data, loading, error } = useFetch(`/api/notificaciones/recibidas?page=${currentPage - 1}`, "GET");
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    if (data && data.Notificaciones) {
      setNotificaciones(data.Notificaciones);
    }
  }, [data]);



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
  }


  return (
    <Layout>
      <div className="notifications-page">
        <h2 className="notifications-title">Centro de Notificaciones</h2>

        {loading && <Loading />}
        {error && <p className="notifications-error">Error: {error}</p>}

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
                    <p className="notification-sender">De: {n.nameRemitente}</p>
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
                      <ListSvg name={"basura"} height={20} width={20} />
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
