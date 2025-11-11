import React, { useState, useEffect } from "react";
import { API_CLIENT_URL } from "../services/Api";
import "../style/invitado/notificacionesCenter.css";

const Notificaciones = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Abrir o cerrar panel
  const togglePanel = () => setIsOpen(!isOpen);

  // 🔹 Obtener notificaciones desde el backend
  useEffect(() => {
    const fetchNotificaciones = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_CLIENT_URL}/api/notificaciones`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al obtener notificaciones");
        }

        const data = await response.json();
        setNotificaciones(data);
      } catch (err) {
        console.error("❌ Error al cargar notificaciones:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificaciones();
  }, []);

  // 🔹 Eliminar una notificación (backend)
  const eliminarNotificacion = async (id) => {
    const confirmar = window.confirm("¿Deseas eliminar esta notificación?");
    if (!confirmar) return;

    try {
      const response = await fetch(`${API_CLIENT_URL}/api/notificaciones/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la notificación");
      }

      // Actualizar el estado local
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
      alert("✅ Notificación eliminada correctamente");
    } catch (err) {
      console.error("Error al eliminar notificación:", err);
      alert("❌ No se pudo eliminar la notificación");
    }
  };

  return (
    <div className="notification-container">
      {/* 🔔 Botón */}
      <button className="notification-icon" onClick={togglePanel}>
        🔔
      </button>

      {/* 🧩 Panel */}
      {isOpen && (
        <div className="notification-panel">
          <h4>Notificaciones</h4>

          {loading && <p>Cargando...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && notificaciones.length === 0 && (
            <p>No tienes notificaciones nuevas</p>
          )}

          {!loading &&
            notificaciones.map((n) => (
              <div key={n.id} className="notification-item">
                <h5>{n.titulo}</h5>
                <p>{n.contenido}</p>
                <button onClick={() => eliminarNotificacion(n.id)}>Eliminar</button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Notificaciones;
