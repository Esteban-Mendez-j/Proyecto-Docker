import { useContext, useState } from "react"
import { RoleContext } from "../services/RoleContext"
import { API_CLIENT_URL } from "../services/Api"
import { Link } from "react-router-dom"
import { toggleFavoritoRequest } from "../services/ToggleFavoritosRequest";
import { QuestionModal } from "../services/Modal";

export default function TableJob({ jobs, onFavoritoChange, cambiarEstado, verSeccionEdit }) {
    // const [isFavorite, setIsFavorite] = useState(false);
    const { rol } = useContext(RoleContext)

    // const handleToggleFavorito = async (job) => {
    //     try {
    //         if (!isFavorite) {
    //             // Si NO está en favoritos → agregar directamente
    //             await toggleFavoritoRequest(job.nvacantes);
    //             setIsFavorite(true);
    //         } else {
    //             // Si YA está en favoritos → preguntar antes de quitar
    //             const confirmed = await QuestionModal(
    //                 "¿Quieres eliminar esta vacante de tus favoritos?",
    //                 "warning"
    //             );

    //             if (!confirmed) return; // Si cancela, no hacer nada

    //             await toggleFavoritoRequest(job.nvacantes);
    //             setIsFavorite(false);
    //         }

    //         // 🔔 Avisamos al padre que algo cambió
    //         if (onFavoritoChange) onFavoritoChange(job.nvacantes);

    //     } catch (error) {
    //         console.error("❌ Error al cambiar favorito:", error);
    //     }
    // };


    // return (
    //     <div className="flex gap-4">
    //         {/* Bloque de tabla */}
    //         <div className="w-full overflow-x-auto">
    //             <table className="w-full min-w-[900px] text-left border-collapse">
    //                 <thead className="bg-gray-100">
    //                     <tr>
    //                         <th className="px-4 py-2 empresa max-w-[180px]">Empresa</th>
    //                         <th className="px-4 py-2 titulo max-w-[200px]">Título</th>
    //                         <th className="px-4 py-2">Ciudad</th>
    //                         <th className="px-4 py-2">Tipo</th>
    //                         <th className="px-4 py-2">Experiencia</th>
    //                         <th className="px-4 py-2">Postulaciones</th>
    //                         {rol === "EMPRESA" && <th className="px-4 py-2 text-center">Acciones</th>}
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {jobs.map((job) => (
    //                         <tr
    //                             key={job.nvacantes}
    //                             className="border-b hover:bg-gray-50 transition-colors"
    //                         >
    //                             <td className="px-4 py-2 flex items-center gap-2 empresa">
    //                                 <img
    //                                     src={job.imagenEmpresa ? `${API_CLIENT_URL}/img/${job.imagenEmpresa}` : `${API_CLIENT_URL}/images/imgEmpresa.png`}
    //                                     alt={job.nameEmpresa}
    //                                     className="w-10 h-10 rounded-md"
    //                                 />
    //                                 <span className="truncate">{job.nameEmpresa}</span>
    //                             </td>
    //                             <td className="px-4 py-2 titulo">
    //                                 <Link to={`/empleos/${job.nvacantes}`} className="hover:underline truncate block">
    //                                     {job.titulo}
    //                                 </Link>
    //                             </td>
    //                             <td className="px-4 py-2 break-words">{job.ciudad}</td>
    //                             <td className="px-4 py-2 break-words">{job.tipo}</td>
    //                             <td className="px-4 py-2 break-words">{job.experiencia} años</td>
    //                             <td className="px-4 py-2 break-words">{job.totalpostulaciones}</td>

    //                             {rol === "EMPRESA" && verSeccionEdit && (
    //                                 <td className="px-4 py-2 text-center actions whitespace-nowrap">
    //                                     <div className="flex items-center gap-2 ml-auto">
    //                                         <button
    //                                             className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition"
    //                                             onClick={(e) => {
    //                                                 e.preventDefault();
    //                                                 e.stopPropagation();
    //                                                 navigate(`/empresa/editar/vacantes/${job.nvacantes}`);
    //                                             }}
    //                                         >
    //                                             Editar
    //                                         </button>
    //                                         <button
    //                                             onClick={() => cambiarEstado(job.nvacantes, !job.activaPorEmpresa)}
    //                                             className={`px-3 py-1.5 text-sm font-semibold rounded-md shadow ${job.activaPorEmpresa ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
    //                                                 }`}
    //                                         >
    //                                             {job.activaPorEmpresa ? "Desactivar" : "Activar"}
    //                                         </button>
    //                                     </div>
    //                                 </td>
    //                             )}
    //                         </tr>
    //                     ))}
    //                 </tbody>
    //             </table>
    //         </div>
    //     </div>

    // )

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        {rol != "EMPRESA" && <th className="px-4 py-2 max-w-[180px] truncate overflow-hidden whitespace-nowrap">Empresa</th>}
                        <th className="px-4 py-2 max-w-[180px] truncate overflow-hidden whitespace-nowrap">Título</th>
                        <th className="px-4 py-2">Ciudad</th>
                        <th className="px-4 py-2">Tipo</th>
                        <th className="px-4 py-2">Experiencia</th>
                        {rol == "CANDIDATO" && <th className="px-4 py-2 max-w-[100px]">Afinidad</th>}
                        <th className="px-4 py-2 max-w-[100px]">Postulaciones</th>
                        {/* {rol == "CANDIDATO" &&<th className="px-4 py-2 text-center">Favorito</th>} */}
                        {rol == "EMPRESA" &&<th className="px-4 py-2 text-center">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job) => (
                        <tr
                            key={job.nvacantes}
                            className="border-b hover:bg-gray-50 transition-colors"
                        >
                            {rol != "EMPRESA" &&
                                <td className="px-4 py-2 flex items-center gap-2 max-w-[180px] truncate overflow-hidden whitespace-nowrap">
                                    <img
                                        src={
                                            job.imagenEmpresa
                                                ? `${API_CLIENT_URL}/img/${job.imagenEmpresa}`
                                                : `${API_CLIENT_URL}/images/imgEmpresa.png`
                                        }
                                        alt={job.nameEmpresa}
                                        className="w-10 h-10 rounded-md flex-shrink-0"
                                    />
                                    <span className="truncate">{job.nameEmpresa}</span>
                                </td>
                            }

                            <td className="px-4 py-2 font-semibold max-w-[200px] truncate overflow-hidden whitespace-nowrap">
                                <Link
                                    title={job.titulo}
                                    to={`/empleos/${job.nvacantes}`}
                                    className="hover:underline"
                                    style={{ color: "var(--primary)" }}
                                >
                                    {job.titulo}
                                </Link>
                            </td>

                            <td className="px-4 py-2">{job.ciudad}</td>
                            <td className="px-4 py-2">{job.tipo}</td>
                            <td className="px-4 py-2">{job.experiencia} años</td>
                            {rol == "CANDIDATO" && <td className="px-4 py-2">{job.prediccion}%</td>}
                            <td className="px-4 py-2">{job.totalpostulaciones}</td>

                            {/* {"CANDIDATO" == rol && <td className="px-4 py-2 text-center">

                                <button
                                    className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors duration-200 ml-auto z-[100]"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleToggleFavorito(job);

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
                                </button>
                            </td>} */}
                            
                            {rol === "EMPRESA" && verSeccionEdit && (
                                <td className="px-4 py-2 text-center">
                                    <div className="flex items-center gap-2 ml-auto">
                                        <button
                                            className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition"
                                            onClick={() => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                navigate(`/empresa/editar/vacantes/${job.nvacantes}`)
                                            }}>
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => cambiarEstado(job.nvacantes, !job.activaPorEmpresa)}
                                            className={`px-3 py-1.5 text-sm font-semibold rounded-md shadow ${job.activaPorEmpresa
                                                ? "bg-red-500 hover:bg-red-600 text-white"
                                                : "bg-green-500 hover:bg-green-600 text-white"
                                                }`}
                                        >
                                            {job.activaPorEmpresa ? "Desactivar" : "Activar"}
                                        </button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}