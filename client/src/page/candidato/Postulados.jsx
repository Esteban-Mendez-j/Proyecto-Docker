import { useEffect, useState } from "react";
import Layout from "../../layouts/Layout.jsx";
import "../../style/invitado/empleos.css";
import "../../style/invitado/postulados.css";
import { useNavigate } from "react-router-dom";
import { API_CLIENT_URL } from "../../services/Api.js";
import Loading from "../../components/Loading.jsx";
import { ListSvg } from "../../components/Icons.jsx";
import manejarRespuesta from "../../services/ManejarRespuesta.js";
import Paginacion from '../../components/Paginacion.jsx';

export default function PostuladosPage() {
  const initialFiltro = {
    estado: "",
    fechaMinima: "",
    tituloVacante: "",
    empresa: "",
  };

  const [postulaciones, setPostulaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filtrosLocal, setFiltrosLocal] = useState(initialFiltro);
  const [filtrosAplicados, setFiltrosAplicados] = useState(initialFiltro);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  const fetchPostulaciones = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_CLIENT_URL}/api/postulados/lista/candidato?page=${page - 1}&size=${itemsPerPage}&estado=${filtrosAplicados.estado}&fechaMinima=${filtrosAplicados.fechaMinima}&tituloVacante=${filtrosAplicados.tituloVacante}&empresa=${filtrosAplicados.empresa}`,
        { credentials: "include" }
      );

      const data = await manejarRespuesta(res);
      setPostulaciones(data.postulados);
      setTotalPages(data.totalPage);
    } catch (error) {
      console.error("❌ Error al cargar postulaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostulaciones(currentPage);
  }, [currentPage, filtrosAplicados]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFiltrosLocal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buscar = () => {
    setFiltrosAplicados(filtrosLocal);
    setCurrentPage(1);
  };

  const limpiarFiltros = () => {
    setFiltrosLocal(initialFiltro);
    setFiltrosAplicados(initialFiltro);
    setCurrentPage(1);
  };

  const irADetalleVacante = (id) => {
    navigate(`/empleos/${id}`);
  };

  return (
    <Layout title="Postulaciones | SearchJobs">
      <section className="pagina">
        <h1>Postulaciones</h1>
        <p>Lista de Vacantes a las que aplicaste</p>

        <div>
          {/* Filtros */}
          <div className="mb-8 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Filtrar Postulaciones</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Vacante */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Vacante</label>
                <input
                  type="text"
                  name="tituloVacante"
                  value={filtrosLocal.tituloVacante}
                  onChange={handleFilterChange}
                  placeholder="Ej. Desarrollador"
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Empresa */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  value={filtrosLocal.empresa}
                  onChange={handleFilterChange}
                  placeholder="Ej. Google"
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Estado */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  name="estado"
                  value={filtrosLocal.estado}
                  onChange={handleFilterChange}
                  className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Todos</option>
                  <option value="Espera">En Espera</option>
                  <option value="Aceptada">Aceptada</option>
                  <option value="Rechazada">Rechazada</option>
                </select>
              </div>

              {/* Fecha mínima */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Fecha desde
                  <span
                    className="ml-1 text-gray-400 cursor-help"
                    title="Filtra postulaciones desde esta fecha en adelante."
                  >
                    ⓘ
                  </span>
                </label>

                <input
                  type="date"
                  name="fechaMinima"
                  value={filtrosLocal.fechaMinima}
                  onChange={handleFilterChange}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={buscar}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
              >
                Buscar
              </button>

              <button
                onClick={limpiarFiltros}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
              >
                Limpiar
              </button>
            </div>
          </div>


          {loading ? (
            <Loading />
          ) : postulaciones.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-600">
              <ListSvg name={"info"} height={50} width={50} nameClass=' mb-4 text-gray-400 fill-gray-400' />
              <p className="text-lg font-semibold">No tienes postulaciones aún</p>
              <p className="text-sm text-gray-500 mt-1">Una vez te postules a vacantes, aparecerán aquí.</p>
            </div>
          ) : (
            <>
              {/* Tabla */}
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-6 py-3 text-left text-gray-600">Vacante</th>
                    <th className="px-6 py-3 text-left text-gray-600">Empresa</th>
                    <th className="px-6 py-3 text-left text-gray-600">Ciudad</th>
                    <th className="px-6 py-3 text-left text-gray-600">Modalidad</th>
                    <th className="px-6 py-3 text-left text-gray-600">Fecha</th>
                    <th className="px-6 py-3 text-left text-gray-600">Estado</th>
                    <th className="px-6 py-3 text-left text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {postulaciones.map((p) => (
                    <tr key={p.nPostulacion} className="border-t">
                      <td className="px-6 py-4 text-gray-800 max-w-[200px] truncate" title={p.vacante.titulo}>
                        {p.vacante.titulo}
                      </td>
                      <td className="px-6 py-4 text-gray-800">{p.vacante.nameEmpresa}</td>
                      <td className="px-6 py-4 text-gray-800">{p.vacante.ciudad}</td>
                      <td className="px-6 py-4 text-gray-800">{p.vacante.modalidad}</td>
                      <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                        {p.fechaPostulacion
                          ? new Date(p.fechaPostulacion).toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                          : "-"}
                      </td>


                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-ms font-semibold rounded-full
                          ${p.estado === "Aceptada"
                              ? "bg-green-100 text-green-800"
                              : p.estado === "Rechazada"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }
                        `}
                        >
                          {p.estado || "Espera"}
                        </span>
                      </td>

                      <td className="px-6 py-4 flex flex-wrap gap-3">
                        <button
                          onClick={() => irADetalleVacante(p.vacante.id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-transform duration-200 hover:scale-105 w-32 text-center"
                        >
                          Ver vacante
                        </button>

                        {p.estado !== "Rechazada" && (
                          <button
                            onClick={() => cancelarPostulacion(p.nPostulacion, false, p.vacante.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-transform duration-200 hover:scale-105"
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Paginacion
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
