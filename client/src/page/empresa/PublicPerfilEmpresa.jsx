import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Para capturar `id` de la ruta
import Layout from "../../layouts/Layout";
import { API_CLIENT_URL, URL_IMAGEN } from "../../services/Api";
import { manejarRespuesta } from "../../services/ManejarRespuesta";
import "../../style/invitado/empresa.css";

export default function EmpresaPerfil() {
  const { id } = useParams();
  const [empresa, setEmpresa] = useState({});

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const apiUrl = `${API_CLIENT_URL}/api/empresas/perfil?idUsuario=${id}`;
        const res = await fetch(apiUrl, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await manejarRespuesta(res);
        setEmpresa(data.empresa || {});
      } catch (error) {
        console.error("Error al cargar el perfil de la empresa:", error);
      }
    };

    fetchEmpresa();
  }, [id]);

  return (
    <Layout>
      <div className="empresa-perfil-container">

        <div className="empresa-perfil">
          {/* Cabecera del perfil */}
          <div className="empresa-perfil-header">
            {/* Logo de la empresa */}
            <div className="empresa-logo-container">
              <img
                src={
                  empresa.imagen
                    ? `${URL_IMAGEN}${empresa.imagen}`
                    : `/imgEmpresa.png`
                }
                alt={empresa.nombre}
                className="empresa-logo"
              />
            </div>

            {/* Información del encabezado */}
            <div className="empresa-header-info">
              <h1 className="empresa-nombre">{empresa.nombre}</h1>
              <p className="empresa-sector">{empresa.sectorEmpresarial}</p>
            </div>
          </div>

          {/* Contenido del perfil */}
          <div className="empresa-perfil-content">
            {/* Información de contacto */}
            <div className="empresa-info-grid">
              <div className="empresa-info-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <div className="empresa-info-content">
                  <span className="empresa-info-label">NIT</span>
                  <span className="empresa-info-value">{empresa.nit
                    ? `${empresa.nit.slice(0, -1)}-${empresa.nit.slice(-1)}`
                    : "No registrado"}</span>
                </div>
              </div>

              <div className="empresa-info-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div className="empresa-info-content">
                  <span className="empresa-info-label">Correo</span>
                  <span className="empresa-info-value">{empresa.correo}</span>
                </div>
              </div>

              <div className="empresa-info-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div className="empresa-info-content">
                  <span className="empresa-info-label">Teléfono</span>
                  <span className="empresa-info-value">
                    {empresa.telefono || "No registrado"}
                  </span>
                </div>
              </div>

              <div className="empresa-info-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <div className="empresa-info-content">
                  <span className="empresa-info-label">Sitio Web</span>
                  {empresa.sitioWeb ? (
                    <a
                      href={`https://${empresa.sitioWeb}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="empresa-info-link"
                    >
                      {empresa.sitioWeb || "No registrado"}
                    </a>
                  ) : (
                    <span>No registrado</span>
                  )}
                </div>
              </div>
            </div>
            {/* Sección Video de Presentación */}
            <div className="empresa-info-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
              </svg>

              <div className="empresa-info-content">
                <h2 className="mb-2 text-lg font-semibold">Video de Presentación</h2>

                {empresa.videoLink ? (
                  <a
                    href={empresa.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border rounded-xl shadow-sm hover:shadow-md transition -ml-5"

                  >
                    🎥 Video de presentación de la empresa

                  </a>
                ) : (
                  <p className="italic text-gray-500">la empresa aún no ha agregado un video de presentación.</p>
                )}
              </div>
            </div>

            {/* Sección de descripción */}
            <div className="empresa-descripcion-section">
              <h2 className="empresa-section-title">Descripción</h2>
              <p className="empresa-descripcion">
                {empresa.descripcion || "No registrada"}
              </p>
            </div>

            <div className="empresa-estadisticas">
              <h2 className="empresa-section-title">Estadísticas</h2>

              <div className="estadisticas-cards-simple">
                <div className="estadistica-card-simple">
                  <p className="estadistica-number-simple">{empresa.numeroVacantes}</p>
                  <p className="estadistica-label-simple">Vacantes totales</p>
                </div>

                <div className="estadistica-card-simple">
                  <p className="estadistica-number-simple">{empresa.numeroVacantesActivas}</p>
                  <p className="estadistica-label-simple">Vacantes Activas</p>
                </div>

                <div className="estadistica-card-simple">
                  <p className="estadistica-number-simple">{empresa.porcentajeAceptacion}%</p>
                  <p className="estadistica-label-simple">Aceptación</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
