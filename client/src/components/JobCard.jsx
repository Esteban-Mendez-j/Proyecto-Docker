import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_CLIENT_URL } from '../services/Api';
import { QuestionModal } from "../services/Modal";
import { RoleContext } from "../services/RoleContext";
import { toggleFavoritoRequest } from '../services/ToggleFavoritosRequest';

export default function JobCard({ job, onFavoritoChange }) {

    const [isFavorite, setIsFavorite] = useState(false);
    const { rol } = useContext(RoleContext)

    useEffect(() => {
        setIsFavorite(job.vacanteGuardada);
    }, [job.vacanteGuardada]);

    const handleToggleFavorito = async () => {
        try {
            if (!isFavorite) {
                // Si NO está en favoritos → agregar directamente
                await toggleFavoritoRequest(job.nvacantes);
                setIsFavorite(true);
            } else {
                // Si YA está en favoritos → preguntar antes de quitar
                const confirmed = await QuestionModal(
                    "¿Quieres eliminar esta vacante de tus favoritos?",
                    "warning"
                );

                if (!confirmed) return; // Si cancela, no hacer nada

                await toggleFavoritoRequest(job.nvacantes);
                setIsFavorite(false);
            }

            // 🔔 Avisamos al padre que algo cambió
            if (onFavoritoChange) onFavoritoChange(job.nvacantes);

        } catch (error) {
            console.error("❌ Error al cambiar favorito:", error);
        }
    };

    return (
        <div className="card" >
            <a href={`/empleos/${job.nvacantes}`} >
                <div className="card-header">
                    <div className="logo">
                        <img
                            src={job.imagenEmpresa ? `${API_CLIENT_URL}` + "/img/" + job.imagenEmpresa : `${API_CLIENT_URL}/images/imgEmpresa.png`}
                            alt={`${job.nameEmpresa} logo`}
                            width="60"
                            height="60"
                        />
                    </div>
                    <div className="info">
                        {!job.active && (
                            <span className=" top-4 left-4 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                                {rol === "EMPRESA" ? "Desactivada por Admin" : "Desactivada"}
                            </span>
                        )}

                        {!job.activaPorEmpresa && job.active && (
                            <span className=" top-4 left-4 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                                {rol === "EMPRESA" ? "Desactivada por ti" : "Desactivada"}
                            </span>
                        )}

                        {job.candidatoPostulado && job.estadoPostulacion !== 'Cancelada' && (
                            <span
                                className={`top-4 right-4 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md ${job.estadoPostulacion === 'Aceptada'
                                    ? 'bg-green-500'
                                    : job.estadoPostulacion === 'Rechazada'
                                        ? 'bg-red-500'
                                        : 'bg-blue-500'
                                    }`}
                            >
                                {job.estadoPostulacion}
                            </span>
                        )}

                        <div className="flex items-center justify-between">
                            <h3 className="title">{job.titulo}</h3>

                            { "CANDIDATO" == rol && <button
                                className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors duration-200 ml-auto z-[100]"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation(); 
                                    handleToggleFavorito(job.nvacantes);

                                }}
                                title="Agregar a favoritos"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    fill={isFavorite ? "yellow" : "none"}
                                    className={`w-5 h-5 transition-colors duration-200 ${isFavorite ? "text-yellow-400" : "text-gray-400"
                                        }`}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 4.308a.563.563 0 00.424.308l4.756.691a.562.562 0 01.312.959l-3.44 3.352a.563.563 0 00-.162.498l.811 4.733a.562.562 0 01-.815.592L12 17.347l-4.26 2.24a.562.562 0 01-.815-.592l.811-4.733a.563.563 0 00-.162-.498L4.134 9.765a.562.562 0 01.312-.959l4.756-.691a.563.563 0 00.424-.308l2.125-4.308z"
                                    />
                                </svg>
                            </button>}
                        </div>
                        <p className="company">{job.nameEmpresa}</p>
                    </div>
                </div>

                <div className="details">
                    <div className="detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{job.ciudad}</span>
                    </div>
                    <div className="detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{job.tipo}</span>
                    </div>
                    <div className="detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        <span>{job.experiencia} años</span>
                    </div>
                    <div className="detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="icon"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>

                        <span>{job.totalpostulaciones} postulados</span>
                    </div>
                </div>

                <div className="apply">
                    <span className="apply-text">Ver detalles</span>
                </div>
            </a>

            {rol === 'EMPRESA' && (
                <div className="apply">
                    <Link to={`/empresa/editar/vacantes/${job.nvacantes}`} className="btn btn-edit">Editar</Link>
                    <button
                        onClick={() => cambiarEstado(job.nvacantes, !job.activaPorEmpresa)}
                        className={`btn px-4 py-2 font-semibold rounded-lg shadow ${job.activaPorEmpresa
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                    >
                        {job.activaPorEmpresa ? "Desactivar" : "Activar"}
                    </button>
                </div>
            )}

        </div>
    )
}