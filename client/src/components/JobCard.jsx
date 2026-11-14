import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_CLIENT_URL, URL_IMAGEN } from '../services/Api.js';
import { RoleContext } from "../services/RoleContext.jsx";
import { toggleFavoritoRequest } from '../services/ToggleFavoritosRequest.js';
import { ListSvg } from "./icons.jsx";
import "../style/invitado/jobcard.css"

export default function JobCard({ job, cambiarEstado, verSeccionEdit, presentaion, verPrediccion, onToggleFavorito}) {

    const [isFavorite, setIsFavorite] = useState(false);
    const { rol } = useContext(RoleContext)
    const navigate = useNavigate();

    useEffect(() => {
        setIsFavorite(job.vacanteGuardada);
    }, [job.vacanteGuardada]);

    const handleToggleFavorito = async () => {
        if (onToggleFavorito) {
            await onToggleFavorito(job.nvacantes);
            return;
        }
        // Comportamiento independiente para otras pantallas,
        // como Index, donde no existe JobList.
        await toggleFavoritoRequest(job.nvacantes);
        setIsFavorite(prev => !prev);
    };

    // Muestra los empleos en forma de tarjetas
    if (presentaion == 1) {
        return (
            <div 
                className={`card relative overflow-visible flex flex-col pt-6 ${job.recomendado ? "border-2 border-blue-500 shadow-lg bg-blue-50/30" : ""}`} 
                onClick={()=> navigate(`/empleos/${job.nvacantes}`)}
            >
                {/*  El badge de optimización se queda de forma segura en su esquina */}
                {job.recomendado && (
                    <div className="absolute top-2 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md z-[50] flex items-center gap-1">
                        <span>RECOMENDADO</span> 
                    </div>
                )}

                <div className="card-header">
                    <div className="logo">
                        <img
                            src={job.imagenEmpresa ? `${URL_IMAGEN}${job.imagenEmpresa}` : `/imgEmpresa.png`}
                            alt={`${job.nameEmpresa} logo`}
                            width="60"
                            height="60"
                        />
                    </div>
                    <div className="info">
                        {!job.active && (
                            <span className="top-4 left-4 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                                {rol === "EMPRESA" ? "Desactivada por Admin" : "Desactivada"}
                            </span>
                        )}

                        {!job.activaPorEmpresa && job.active && (
                            <span className="top-4 left-4 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                                {rol === "EMPRESA" ? "Desactivada por ti" : "Desactivada"}
                            </span>
                        )}

                        {/* ⭐ CORRECCIÓN CRÍTICA: Le devolvemos `{job.estadoPostulacion}` a la etiqueta para que no sea un punto vacío */}
                        {job.candidatoPostulado && job.estadoPostulacion !== 'Cancelada' && (
                            <span
                                className={`top-4 right-4 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md ${
                                    job.estadoPostulacion === 'Aceptada'
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

                            {"CANDIDATO" == rol && <button
                                className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors duration-200 ml-auto z-[100]"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleToggleFavorito(job.nvacantes);
                                }}
                                title="Agregar a favoritos"
                            >
                                <ListSvg name={"estrella"} height={10} width={10} nameClass={`w-5 h-5 transition-colors duration-200 ${isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400 fill-gray-100 "}`}/>
                            </button>}
                        </div>
                        <p className="company">{job.nameEmpresa}</p>
                    </div>
                </div>

                <div className="details">
                    <div className="detail">
                        <ListSvg name={"ubicacion"} width={16} height={16}/>
                        <span>{job.ciudad}</span>
                    </div>
                    <div className="detail">
                        <ListSvg name={"reloj"} width={16} height={16}/>
                        <span>{job.tipo}</span>
                    </div>
                    <div className="detail">
                        <ListSvg name={"maleta"} width={16} height={16}/>
                        <span>{job.experiencia} años</span>
                    </div>
                    <div className="detail">
                        <ListSvg name={"usuario"} width={18} height={18}/>
                        <span>{job.totalpostulaciones} postulados</span>
                    </div>
                    {(rol === "CANDIDATO" && verPrediccion) && (
                        <div className="detail">
                            <ListSvg name={"prediccion"} height={18} width={18} />
                            <span>{job.prediccion}%</span>
                        </div>
                    )}
                </div>

                <div className="apply">
                    <span className="apply-text">Ver detalles</span>
                </div>

                {(rol === 'EMPRESA' && verSeccionEdit) && (
                    <div className="apply">
                        <button
                            onClick={(e) =>  {
                                e.stopPropagation();
                                navigate(`/empresa/editar/vacantes/${job.nvacantes}`)
                            }}
                            className="btn btn-edit"
                        >
                            Editar
                        </button>
                        <button
                            onClick={(e) =>  {
                                e.stopPropagation();
                                cambiarEstado(job.nvacantes, !job.activaPorEmpresa)
                            }}
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
    // Muestra los empleos en filas
    
    if (presentaion == 2) {
        return (
            <div className="job-row-card">

                {/* Información principal */}
                <div
                    className={`job-row-main ${job.recomendado ? "job-row-recommended" : ""
                        }`}
                    onClick={() => navigate(`/empleos/${job.nvacantes}`)}
                >
                    <img
                        src={
                            job.imagenEmpresa
                                ? `${URL_IMAGEN}${job.imagenEmpresa}`
                                : `/imgEmpresa.png`
                        }
                        alt={job.nameEmpresa}
                        className="job-row-logo"
                    />

                    <div className="job-row-info">

                        {/* Título y recomendación */}
                        <div className="job-row-title-container">
                            <h3 className="job-row-title">
                                {job.titulo}
                            </h3>

                            {job.recomendado && (
                                <span className="job-row-badge">
                                    Recomendada
                                </span>
                            )}
                        </div>

                        {/* Información de la vacante */}
                        <div className="job-row-details">

                            <span className="job-row-detail">
                                <ListSvg name={"empresa"} width={18} height={18} />
                                <span>{job.nameEmpresa}</span>
                            </span>

                            <span className="job-row-detail">
                                <ListSvg name={"ubicacion"} width={16} height={16} />
                                <span>{job.ciudad}</span>
                            </span>

                            <span className="job-row-detail">
                                <ListSvg name={"usuario"} width={16} height={16} />
                                <span>{job.totalpostulaciones} postulados</span>
                            </span>

                            <span className="job-row-detail">
                                <ListSvg name={"maleta"} width={16} height={16} />
                                <span>{job.tipo}</span>
                            </span>

                            <span className="job-row-detail">
                                <ListSvg name={"reloj"} width={16} height={16} />
                                <span>{job.experiencia} años de experiencia</span>
                            </span>

                            {(rol === "CANDIDATO" && verPrediccion) && (
                                <span className="job-row-detail">
                                    <ListSvg name={"prediccion"} height={18} width={18} />
                                    <span>{job.prediccion}% de afinidad</span>
                                </span>
                            )}

                        </div>
                    </div>
                </div>

                {/* Acciones y estados */}
                <div className="job-row-actions">

                    <div className="job-row-status">

                        {rol === "CANDIDATO" && (
                            <button
                                className="job-row-favorite"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleToggleFavorito();
                                }}
                                title="Agregar a favoritos"
                            >
                                <ListSvg
                                    name={"estrella"}
                                    height={10}
                                    width={10}
                                    nameClass={`w-5 h-5 transition-colors duration-200 ${isFavorite
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-400 fill-gray-100"
                                        }`}
                                />
                            </button>
                        )}

                        {job.candidatoPostulado && (
                            <span
                                className={`text-xs font-semibold px-2 py-1 rounded-full ${job.estadoPostulacion === "Aceptada"
                                        ? "bg-green-100 text-green-700"
                                        : job.estadoPostulacion === "Rechazada"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-blue-100 text-blue-700"
                                    }`}
                            >
                                {job.estadoPostulacion}
                            </span>
                        )}

                        {!job.active && (
                            <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                                {rol === "EMPRESA"
                                    ? "Desactivada por Admin"
                                    : "Desactivada"}
                            </span>
                        )}

                        {!job.activaPorEmpresa && job.active && (
                            <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                                {rol === "EMPRESA"
                                    ? "Desactivada por ti"
                                    : "Desactivada"}
                            </span>
                        )}

                    </div>

                    {rol === "EMPRESA" && verSeccionEdit && (
                        <div className="job-row-company-actions">

                            <button
                                className="job-row-edit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate(`/empresa/editar/vacantes/${job.nvacantes}`);
                                }}
                            >
                                Editar
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    cambiarEstado(
                                        job.nvacantes,
                                        !job.activaPorEmpresa
                                    );
                                }}
                                className={`px-3 py-1.5 text-sm font-semibold rounded-md shadow ${job.activaPorEmpresa
                                        ? "bg-red-500 hover:bg-red-600 text-white"
                                        : "bg-green-500 hover:bg-green-600 text-white"
                                    }`}
                            >
                                {job.activaPorEmpresa ? "Desactivar" : "Activar"}
                            </button>

                        </div>
                    )}

                </div>
            </div>
        );
    }

}