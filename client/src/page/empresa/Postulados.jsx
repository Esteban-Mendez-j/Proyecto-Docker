import { useParams } from "react-router-dom";
import Layout from "../../layouts/Layout";
import "../../style/invitado/empleos.css"
import "../../style/invitado/postulados.css"
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import Pagination from "../../components/Paginacion";
import manejarRespuesta from "../../services/ManejarRespuesta";
import { API_CLIENT_URL } from "../../services/Api";
import { modal } from "../../services/Modal";
import {sendMessage} from "../../services/Websocket"
import { mensajesNotificaciones } from "../../services/data";

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
    const { vacanteId } = useParams()
    const itemsPerPage = 10;
    const [remitenteId, setRemitenteId] = useState(null)
    const [notificacion, setNotificacion] = useState(initialNotificacion);
    const [postulados, setPostulados] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState("ROLE_INVITADO");
    const [filtroLocal, setFiltroLocal] = useState({
        estado: '',
        fechaMinima: '',
        nombreCandidato: '',
    });
    const [filtroActivo, setFiltroActivo] = useState({ ...filtroLocal });

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
        const { estado, fechaMinima, nombreCandidato } = filtroActivo;

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

    const handleBuscar = () => {
        setFiltroActivo({ ...filtroLocal });
        setCurrentPage(1);
    };

    const handleReset = () => {
        const valoresIniciales = { estado: '', fechaMinima: '', nombreCandidato: '' };
        setFiltroLocal(valoresIniciales);
        setFiltroActivo(valoresIniciales);
        setCurrentPage(1);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFiltroLocal((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        fetchPostulados(currentPage);
    }, [vacanteId, currentPage, filtroActivo]);

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
            await Swal.fire({ text: 'No se pudo abrir el chat.', icon: 'info' });
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
        const { isConfirmed } = await Swal.fire({
            title: 'Confirmar acción',
            text: `¿Seguro que deseas marcar esta postulación como "${nuevoEstado}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
        });

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

            if (!res.ok) { await Swal.fire({ text: 'Error al actualizar estado', icon: 'error' }); }

            modal(`Postulación ${nuevoEstado.toLowerCase()} correctamente`, "success");
            fetchPostulados(currentPage);
            sendNotificacion(nuevoEstado.toLowerCase(), nPostulacion)
        } catch (error) {
            console.error('Error al actualizar:', error);
            await Swal.fire({ text: 'Ocurrió un error al actualizar la postulación', icon: 'error' });
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
                                onChange={handleFilterChange}
                                value={filtroLocal.estado}
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
                                value={filtroLocal.fechaMinima}
                                onChange={handleFilterChange}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">Nombre Candidato:</label>
                            <input
                                type="text"
                                name="nombreCandidato"
                                value={filtroLocal.nombreCandidato}
                                onChange={handleFilterChange}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleBuscar}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
                            >
                                Buscar
                            </button>
                            <button
                                onClick={handleReset}
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
                                <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Nombre</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Afinidad</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Fecha</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Estado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">CV</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Perfil</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Chat</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {postulados.map((postulado) => (
                                            <tr key={postulado.candidato.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {postulado.candidato.nombre}
                                                    {!postulado.active && (
                                                        <span className="block text-xs text-yellow-600 font-medium">
                                                            Postulación desactivada
                                                        </span>
                                                    )}
                                                    {!postulado.vacanteIsActive && (
                                                        <span className="block text-xs text-red-600 font-medium">
                                                            Vacante deshabilitada
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {postulado.porcentajePrediccion || '-'} %
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {postulado.fechaPostulacion || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {postulado.estado || 'Espera'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <a
                                                        href={`${API_CLIENT_URL}/pdf/${postulado.candidato.curriculo}`}
                                                        target="_blank"
                                                        className="text-blue-500 hover:underline font-medium"
                                                    >
                                                        Ver CV
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <a
                                                        href={`/perfil/candidato/${postulado.candidato.id}?nPostulacion=${postulado.nPostulacion}`}
                                                        className="text-blue-500 hover:underline font-medium"
                                                    >
                                                        Ver perfil
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {(postulado.estado === 'Espera' || postulado.estado === 'Aceptada') &&
                                                        postulado.active &&
                                                        postulado.vacanteIsActive &&
                                                        userRole === "EMPRESA" && (
                                                            <button
                                                                onClick={() =>
                                                                    abrirChat(postulado.candidato.id, postulado.vacante.id)
                                                                }
                                                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-1 px-3 rounded-md"
                                                            >
                                                                Abrir chat
                                                            </button>
                                                        )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap space-y-2">
                                                    {postulado.estado === 'Espera' &&
                                                        postulado.active &&
                                                        postulado.vacanteIsActive &&
                                                        userRole === "EMPRESA" && (
                                                            <>
                                                                <button
                                                                    className="block w-full bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-1 px-3 rounded-md"
                                                                    onClick={() =>
                                                                        actualizarEstadoPostulacion(postulado.nPostulacion, 'Rechazada')
                                                                    }
                                                                >
                                                                    Rechazar
                                                                </button>
                                                                <button
                                                                    className="block w-full bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-1 px-3 rounded-md"
                                                                    onClick={() =>
                                                                        actualizarEstadoPostulacion(postulado.nPostulacion, 'Aceptada')
                                                                    }
                                                                >
                                                                    Aceptar
                                                                </button>
                                                            </>
                                                        )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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