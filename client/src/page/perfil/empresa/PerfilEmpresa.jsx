import { useEffect, useState } from "react";
import Layout from "../../../layouts/Layout.jsx";
import { API_CLIENT_URL } from "../../../services/Api";
import { manejarRespuesta } from "../../../services/ManejarRespuesta.js";
import "../../../style/invitado/empresa.css";
import { Link } from "react-router-dom";

const PerfilEmpresa = () => {
  
  const [empresa, setEmpresa] = useState({});

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const apiUrl = `${API_CLIENT_URL}/api/empresas/perfil`;
        const res = await fetch(apiUrl, { 
          headers: { "Content-Type": "application/json" } , 
          credentials: "include"
        });
        const data = await manejarRespuesta(res);
        setEmpresa(data.empresa || {});
      } catch (error) {
        console.error("Error al cargar perfil de empresa:", error);
      }
    };
   
    fetchEmpresa();
  }, []);

  return (
    <Layout >
      

      <div className="empresa-perfil-container">
        <div className="empresa-perfil">
          {/* Cabecera del perfil */}
          <div className="empresa-perfil-header">
            {/* Logo */}
            <div className="empresa-logo-container">
              <img
                src={
                  empresa.imagen
                    ? `${API_CLIENT_URL}/img/${empresa.imagen}`
                    : `${API_CLIENT_URL}/images/imgEmpresa.png`
                }
                alt={empresa.nombre}
                className="empresa-logo"
              />
            </div>

            {/* Info encabezado */}
            <div className="empresa-header-info">
              <h1 className="empresa-nombre">{empresa.nombre}</h1>
              <p className="empresa-sector">{empresa.sectorEmpresarial}</p>
            </div>

            <Link to="/perfil/empresa/editar" className="empresa-edit-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Editar
            </Link>
          </div>

          {/* Contenido */}
          <div className="empresa-perfil-content">
            {/* Información de contacto */}
            <div className="empresa-info-grid">
              <div className="empresa-info-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <div className="empresa-info-content">
                  <span className="empresa-info-label">NIT</span>
                  <span className="empresa-info-value">{empresa.nit}</span>
                </div>
              </div>

              <div className="empresa-info-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div className="empresa-info-content">
                  <span className="empresa-info-label">Correo</span>
                  <span className="empresa-info-value">{empresa.correo}</span>
                </div>
              </div>

              <div className="empresa-info-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
                      {empresa.sitioWeb}
                    </a>
                  ) : (
                    <span>No registrado</span>
                  )}
                </div>
              </div>
            </div>

            {/* Sección descripción */}
            <div className="empresa-descripcion-section">
              <h2 className="empresa-section-title">Descripción</h2>
              <p className="empresa-descripcion">
                {empresa.descripcion || "No registrada"}
              </p>
            </div>
          </div>
        </div>
      </div>

      
    </Layout>
  );
};

export default PerfilEmpresa;
