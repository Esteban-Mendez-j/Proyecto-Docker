import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Loding from "../../components/Loading"
import ResumenVacante from "../../components/ResumenVacante"
import { useFetchV2, useSendFormV2 } from "../../hooks/useFetch"
import Layout from "../../layouts/Layout"
import { API_CLIENT_URL, URL_IMAGEN } from "../../services/Api"
import { modalTime } from "../../services/Modal"
import { RoleContext } from "../../services/RoleContext"
import { toggleFavoritoRequest } from "../../services/ToggleFavoritosRequest"
import { ListSvg } from "../../components/Icons"
import { listAptitudes } from "../../services/data"
import exceptionControl from "../../services/exceptionControl"

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
        numCompartidos: 0,
        aptitudes: []
    }
    const {id} = useParams()
    const [location, setLocation] = useState("")
    const [job, setJob] = useState(initialJob);
    const {rol, logout} = useContext(RoleContext);
    const {data, loading, error} = useFetchV2(`/api/vacantes/seleccion/${id}`, "GET");
    const { send } = useSendFormV2();
    const navigate =  useNavigate();
    const subject = encodeURIComponent("¡Mira esta oferta increíble!");
    const [copied, setCopied] = useState(false);
    const message = encodeURIComponent(`Te comparto esta oferta laboral que encontré, puede interesarte: ${location}`);

    async function handleCompartir() {
      try {
        
        await send(`/api/vacantes/edit/numCompartidos/${job.nvacantes}`, "PUT")
        setJob((prev) => ({
            ...prev,
            numCompartidos: (prev.numCompartidos + 1),
        }));
        
      } catch (error) {
        exceptionControl(error, logout, navigate, "Error al incrementar el numero de compartidos")
      }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(location).then(() => {
            setCopied(true);
            modalTime("Texto copiado")
            setTimeout(() => setCopied(false), 1500);
        });
        handleCompartir();
    }

    const handleWhatsAppShare = () => {
        window.open(`https://wa.me/?text=${message}`, "_blank");
        handleCompartir();
    };

    const handleGmailShare = () => {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${message}`, "_blank");
        handleCompartir();
    };

    useEffect(() => {
        setLocation(window.location.href)
    }, []);

    const [isFavorite, setIsFavorite] = useState(false);
    
    useEffect(() => {
        if(error?.code === "NOT_FOUND") navigate("/404");
        if (!data) return 
        setJob(data);
        setIsFavorite(data.vacanteGuardada);
    }, [data, error]);

    //SECCION DE FAVORITOS
    const handleClick = async () => {
        setIsFavorite(!isFavorite);
        await toggleFavoritoRequest(job.nvacantes);
    };

    if (loading) {return <Loding/>}

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
                                        src={job.imagenEmpresa ? `${URL_IMAGEN}` +  job.imagenEmpresa : `/imgEmpresa.png`}
                                        alt={`${job.nameEmpresa} logo`}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <a className="mb-2 text-2xl font-bold">{job.titulo}</a>
                                    
                                  {"CANDIDATO" == rol && <button
                                        className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors duration-200 ml-auto"
                                         onClick={() => handleClick(job.nvacantes)} 
                                        title="Agregar a favoritos"
                                    >
                                        <ListSvg name={"estrella"} height={10} width={10} nameClass={`w-5 h-5 transition-colors duration-200 ${isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400 fill-gray-100 "}`}/>
                                    </button>}

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="inline-flex items-center text-sm text-text-light">
                                            <ListSvg name={"maleta"} height={16} width={16} nameClass="mr-1"/>
                                            {job.nameEmpresa}
                                        </span>
                                        <span className="inline-flex items-center text-sm text-text-light">
                                            <ListSvg name={"ubicacion"} height={16} width={16} nameClass="mr-1"/>
                                            {job.ciudad}, {job.departamento}
                                        </span>
                                        <span className="inline-flex items-center text-sm text-text-light">
                                            <ListSvg name={"reloj"} height={16} width={16} nameClass="mr-1"/>
                                            Publicado: {new Date(job.fechaPublicacion).toLocaleString("es-CO", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit"
                                            })}
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
                                                <ListSvg name={"flechaCompartir"} height={16} width={16} nameClass="transition-transform duration-300 group-open:rotate-90" />
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
                                    <ListSvg name={"ubicacion"} height={20} width={20} nameClass="mt-1 mr-3 text-primary"/>
                                    <div>
                                        <p className="text-sm text-text-light">Ciudad</p>
                                        <p className="font-medium">{job.ciudad}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <ListSvg name={"escudo"} height={20} width={20} nameClass="mt-1 mr-3 text-primary"/>
                                    <div>
                                        <p className="text-sm text-text-light">Departamento</p>
                                        <p className="font-medium">{job.departamento}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <ListSvg name={"tarjetaCredito"} height={20} width={20} nameClass="mt-1 mr-3 text-primary"/>
                                    <div>
                                        <p className="text-sm text-text-light">Tipo</p>
                                        <p className="font-medium">{job.tipo}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <ListSvg name={"monitor"} height={20} width={20} nameClass="mt-1 mr-3 text-primary"/>
                                    <div>
                                        <p className="text-sm text-text-light">Modalidad</p>
                                        <p className="font-medium">{job.modalidad}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <ListSvg name={"dolar"} height={20} width={20} nameClass="mt-1 mr-3 text-primary"/>
                                    <div>
                                        <p className="text-sm text-text-light">Sueldo</p>
                                        <p className="font-medium">{job.sueldo.toLocaleString('es-CO')} COP</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <ListSvg name={"usuario"} height={20} width={20} nameClass="mt-1 mr-3 text-primary"/>
                                    <div>
                                        <p className="text-sm text-text-light">Cargo</p>
                                        <p className="font-medium">{job.cargo}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <ListSvg name={"usuario"} height={20} width={20} nameClass="mt-1 mr-3 text-primary"/>
                                    <div>
                                        <p className="text-sm text-text-light">Postulados</p>
                                        <p className="font-medium">{job.totalpostulaciones}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <ListSvg name={"reloj"} height={20} width={20} nameClass="mt-1 mr-3 text-primary"/>
                                    <div>
                                        <p className="text-sm text-text-light">Experiencia</p>
                                        <p className="font-medium">{job.experiencia} años</p>
                                    </div>
                                </div>
                            </div>
                            <div className="candidato-section">
                                <h2 className="candidato-section-title">Aptitudes</h2>

                                <div className="flex flex-wrap gap-3">
                                    {job.aptitudes.map((label) => (
                                        <label
                                            key={job.aptitudes.indexOf(label)}
                                            className={"px-4 py-2 rounded-2xl border transition-all duration-200 bg-blue-600 text-white border-blue-600 shadow-md scale-105"}
                                        >
                                             {listAptitudes[label] || label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Descripción del puesto  */}
                            <div className="mb-8">
                                <h2 className="flex items-center mb-4 text-xl font-semibold">
                                    <ListSvg name={"archivo"} height={20} width={20} nameClass="mr-2 text-primary"/>
                                    Descripción del Puesto
                                </h2>
                                <div className="prose max-w-none">
                                    {job.descripcion}
                                </div>
                            </div>

                            {/* Requerimientos del puesto  */}
                            <div>
                                <h2 className="flex items-center mb-4 text-xl font-semibold">
                                    <ListSvg name={"archivo"} height={20} width={20} nameClass="mr-2 text-primary"/>
                                    Requerimientos del Puesto
                                </h2>
                                <div className="prose max-w-none">
                                    {job.requerimientos}
                                </div>
                            </div>
                        </div>
                    </div>

                    {data && <ResumenVacante job={data} rol={rol} id={id}/>}
                </div>
            </div>
        </Layout>
    )
}