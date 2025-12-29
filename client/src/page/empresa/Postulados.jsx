import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../layouts/Layout";
import "../../style/invitado/empleos.css"
import "../../style/invitado/postulados.css"
import { useEffect, useState } from "react";
import Pagination from "../../components/Paginacion";
import manejarRespuesta from "../../services/ManejarRespuesta";
import { API_CLIENT_URL } from "../../services/Api";
import { modal, modalResponse, QuestionModal } from "../../services/Modal";
import {sendMessage} from "../../services/Websocket"
import { mensajesNotificaciones } from "../../services/data";
import useFiltro from "../../hooks/useFiltro";
import Table from "../../components/Table";

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
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [ filtrosLocal, filtrosAplicados, handleOnFilters, clearFilters, searchFilters ] = useFiltro(initialFiltro, setCurrentPage, "FiltrosEmpresaPostulado");
    const [remitenteId, setRemitenteId] = useState(null)
    const [postulados, setPostulados] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState("ROLE_INVITADO");

    const fetchUserRole = async () => {
        try {
            const res = await fetch(`${API_CLIENT_URL}/api/usuarios/rol`, {
                credentials: 'include',
            });
            const data = await manejarRespuesta(res);
            if (!data) { return; }
            setUserRole(data.rolPrincipal);
            setRemitenteId(data.id)
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    };

    const fetchPostulados = async (page = 1) => {
        setLoading(true);
        const { estado, fechaMinima, nombreCandidato } = filtrosAplicados;

        const params = new URLSearchParams({
            nvacantes: vacanteId,
            estado: estado || '',
            fechaMinima: fechaMinima || '',
            nombreCandidato: nombreCandidato || '',
            page: page - 1,
            size: itemsPerPage,
        });

        try {
            const res = await fetch(`${API_CLIENT_URL}/api/postulados/lista?${params}`, {
                credentials: 'include',
            });

            const data = await manejarRespuesta(res);
            if (!data) { return; }
            setPostulados(data.postulados);
            setTotalPages(data.totalPage);
        } catch (error) {
            console.error('❌ Error al cargar postulados:', error);
        } finally {
            setLoading(false);
        }
        fetchUserRole()
    };

    useEffect(() => {
        fetchPostulados(currentPage);
    }, [vacanteId, currentPage, filtrosAplicados]);

    const abrirChat = async (candidatoId, vacanteId) => {
        try {
            const response = await fetch(`${API_CLIENT_URL}/api/chats/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ candidatoId, vacanteId }),
                credentials: 'include'
            });

            const chat = await manejarRespuesta(response);
            if (!chat) { return }
            window.location.href = `/chat/${chat.id}`;
        } catch (err) {
            console.error('Error al abrir el chat:', err);
            await modalResponse('No se pudo abrir el chat.', "info");
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
            idRemitente: remitenteId,
            idVacante: postulacion.vacante.id
        }

        sendMessage("/app/enviar/notificacion", notificacion);
    }

    const actualizarEstadoPostulacion = async (nPostulacion, nuevoEstado) => {
        

        const isConfirmed = await QuestionModal(`¿Seguro que deseas marcar esta postulación como "${nuevoEstado}"?`,'question' )

        if (!isConfirmed) return;

        try {
            const res = await fetch(`${API_CLIENT_URL}/api/postulados/edit/${nPostulacion}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ estado: nuevoEstado }),
            });

            if (!res.ok) { await modalResponse('Error al actualizar estado','error' ); }

            modal(`Postulación ${nuevoEstado.toLowerCase()} correctamente`, "success");
            fetchPostulados(currentPage);
            sendNotificacion(nuevoEstado.toLowerCase(), nPostulacion)
        } catch (error) {
            console.error('Error al actualizar:', error);
            await modalResponse('Ocurrió un error al actualizar la postulación', "error");
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
                        <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-700 font-medium text-lg">No hay postulaciones registradas.</p>
                            <p className="text-yellow-600 text-sm">Prueba ajustando los filtros o intenta más tarde.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                            
                            <Table listEncabezados={listHeader} listObjetos={postulados} action={[
                                {text:"Ver perfil", funcion: (p) => navigate(`/perfil/candidato/${p.candidato.id}?nPostulacion=${p.nPostulacion}`), clase:"bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-1 px-3 rounded-md"},
                                userRole === "EMPRESA" && {text:"abrir Chat", funcion: (p) => abrirChat(p.candidato.id, p.vacante.id) , ocultar: (p)=> (p.estado === 'Espera' || p.estado === 'Aceptada') && p.active && p.vacanteIsActive, clase:"bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-1 px-3 rounded-md"},
                                userRole === "EMPRESA" && {text:"Rechazar", funcion: (p) => actualizarEstadoPostulacion(p.nPostulacion, 'Rechazada'), ocultar: (p) =>  p.estado === 'Espera' && p.active && p.vacanteIsActive , clase:" bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-1 px-3 rounded-md"},
                                userRole === "EMPRESA" && {text:"Aceptar", funcion: (p) => actualizarEstadoPostulacion(p.nPostulacion, 'Aceptada'), ocultar: (p) => p.estado === 'Espera' && p.active && p.vacanteIsActive  , clase:"bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-1 px-3 rounded-md"} 
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