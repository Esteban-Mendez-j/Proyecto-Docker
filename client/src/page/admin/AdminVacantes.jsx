
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../layouts/layout.jsx";
import { API_CLIENT_URL } from "../../services/Api.js";
import { useEffect, useState } from "react";
import '../../style/invitado/empleos.css';
import Pagination from "../../components/Paginacion.jsx";
import { manejarRespuesta } from '../../services/ManejarRespuesta.js';
import useFiltro from "../../hooks/useFiltro.jsx";
import Table from "../../components/Table.jsx";
import { inputModal, modalResponse, modal, modalTime } from "../../services/Modal.js";
import SinResultados from "../../components/SinResultados.jsx"
import "../../style/usuarios/filtros.css"

export default function AdminVacantes() {
  const navigate = useNavigate();
  const [vacantes, setVacantes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [fade, setFade] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const initialFiltro = {
    titulo: "",
    ciudad: "",
    nameEmpresa: "",
    tipo: "todos",
    isActive: true,
    totalpostulaciones: ""
  };

  const [filtrosLocal, filtrosAplicados, handleOnFilters, clearFilters, searchFilters, handleOnFilterAplicados ] = useFiltro(initialFiltro, setCurrentPage, "FiltrosAdminVacantes");


  const listHeaders = {
    Título: {nameAtributo:"titulo"},
    Empresa: {nameAtributo:"nameEmpresa"},
    Ubicación: {nameAtributo:"ciudad"},
    Tipo: {
       modificacion: (vacantes) => {
        return (
          <span className={`px-2 inline-flex text-xs font-semibold rounded-full uppercase
              ${vacantes.tipo === 'Vacante' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
            {vacantes.tipo}
          </span>
        )
      }
    },
    ...(
      filtrosAplicados.isActive ?
        { Postulaciones: { nameAtributo: "totalpostulaciones" } }
        :
        { Motivo: { nameAtributo: "comentarioAdmin" } }
    ),
  }
 
 
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
      setTotalElements(data.meta.pagination.totalElements);
      setVacantes(data.data || []);
      setTotalPages(data.meta.pagination.totalPage);
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
    const { value: motivo } = await inputModal(`Escribe el motivo ${estado ? 'de activación' : 'de desactivación'} de la vacante`)

    // Si canceló o no escribió nada
    if (!motivo) {
      return modal('No se cambió el estado de la vacante.', 'info');
    }

    try {
      const res = await fetch(`${API_CLIENT_URL}/api/admin/estado/vacante?nvacante=${nvacante}&estado=${estado}&comentario=${encodeURIComponent(motivo)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const json = await res.json()
      if (!res.ok ) throw new Error(json.error.message);

      modalTime('El estado de la vacante fue actualizado');
      fetchVacantes(); 

    } catch (err) {
      console.error('Error al cambiar el estado de la vacante:', err);
      await modalResponse(err ||'Ocurrió un error al cambiar el estado.', 'error');
    }
  };

  return (
    <Layout title="Gestión de Vacantes | SearchJobs">

      <br />
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1">
            <div className="flex-1 max-w-7xl mx-auto px-4">
              <h1 className="text-2xl font-bold">Gestión de Vacantes</h1>
              {/* Filtros de vacantes */}
              <div className="admin-filtros">
                <h2 className="admin-filtros-titulo">
                  Filtrar vacantes
                </h2>
                <div className="admin-filtros-grid">

                  {/* Filtro por empresa */}
                  <div className="admin-filtro-campo">
                    <label htmlFor="nameEmpresa">Nombre de la empresa</label>
                    <input
                      id="nameEmpresa"
                      type="text"
                      placeholder="Buscar empresa..."
                      name="nameEmpresa"
                      value={filtrosLocal.nameEmpresa}
                      onChange={handleOnFilters}
                      className="admin-filtro-control"
                    />
                  </div>

                  {/* Filtro por ciudad */}
                  <div className="admin-filtro-campo">
                    <label htmlFor="ciudad">Ciudad</label>
                    <input
                      id="ciudad"
                      type="text"
                      placeholder="Buscar por ciudad..."
                      name="ciudad"
                      value={filtrosLocal.ciudad}
                      onChange={handleOnFilters}
                      className="admin-filtro-control"
                    />
                  </div>

                  {/* Filtro por título */}
                  <div className="admin-filtro-campo">
                    <label htmlFor="titulo">Título</label>
                    <input
                      id="titulo"
                      type="text"
                      placeholder="Buscar por título..."
                      name="titulo"
                      value={filtrosLocal.titulo}
                      onChange={handleOnFilters}
                      className="admin-filtro-control"
                    />
                  </div>

                  {/* Filtro por tipo */}
                  <div className="admin-filtro-campo">
                    <label htmlFor="tipo">Tipo</label>
                    <select
                      id="tipo"
                      name="tipo"
                      value={filtrosLocal.tipo}
                      onChange={handleOnFilters}
                      className="admin-filtro-control"
                    >
                      <option value="todos">Todos los tipos</option>
                      <option value="Vacante">Vacante</option>
                      <option value="Practica">Práctica</option>
                    </select>
                  </div>

                  {/* Filtro por postulaciones */}
                  <div className="admin-filtro-campo">
                    <label htmlFor="totalpostulaciones">
                      Mínimo de postulaciones
                    </label>
                    <input
                      id="totalpostulaciones"
                      type="number"
                      name="totalpostulaciones"
                      placeholder="Mínimo de postulaciones..."
                      value={filtrosLocal.totalpostulaciones}
                      onChange={handleOnFilters}
                      min="0"
                      className="admin-filtro-control"
                    />
                  </div>

                  {/* Botones */}
                  <div className="admin-filtros-botones">
                    <button
                      type="button"
                      onClick={searchFilters}
                      className="admin-btn-buscar"
                    >
                      Buscar
                    </button>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="admin-btn-limpiar"
                    >
                      Limpiar
                    </button>  
                  </div>
                  <div className="admin-filtros-botones">
                    <button
                      type="button"
                      onClick={handleOnIsActive}
                      className="admin-btn-estado"
                    >
                      {filtrosAplicados.isActive
                        ? "Ver Desactivadas"
                        : "Ver Activas"}
                    </button>
                  </div>

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

                  {vacantes.length === 0 ?
                    (<SinResultados titulo={"No se encontraron resultados"}
                      subTitulo={"Revisa los Filtros o espera a que se registre una Vacante"} />
                    )
                    :
                    (<Table listEncabezados={listHeaders} listObjetos={vacantes} mobileCards={true}
                      action={[
                      { text: "Ver", funcion: (vacantes) => navigate(`/empleos/${vacantes.nvacantes}`), clase: "mr-3 text-blue-600 hover:text-blue-900" },
                      { text: "Postulados", funcion: (vacantes) => navigate(`/empresa/postulados/${vacantes.nvacantes}`), clase: "text-blue-600 hover:text-blue-900" },
                      filtrosAplicados.isActive ?
                        {
                          text: "Desactivar",
                          funcion: (vacantes) => cambiarEstadoVacante(vacantes.nvacantes, false),
                          clase: "mr-3 text-red-600 hover:text-red-500",
                        }
                        :
                        {
                          text: "Reactivar",
                          funcion: (vacantes) => cambiarEstadoVacante(vacantes.nvacantes, true),
                          clase: "mr-3 text-green-600 hover:text-green-500"
                        }
                    ]} />)
                  }
                  {( vacantes && vacantes.length != 0) && <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                  />}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
    </Layout>
  );
}
