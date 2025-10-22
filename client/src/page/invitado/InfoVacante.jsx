import { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import Loding from "../../components/Loading"
import ResumenVacante from "../../components/ResumenVacante"
import { useFetch } from "../../hooks/useFetch"
import Layout from "../../layouts/Layout"
import { API_CLIENT_URL } from "../../services/Api"
import { RoleContext } from "../../services/RoleContext"
import { modalTime } from "../../services/Modal"
import { toggleFavoritoRequest } from "../../services/ToggleFavoritosRequest"

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
        numeroGuardadosFavoritos: 0,
        vacanteGuardada: false,
    }
    const {id} = useParams()
    const [location, setLocation] = useState("")
    const [job, setJob] = useState(initialJob);
    const {rol} = useContext(RoleContext);
    const {data, loading} = useFetch(`/api/vacantes/seleccion/${id}`, "GET");
    const navigate =  useNavigate();
    const subject = encodeURIComponent("¡Mira esta oferta increíble!");
    const [copied, setCopied] = useState(false);
    const message = encodeURIComponent(`Te comparto esta oferta laboral que encontré, puede interesarte: ${location}`);

    const handleCopy = () => {
        navigator.clipboard.writeText(location).then(() => {
            setCopied(true);
            modalTime("Texto copiado")
            setTimeout(() => setCopied(false), 1500);
        });
    }

    const handleWhatsAppShare = () => {
        window.open(`https://wa.me/?text=${message}`, "_blank");
    };

    const handleGmailShare = () => {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${message}`, "_blank");
    };

    useEffect(() => {
        setLocation(window.location.href)
    }, []);

    const [isFavorite, setIsFavorite] = useState(false);
    
    useEffect(() => {
        if (!data) {return} 

        if (!data.vacanteSeleccionada) {
            navigate("/404"); // si no hay vacante, redirige al 404
            return;
        }
        setJob(data.vacanteSeleccionada);
        setIsFavorite(data.vacanteSeleccionada.vacanteGuardada);
    }, [data]);


    //SECCION DE FAVORITOS
  const handleClick = async () => {
    setIsFavorite(!isFavorite);
    await toggleFavoritoRequest(job.nvacantes);
  };

  
  




    if (loading ) {return <Loding/>}
    

    return (
        <Layout>
            <div className="container px-5 py-10 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                    {/* Detalles del empleo  */}
                    <div>
                        <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl shadow-sm transition-all duration-200"
                            >
                                <span className="text-lg">←</span>
                                <span className="font-medium">Volver</span>
                            </button>
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
                                    
                                  <button
                                        className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors duration-200 ml-auto"
                                         onClick={() => handleClick(job.nvacantes)} 
                                        title="Agregar a favoritos"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            fill={isFavorite ? "yellow" : "none"}  // 🔸 cambia el color de relleno
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
                                    <div className="flex flex-wrap gap-2 items-center relative">
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                            {job.tipo}
                                        </span>
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                            {job.modalidad}
                                        </span>
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                            {job.cargo}
                                        </span>

                                        <details className="relative group">
                                            <summary className="flex items-center gap-1 cursor-pointer text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors select-none">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 640 640"
                                                    width="16"
                                                    height="16"
                                                    className="transition-transform duration-300 group-open:rotate-90"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M457.5 71C450.6 64.1 440.3 62.1 431.3 65.8C422.3 69.5 416.5 78.3 416.5 88L416.5 144L368.5 144C280.1 144 208.5 215.6 208.5 304C208.5 350.7 229.2 384.4 252.1 407.4C260.2 415.6 268.6 422.3 276.4 427.8C285.6 434.3 298.1 433.5 306.5 425.9C314.9 418.3 316.7 405.9 311 396.1C307.4 389.8 304.5 381.2 304.5 369.4C304.5 333.2 333.8 303.9 370 303.9L416.5 303.9L416.5 359.9C416.5 369.6 422.3 378.4 431.3 382.1C440.3 385.8 450.6 383.8 457.5 376.9L593.5 240.9C602.9 231.5 602.9 216.3 593.5 207L457.5 71z"
                                                    />
                                                </svg>
                                                Compartir
                                            </summary>

                                            <div className="absolute right-0 mt-2 w-40 bg-white border border-blue-100 rounded-xl shadow-lg p-2 flex flex-col gap-2 z-50">
                                                <button 
                                                className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                                                onClick={handleCopy}
                                                >
                                                    Copiar Link {copied && "👍"}
                                                </button>
                                                <button 
                                                className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                                                onClick={handleWhatsAppShare}
                                                >
                                                    WhatsApp
                                                </button>
                                                <button 
                                                className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                                                onClick={handleGmailShare}
                                                >
                                                    Gmail
                                                </button>
                                                <label htmlFor="">{location.pathname}</label>
                                            </div>
                                        </details>
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
                                        <p className="font-medium">{job.sueldo} COP</p>
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

                    {data && <ResumenVacante job={data.vacanteSeleccionada} rol={rol}/>}
                </div>
            </div>
        </Layout>
    )
}