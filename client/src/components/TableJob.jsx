import { useContext } from "react"
import { RoleContext } from "../services/RoleContext.jsx"
import { API_CLIENT_URL } from "../services/Api"
import { Link, useNavigate } from "react-router-dom"

export default function TableJob({ jobs, cambiarEstado, verSeccionEdit, verPrediccion}) {
    const { rol } = useContext(RoleContext)
    const navigate = useNavigate()

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
                        {(rol == "CANDIDATO" && verPrediccion)&& <th className="px-4 py-2 max-w-[100px]">Afinidad</th>}
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
                            {(rol == "CANDIDATO" && verPrediccion) && <td className="px-4 py-2">{job.prediccion}%</td>}
                            <td className="px-4 py-2">{job.totalpostulaciones}</td>

                        
                            {rol === "EMPRESA" && verSeccionEdit && (
                                <td className="px-4 py-2 text-center">
                                    <div className="flex items-center gap-2 ml-auto">
                                        <button
                                            className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition"
                                            onClick={(e) => {
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