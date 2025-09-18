import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Loding from "../../components/Loading"
import ResumenVacante from "../../components/ResumenVacante"
import { useFetch } from "../../hooks/useFetch"
import Layout from "../../layouts/layout"
import { API_CLIENT_URL } from "../../services/Api"
import { RoleContext } from "../../services/RoleContext"

export default function InfoVacante() {
    const initialJob = {
        comentarioAdmin: "",
        active:"",
        imagenEmpresa: "",
        nameEmpresa: "",
        titulo: "",
        ciudad: "",
        departamento: "",
        fechaPublicacion: "",
        modalidad: "",
        tipo: "",
        sueldo: "",
        cargo: "",
        totalpostulaciones: "",
        experiencia: "",
        descripcion: "",
        requerimientos: "",
        idUsuario: "",
        candidatoPostulado: "",
        estadoPostulacion: "",
        activaPor: "",
    }
    const {id} = useParams()
    const [job, setJob] = useState(initialJob);
    const {rol, setRol} = useContext(RoleContext);
    const {data, error, loading} = useFetch(`/api/vacantes/seleccion/${id}`, "GET");
    const navigate =  useNavigate();
    const [curriculo, setCurriculo] = useState(null);
    
    useEffect(() => {
        if (!data) {return} 

        if (!data.vacanteSeleccionada) {
            navigate("/404"); // si no hay vacante, redirige al 404
            return;
        }
        setJob(data.vacanteSeleccionada);
    }, [data]);


    if (loading ) {return <Loding/>}
    

    return (
        <Layout>
            <div className="container px-5 py-10 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                    {/* Detalles del empleo  */}
                    <div>
                        <div
                            className="p-8 mb-8 border rounded-lg shadow-lg bg-white/80 backdrop-blur-xl border-white/20"
                        >
                            {!job.active && rol === "EMPRESA" && (
                                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md shadow-sm mb-4">
                                    <p className="font-semibold">⚠️ Vacante desactivada por el administrador</p>
                                    <p>{job.comentarioAdmin}</p>
                                </div>
                            )}
                            <div
                                className="flex flex-col gap-6 pb-8 mb-8 border-b border-gray-100 md:flex-row md:items-center"
                            >
                                <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg">
                                    <img
                                        src={job.imagenEmpresa ? `${API_CLIENT_URL}` + "/img/" + job.imagenEmpresa : `${API_CLIENT_URL}/images/imgEmpresa.png`}
                                        alt={`${job.nameEmpresa} logo`}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <a className="mb-2 text-2xl font-bold">{job.titulo}</a>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="inline-flex items-center text-sm text-text-light">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="mr-1"
                                            >
                                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"
                                                ></rect>
                                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                            </svg>
                                            {job.nameEmpresa}
                                        </span>
                                        <span className="inline-flex items-center text-sm text-text-light">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="mr-1"
                                            >
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                                                ></path>
                                                <circle cx="12" cy="10" r="3"></circle>
                                            </svg>
                                            {job.ciudad}, {job.departamento}
                                        </span>
                                        <span className="inline-flex items-center text-sm text-text-light">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="mr-1"
                                            >
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                            Publicado: {job.fechaPublicacion}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span
                                            className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                                        >
                                            {job.tipo}
                                        </span>
                                        <span
                                            className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                                        >
                                            {job.modalidad}
                                        </span>
                                        <span
                                            className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                                        >
                                            {job.cargo}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Información detallada del empleo */}
                            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
                                <div className="flex items-start">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mt-1 mr-3 text-primary"
                                    >
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <div>
                                        <p className="text-sm text-text-light">Ciudad</p>
                                        <p className="font-medium">{job.ciudad}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mt-1 mr-3 text-primary"
                                    >
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                    <div>
                                        <p className="text-sm text-text-light">Departamento</p>
                                        <p className="font-medium">{job.departamento}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mt-1 mr-3 text-primary"
                                    >
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                        <line x1="2" y1="11" x2="22" y2="11"></line>
                                    </svg>
                                    <div>
                                        <p className="text-sm text-text-light">Tipo</p>
                                        <p className="font-medium">{job.tipo}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mt-1 mr-3 text-primary"
                                    >
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                        <line x1="8" y1="21" x2="16" y2="21"></line>
                                        <line x1="12" y1="17" x2="12" y2="21"></line>
                                    </svg>
                                    <div>
                                        <p className="text-sm text-text-light">Modalidad</p>
                                        <p className="font-medium">{job.modalidad}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mt-1 mr-3 text-primary"
                                    >
                                        <line x1="12" y1="1" x2="12" y2="23"></line>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                                        ></path>
                                    </svg>
                                    <div>
                                        <p className="text-sm text-text-light">Sueldo</p>
                                        <p className="font-medium">{job.sueldo}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mt-1 mr-3 text-primary"
                                    >
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <div>
                                        <p className="text-sm text-text-light">Cargo</p>
                                        <p className="font-medium">{job.cargo}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mt-1 mr-3 text-primary"
                                    >
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <div>
                                        <p className="text-sm text-text-light">Postulados</p>
                                        <p className="font-medium">{job.totalpostulaciones}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mt-1 mr-3 text-primary"
                                    >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    <div>
                                        <p className="text-sm text-text-light">Experiencia</p>
                                        <p className="font-medium">{job.experiencia} años</p>
                                    </div>
                                </div>
                            </div>

                            {/* Descripción del puesto  */}
                            <div className="mb-8">
                                <h2 className="flex items-center mb-4 text-xl font-semibold">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-2 text-primary"
                                    >
                                        <path
                                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                        ></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                    Descripción del Puesto
                                </h2>
                                <div className="prose max-w-none">
                                    {job.descripcion}
                                </div>
                            </div>

                            {/* Requerimientos del puesto  */}
                            <div>
                                <h2 className="flex items-center mb-4 text-xl font-semibold">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-2 text-primary"
                                    >
                                        <path
                                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                        ></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                    Requerimientos del Puesto
                                </h2>
                                <div className="prose max-w-none">
                                    {job.requerimientos}
                                </div>
                            </div>
                        </div>
                    </div>

                    {data && <ResumenVacante job={data.vacanteSeleccionada} rol={rol}  curriculo ={curriculo} />}
                </div>
            </div>
        </Layout>
    )
}