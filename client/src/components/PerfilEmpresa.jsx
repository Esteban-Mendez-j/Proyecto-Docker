import { URL_IMAGEN } from "../services/Api";
import { ListSvg } from "./Icons";
import { Link } from "react-router-dom";
import "../style/invitado/empresa.css";

export default function PerfilEmpresa({ empresa, isPublic }){

    return(
        <div className="empresa-perfil-container">
        <div className="empresa-perfil">
          {/* Cabecera del perfil */}
            <div className="empresa-perfil-header">
                {/* Logo */}
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

                {/* Info encabezado */}
                <div className="empresa-header-info">
                    <h1 className="empresa-nombre">{empresa.nombre}</h1>
                    <p className="empresa-sector">{empresa.sectorEmpresarial}</p>
                </div>

                {!isPublic &&
                    <Link to="/perfil/empresa/editar" className="empresa-edit-button">
                        <ListSvg name={"editar"} width={16} height={16} />
                        Editar
                    </Link>
                }
            </div>

          {/* Contenido */}
          <div className="empresa-perfil-content">
            {/* Información de contacto */}
            <div className="empresa-info-grid">
              <div className="empresa-info-item">
                <ListSvg name={"calendario"} height={16} width={16} />
                <div className="empresa-info-content">
                  <span className="empresa-info-label">NIT</span>
                  <span className="empresa-info-value">{empresa.nit
                    ? `${empresa.nit.slice(0, -1)}-${empresa.nit.slice(-1)}`
                    : "No registrado"}</span>
                </div>
              </div>

              <div className="empresa-info-item">
                <ListSvg name={"correo"} height={16} width={16} />
                <div className="empresa-info-content">
                  <span className="empresa-info-label">Correo</span>
                  <span className="empresa-info-value">{empresa.correo || "No registrado"}</span>
                </div>
              </div>

              <div className="empresa-info-item">
                <ListSvg name={"telefono"} height={16} width={16} />
                <div className="empresa-info-content">
                  <span className="empresa-info-label">Teléfono</span>
                  <span className="empresa-info-value">
                    {empresa.telefono || "No registrado"}
                  </span>
                </div>
              </div>

              <div className="empresa-info-item">
                <ListSvg name={"mundoInternet"} height={16} width={16} />
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

            {/* Sección Video de Presentación */}
            <div className="empresa-info-item">
              <ListSvg name={"video"} height={16} width={16} />

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

            {/* Sección descripción */}
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
    )
}