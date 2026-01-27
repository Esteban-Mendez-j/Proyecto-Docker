import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../layouts/Layout";
import "../../style/invitado/empleos.css"
import "../../style/invitado/postulados.css"
import { useContext, useEffect, useState } from "react";
import Pagination from "../../components/Paginacion";
import manejarRespuesta from "../../services/ManejarRespuesta";
import { API_CLIENT_URL } from "../../services/Api";
import { modal, modalResponse, QuestionModal } from "../../services/Modal";
import {sendMessage} from "../../services/Websocket"
import { mensajesNotificaciones } from "../../services/data";
import useFiltro from "../../hooks/useFiltro";
import Table from "../../components/Table";
import SinResultados from "../../components/SinResultados"
import { RoleContext } from "../../services/RoleContext";
import { useSendFormV2 } from "../../hooks/useFetch";
import exceptionControl from "../../services/exceptionControl";

export default function Postulados() {

    const initialNotificacion = {
        Id: "",
        asunto: "",
        cuerpo: "",
        fechaEnvio: "",
        destinatario: "",
        remitente: "",
        idRemitente: "",
        nameRemitente: "",
        isVisible: true,
        estadoEnvio: "",
        porcentajePrediccion: ""
    }

    const initialFiltro={
        estado:"",
        fechaMinima: "",
        nombreCandidato: "",
    }

    const listHeader = {
        Nombre: { nameAtributo: "candidato.nombre", clase: "text-gray-800",  modificacion: (p)=>{
            
            return(<>
                {p.candidato.nombre}
                {
                    !p.active && (
                        <span className="block text-xs text-yellow-600 font-medium">
                            Postulación desactivada
                        </span>
                    )
                }
                {
                    !p.vacanteIsActive && (
                        <span className="block text-xs text-red-600 font-medium">
                            Vacante deshabilitada
                        </span>
                    )
                }
            </>)
        } },
        Afinidad: { nameAtributo: "porcentajePrediccion", clase: "text-gray-800", modificacion: (p)=> `${p.porcentajePrediccion}%`   },
        Fecha: {
            nameAtributo: "fechaPostulacion", clase: "text-gray-800",
            modificacion: (p) => {
                return new Date(p.fechaPostulacion).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                })
            }
        },
        Estado: { nameAtributo: "estado", clase: (p) => {return `text-${ p.estado === "Aceptada" ? "green" : p.estado === "Rechazada" ? "red" : "blue" }-500 font-bold` }},
        CV: {
            nameAtributo: "candidato.curriculo", modificacion: (p) => {
                return (
                    <a
                        href={`${API_CLIENT_URL}/pdf/${p.candidato.curriculo}`}
                        target="_blank"
                        className="text-blue-500 hover:underline font-medium"
                    >
                        Ver CV
                    </a>
                )
            }
        },
    }
    const { vacanteId } = useParams();
    const navigate = useNavigate();
    const { logout, userDataSession, rol } = useContext(RoleContext);
    const itemsPerPage = 10;
    const { data, meta, loading, send } = useSendFormV2();
    const { send:getData } = useSendFormV2();
    const [currentPage, setCurrentPage] = useState(1);
    const [ filtrosLocal, filtrosAplicados, handleOnFilters, clearFilters, searchFilters ] = useFiltro(initialFiltro, setCurrentPage, "FiltrosEmpresaPostulado");
    const [postulados, setPostulados] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const fetchPostulados = async (page = 1) => {
        try {
            const { estado, fechaMinima, nombreCandidato } = filtrosAplicados;

            const params = new URLSearchParams({
                nvacantes: vacanteId,
                estado: estado || '',
                fechaMinima: fechaMinima || '',
                nombreCandidato: nombreCandidato || '',
                page: page - 1,
                size: itemsPerPage,
            });

            await send(`/api/postulados/lista?${params}`, "GET");
        } catch (error) {
            exceptionControl(error, logout, navigate, "Error al cargar las postulaciones");
        } 
    };

    useEffect(() => {
        fetchPostulados(currentPage);
    }, [vacanteId, currentPage, filtrosAplicados]);

    useEffect(() =>{
        if(!data || !meta) return
        setPostulados(data);
        setTotalPages(meta.pagination.totalPage);
    }, [data, meta])

    const abrirChat = async (candidatoId, vacanteId) => {
        try {
            const res = await getData(`/api/chats/crear`, "POST", JSON.stringify({ candidatoId, vacanteId }));
            if (!res?.data) return 
            navigate(`/chat/${res.data.id}`);
        } catch (err) {
            exceptionControl(err, logout, navigate, "Error al abrir el chat");
        }
    };

    const sendNotificacion = (estadoPostulacion, idPostulacion) => {
        const postulacion = postulados.find(p => p.nPostulacion === idPostulacion);
        const { asunto, cuerpo } = mensajesNotificaciones(postulacion.vacante.titulo, estadoPostulacion);
        const destinatario = postulacion.candidato.correo ;

        const notificacion = {
            asunto: asunto,
            cuerpo: cuerpo,
            destinatario: destinatario,
            idRemitente: userDataSession.id,
            idVacante: postulacion.vacante.id
        }
        console.log(notificacion)
        sendMessage("/app/enviar/notificacion", notificacion);
    }

    const actualizarEstadoPostulacion = async (nPostulacion, nuevoEstado) => {
        

        const isConfirmed = await QuestionModal(`¿Seguro que deseas marcar esta postulación como "${nuevoEstado}"?`,'question' )

        if (!isConfirmed) return;

        try {
            await send(`/api/postulados/edit/${nPostulacion}`, "PUT", JSON.stringify({ estado: nuevoEstado }));
            modal(`Postulación ${nuevoEstado.toLowerCase()} correctamente`, "success");
            fetchPostulados(currentPage);
            sendNotificacion(nuevoEstado.toLowerCase(), nPostulacion)
        } catch (error) {
            exceptionControl(error, logout, navigate, "Ocurrió un error al actualizar la postulación");
        }
    };

    return (
        <Layout>
            <section className="pagina">
                <h1>Postulados</h1>
                <p>Lista de candidatos que han aplicado a vacantes.</p>

                <div className="p-4 space-y-6">
                    {/* Filtros */}
                    <div className="bg-white shadow-md rounded-lg p-4 flex flex-wrap gap-4 items-end">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">Estado:</label>
                            <select
                                name="estado"
                                onChange={handleOnFilters}
                                value={filtrosLocal.estado}
                                className="border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todos</option>
                                <option value="Espera">En Espera</option>
                                <option value="Aceptada">Aceptada</option>
                                <option value="Rechazada">Rechazada</option>
                                <option value="Cancelada">Canceladas</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">Fecha mínima:</label>
                            <input
                                type="date"
                                name="fechaMinima"
                                value={filtrosLocal.fechaMinima}
                                onChange={handleOnFilters}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">Nombre Candidato:</label>
                            <input
                                type="text"
                                name="nombreCandidato"
                                value={filtrosLocal.nombreCandidato}
                                onChange={handleOnFilters}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={searchFilters}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
                            >
                                Buscar
                            </button>
                            <button
                                onClick={clearFilters}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md"
                            >
                                Borrar filtros
                            </button>
                        </div>
                    </div>

                    {/* Tabla o mensaje */}
                    {loading ? (
                        <p className="text-center text-gray-500 text-lg">Cargando postulados...</p>
                    ) : postulados.length === 0 ? (
                        <SinResultados titulo={"No se encontraron postulaciones."} subTitulo={"Prueba ajustando los filtros o intenta más tarde."}/>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                            
                            <Table listEncabezados={listHeader} listObjetos={postulados} action={[
                                {text:"Ver perfil", funcion: (p) => navigate(`/perfil/candidato/${p.candidato.id}?nPostulacion=${p.nPostulacion}`), clase:"bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-1 px-3 rounded-md"},
                                rol === "EMPRESA" && {text:"abrir Chat", funcion: (p) => abrirChat(p.candidato.id, p.vacante.id) , ocultar: (p)=> (p.estado === 'Espera' || p.estado === 'Aceptada') && p.active && p.vacanteIsActive, clase:"bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-1 px-3 rounded-md"},
                                rol === "EMPRESA" && {text:"Rechazar", funcion: (p) => actualizarEstadoPostulacion(p.nPostulacion, 'Rechazada'), ocultar: (p) =>  p.estado === 'Espera' && p.active && p.vacanteIsActive , clase:" bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-1 px-3 rounded-md"},
                                rol === "EMPRESA" && {text:"Aceptar", funcion: (p) => actualizarEstadoPostulacion(p.nPostulacion, 'Aceptada'), ocultar: (p) => p.estado === 'Espera' && p.active && p.vacanteIsActive  , clase:"bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-1 px-3 rounded-md"} 
                            ]}/>
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                            />
                        </>
                    )}
                </div>

            </section>
        </Layout>
    );
}