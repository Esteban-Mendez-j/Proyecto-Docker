
import { Link } from "react-router-dom";
import Layout from "../../layouts/Layout";
import { API_CLIENT_URL } from "../../services/Api";
import { useEffect, useState } from "react";
import '../../style/invitado/empleos.css';
import Pagination from "../../components/Paginacion";
import { manejarRespuesta } from '../../services/ManejarRespuesta';
import useFiltro from "../../hooks/useFiltro";

export default function AdminVacantes() {
  const [vacantes, setVacantes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [fade, setFade] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const initialFiltro = {
    titulo: "" ,
    ciudad:"" ,
    nameEmpresa: "",
    tipo: "todos",
    isActive: true,
    totalpostulaciones: ""
  };

  const [filtrosLocal, filtrosAplicados, handleOnFilters, clearFilters, searchFilters, handleOnFilterAplicados ] = useFiltro(initialFiltro, setCurrentPage, "FiltrosAdminVacantes");

  const fetchVacantes = async () => {
    try {
      const res = await fetch(`${API_CLIENT_URL}/api/admin/listar/filtrovacantes?page=${currentPage - 1}&size=${pageSize}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(filtrosAplicados)
      });

      const data = await manejarRespuesta(res);
      setTotalElements(data.totalElements);
      setVacantes(data.vacantes || []);
      setTotalPages(data.totalPage);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleOnIsActive = (e) => {
    e.target = {name:"isActive", value:!filtrosAplicados.isActive}
    handleOnFilterAplicados(e)
  }

  useEffect(() => {
    fetchVacantes();
  }, [currentPage, pageSize, filtrosAplicados]);

  const cambiarEstadoVacante = async (nvacante, estado) => {
    const { value: motivo } = await Swal.fire({
      title: `Escribe el motivo ${estado ? 'de activación' : 'de desactivación'} de la vacante`,
      input: 'text',
      inputLabel: 'Comentario',
      inputPlaceholder: 'Escribe aquí...',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
    });

    // Si canceló o no escribió nada
    if (!motivo) {
      return Swal.fire('Cancelado', 'No se cambió el estado de la vacante.', 'info');
    }

    try {
      const res = await fetch(`${API_CLIENT_URL}/api/admin/cambiar-estado/vacantes?nvacante=${nvacante}&estado=${estado}&comentario=${encodeURIComponent(motivo)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      // if (!res.ok || ) throw new Error('Error al cambiar el estado de la vacante');

      await Swal.fire('Éxito', 'El estado de la vacante fue actualizado.', 'success');

      await fetchVacantes(); // Esto ya actualiza las vacantes

    } catch (err) {
      console.error('Error al cambiar el estado de la vacante:', err);
      await Swal.fire('Error', 'Ocurrió un error al cambiar el estado.', 'error');
    }
  };

  return (
    <Layout title="Gestión de Vacantes | SearchJobs">

      <br />
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1">
            <div className="flex-1 max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold">Gestión de Vacantes</h1>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Buscar Empresa..."
                    name="nameEmpresa"
                    value={filtrosLocal.nameEmpresa}
                    onChange={handleOnFilters}
                    className="w-44 py-2 pl-4 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Buscar por Ciudad..."
                    name="ciudad"
                    value={filtrosLocal.ciudad}
                    onChange={handleOnFilters}
                    className="w-44 py-2 pl-4 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Buscar por Título..."
                    name="titulo"
                    value={filtrosLocal.titulo}
                    onChange={handleOnFilters}
                    className="w-44 py-2 pl-4 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    name="tipo"
                    value={filtrosLocal.tipo}
                    onChange={handleOnFilters}
                    className="w-44 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todos">
                      Todos los tipos
                    </option>
                    <option value="Vacante">Vacante</option>
                    <option value="Practica">Práctica</option>
                  </select>
                  <input
                    placeholder="Buscar por Postulacion.."
                    type="number"
                    name="totalpostulaciones"
                    value={filtrosLocal.totalpostulaciones}
                    onChange={handleOnFilters}
                    min="0" // mínimo valor permitido
                    className="w-44 py-2 pl-4 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button onClick={searchFilters} className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Buscar
                  </button>
                  <button onClick={handleOnIsActive} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                    {filtrosAplicados.isActive ? 'Ver Baneados' : 'Ver Activos'}
                  </button>
                  <button onClick={clearFilters} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-gray-600">
                    Limpiar Filtros
                  </button>

                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    {filtrosAplicados.isActive ? (
                      <button className="px-4 py-3 font-medium text-blue-600 border-b-2 border-blue-600 tab-button active">
                        Vacantes Activas ({totalElements})
                      </button>
                    ) : (<button className="px-4 py-3 font-medium text-blue-600 border-b-2 border-blue-600 tab-button active">
                      Vacantes Desactivadas ({totalElements})
                    </button>

                    )}
                  </nav>
                </div>
              </div>

              {/* Tabla */}
              <div className={`tab-content transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                <div className="overflow-x-auto bg-white border border-gray-100 rounded-lg shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className={`px-4 py-3 text-left text-xs font-semibold ${filtrosAplicados.isActive ? 'text-blue-900 uppercase' : 'text-red-900 uppercase'}`}>Título</th>
                        <th className={`px-4 py-3 text-left text-xs font-semibold ${filtrosAplicados.isActive ? 'text-blue-900 uppercase' : 'text-red-900 uppercase'}`}>Empresa</th>
                        <th className={`px-4 py-3 text-left text-xs font-semibold ${filtrosAplicados.isActive ? 'text-blue-900 uppercase' : 'text-red-900 uppercase'}`}>Ubicación</th>
                        <th className={`px-4 py-3 text-left text-xs font-semibold ${filtrosAplicados.isActive ? 'text-blue-900 uppercase' : 'text-red-900 uppercase'}`}>Tipo</th>
                        {filtrosAplicados.isActive ? (
                          <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Postulaciones</th>
                        ) : (
                          <th className="px-4 py-3 text-left text-xs font-semibold text-red-900 uppercase">Motivo</th>
                        )}
                        <th className={`px-4 py-3 text-right text-xs font-semibold ${filtrosAplicados.isActive ? 'text-blue-900 uppercase' : 'text-red-900 uppercase'}`}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {vacantes.map((vacantes) => (
                        <tr key={vacantes.nvacantes}>
                          <td className="px-4 py-4">{vacantes.titulo}</td>
                          <td className="px-4 py-4">{vacantes.nameEmpresa}</td>
                          <td className="px-4 py-4">{vacantes.ciudad}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${vacantes.tipo === 'Vacante' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                              {vacantes.tipo}
                            </span>
                          </td>
                          {filtrosAplicados.isActive ? (<td className="px-4 py-4">{vacantes.totalpostulaciones}</td>
                          ) : (
                            <td className="px-4 py-4">{vacantes.comentarioAdmin}</td>
                          )}

                          <td className="px-4 py-4 flex justify-center">
                            <a href={`/empleos/${vacantes.nvacantes}`} className="mr-3 text-blue-600 hover:text-blue-900">Ver</a>
                            {filtrosAplicados.isActive ? (
                              <button
                                className="mr-3 text-red-600 hover:text-red-500"
                                onClick={() => cambiarEstadoVacante(vacantes.nvacantes, false)}
                              >
                                Desactivar
                              </button>
                            ) : (
                              <button
                                className="mr-3 text-green-800 hover:text-green-500"
                                onClick={() => cambiarEstadoVacante(vacantes.nvacantes, true)}
                              >
                                Reactivar
                              </button>
                            )}
                            <Link to={`/empresa/postulados/${vacantes.nvacantes}`} className="text-blue-600 hover:text-blue-900">
                              Postulados
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                  />

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .tab-button.active {
          border-bottom-width: 2px;
        }
      `}</style>
    </Layout>
  );
}
