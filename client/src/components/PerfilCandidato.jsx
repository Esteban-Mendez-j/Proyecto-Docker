import { Link } from "react-router-dom";
import { API_CLIENT_URL, URL_IMAGEN } from "../services/Api";
import { listAptitudes } from "../services/data";
import "../style/invitado/candidato.css";

export default function PerfilCandidato({candidato, historialLaboral, estudios, isPublic}) {

    return (
        <div className="candidato-perfil-container">
            <div className="candidato-perfil">
                {/* Cabecera */}
                <div className="candidato-perfil-header">
                    {/* Imagen */}
                    <div className="candidato-imagen-container">
                        <img
                            src={
                                candidato.imagen
                                    ? `${URL_IMAGEN}${candidato.imagen}`
                                    : `/imgCandidato.png`
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
                                ? `${candidato.experiencia}${candidato.experiencia > 1 ? " años" : " año"} laborando`
                                : ""}
                        </p>
                        <h1 className="text-base font-semibold text-[var(--text)]">
                            {candidato.nivelEducativo}
                        </h1>
                    </div>

                    {/* Botones */}
                    <div className="candidato-header-actions">
                        {!isPublic &&
                            <Link
                                to="/perfil/candidato/editar"
                                className="candidato-edit-button"
                            >
                                Editar perfil
                            </Link>
                        }
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
                            <span className="text-gray-600">Correo:</span>
                            <span className="candidato-info-value">
                                {candidato.correo}
                            </span>
                        </div>

                        <div className="candidato-info-item">
                            <span className="text-gray-600">Teléfono:</span>
                            <span className="candidato-info-value">
                                {candidato.telefono}
                            </span>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="candidato-section">
                        <h2 className="candidato-section-title">Descripción</h2>
                        {candidato.descripcion ? (
                            <p className="candidato-descripcion">{candidato.descripcion}</p>
                        ) : (
                            <p className="italic text-gray-500">El candidato no ha agregado una descripción.</p>
                        )}
                    </div>

                    {/* Video Presentación */}
                    <section className="mb-6 pb-6 border-b border-[var(--border)]">
                        <h2 className="text-[1.125rem] font-semibold text-[var(--text)] mb-4 pl-4 relative flex items-center">
                            <span className="absolute left-0 top-1 h-4/5 w-1 bg-[var(--gradient-primary)] rounded"></span>
                            Video de Presentación
                        </h2>

                        {candidato.videoLink ? (
                            <a
                                href={candidato.videoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-4 border rounded-xl shadow-sm hover:shadow-md transition"
                            >
                                🎥 Video de presentación del candidato
                            </a>
                        ) : (
                            <p className="italic text-gray-500">El candidato aún no ha agregado un video de presentación.</p>
                        )}
                    </section>

                    <div className="candidato-section">
                        <h2 className="candidato-section-title">Aptitudes</h2>

                        <div className="flex flex-wrap gap-3">
                            {candidato.aptitudes && candidato.aptitudes.length > 0 ? (
                                candidato.aptitudes.map((label, index) => (
                                    <label
                                        key={index}
                                        className="px-4 py-2 rounded-2xl border transition-all duration-200 bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                                    >
                                        {listAptitudes[label] || label}
                                    </label>
                                ))
                            ) : (
                                <p className="italic text-gray-500">El candidato no ha agregado aptitudes.</p>
                            )}

                        </div>
                    </div>

                    {/* Estudios */}
                    <section className="mb-6 pb-6 border-b border-[var(--border)]">
                        <h2 className="text-[1.125rem] font-semibold text-[var(--text)] mb-4 pl-4 relative flex items-center">
                            <span className="absolute left-0 top-1 h-4/5 w-1 bg-[var(--gradient-primary)] rounded"></span>
                            Estudios
                        </h2>
                        <div className="space-y-6 mt-4">
                            {estudios.length === 0 ? (
                                <p className="italic text-gray-500">No hay estudios registrados.</p>
                            ) : (
                                estudios.map((estudio, index) => (
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
                                ))
                            )}
                        </div>
                    </section>

                    {/* Historial */}
                    <section>
                        <h2 className="text-[1.125rem] font-semibold text-[var(--text)] mb-4 pl-4 relative flex items-center">
                            <span className="absolute left-0 top-1 h-4/5 w-1 bg-[var(--gradient-primary)] rounded"></span>
                            Historial Laboral
                        </h2>
                        <div className="space-y-6 mt-4">
                            {historialLaboral.length === 0 ? (
                                <p className="italic text-gray-500">No hay experiencia laboral registrada.</p>
                            ) : (
                                historialLaboral.map((exp, index) => (
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
                                ))
                            )}

                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}