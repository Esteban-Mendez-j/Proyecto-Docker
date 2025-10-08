import { useEffect, useState } from "react";
import Layout from "../../layouts/Layout.jsx";
import { API_CLIENT_URL } from "../../services/Api.js";
import "../../style/invitado/candidato.css";
import { useFetch } from "../../hooks/useFetch.jsx";
import Loading from "../../components/Loading.jsx"
import { modal } from "../../services/Modal.js";

function PerfilCandidato() {
  const initialData = {
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    telefono: "",
    identificacion: "",
    contraseñaVerificada: ""
  }

  const [candidato, setCandidato] = useState(null);
  const [estudios, setEstudios] = useState([]);
  const [historialLaboral, setHistorialLaboral] = useState([]);
  const { data , error , loading } = useFetch("/api/candidatos/perfil", "GET");

  useEffect(() => {

    if(!data){return}
    setCandidato(data.candidato);
    setEstudios(data.estudios || []);
    setHistorialLaboral(data.historialLaboral || []);

  }, [data, error]);

  if (!data || !candidato || !estudios || !historialLaboral || loading || error) {
    return <Loading/>;
  }

  return (
    <Layout>
      

      <div className="candidato-perfil-container">
        <div className="candidato-perfil">
          {/* Cabecera */}
          <div className="candidato-perfil-header">
            {/* Imagen */}
            <div className="candidato-imagen-container">
              <img
                src={
                  candidato.imagen
                    ? `${API_CLIENT_URL}/img/${candidato.imagen}`
                    : `${API_CLIENT_URL}/images/imgCandidato.png`
                }
                alt={`${candidato.nombre} ${candidato.apellido}`}
                className="h-32 w-32 object-cover shadow"
              />
            </div>

            {/* Información */}
            <div className="candidato-header-info">
              <h1 className="candidato-nombre">
                {candidato.nombre} {candidato.apellido}
              </h1>
              <p className="candidato-cargo">
                {candidato.experiencia
                  ? `${candidato.experiencia > 1?"año":"años"} laborando`
                  : ""}
              </p>
            </div>

            {/* Botones */}
            <div className="candidato-header-actions">
              <a
                href="/perfil/candidato/editar"
                id="editProfileBtn"
                className="candidato-edit-button"
              >
                {/* SVG edit */}
                Editar perfil
              </a>
              <a
                href={
                  candidato.curriculo
                    ? `${API_CLIENT_URL}/pdf/${candidato.curriculo}`
                    : "#"
                }
                className={
                  "candidato-cv-button " +
                  (!candidato.curriculo
                    ? "pointer-events-none opacity-50"
                    : "")
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* SVG cv */}
                Ver CV
              </a>
            </div>
          </div>

          {/* Contenido */}
          <div className="candidato-perfil-content">
            {/* Contacto */}
            <div className="candidato-info-grid">
              <div className="candidato-info-item">
                <span className="candidato-info-label">Correo</span>
                <span className="candidato-info-value">
                  {candidato.correo}
                </span>
              </div>

              <div className="candidato-info-item">
                <span className="candidato-info-label">Teléfono</span>
                <span className="candidato-info-value">
                  {candidato.telefono}
                </span>
              </div>
            </div>

            {/* Descripción */}
            <div className="candidato-section">
              <h2 className="candidato-section-title">Descripción</h2>
              <p className="candidato-descripcion">{candidato.descripcion}</p>
            </div>

            {/* Estudios */}
            <section className="mb-6 pb-6 border-b border-[var(--border)]">
              <h2 className="text-[1.125rem] font-semibold text-[var(--text)] mb-4 pl-4 relative flex items-center">
                <span className="absolute left-0 top-1 h-4/5 w-1 bg-[var(--gradient-primary)] rounded"></span>
                Estudios
              </h2>
              <div className="space-y-6 mt-4">
                {estudios.map((estudio, index) => (
                  <div
                    key={index}
                    className="relative pl-6 border-l-2 border-[var(--border)] pb-4"
                  >
                    <div className="absolute -left-[0.4rem] top-0 w-3 h-3 bg-[var(--primary)] rounded-full border-2 border-white" />
                    <h3 className="text-base font-semibold text-[var(--text)]">
                      {estudio.titulo}
                    </h3>
                    <p className="text-sm text-[var(--primary)]">
                      {estudio.academia}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Historial */}
            <section>
              <h2 className="text-[1.125rem] font-semibold text-[var(--text)] mb-4 pl-4 relative flex items-center">
                <span className="absolute left-0 top-1 h-4/5 w-1 bg-[var(--gradient-primary)] rounded"></span>
                Historial Laboral
              </h2>
              <div className="space-y-6 mt-4">
                {historialLaboral.map((exp, index) => (
                  <div
                    key={index}
                    className="relative pl-6 border-l-2 border-[var(--border)] pb-4"
                  >
                    <div className="absolute -left-[0.4rem] top-0 w-3 h-3 bg-[var(--primary)] rounded-full border-2 border-white" />
                    <h3 className="text-base font-semibold text-[var(--text)]">
                      {exp.titulo}
                    </h3>
                    <p className="text-sm text-[var(--primary)]">
                      {exp.empresa}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
   
    
  );
}

export default PerfilCandidato;
