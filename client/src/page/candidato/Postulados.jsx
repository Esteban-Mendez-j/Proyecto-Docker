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
import useFiltro from "../../hooks/useFiltro.jsx";
import Table from "../../components/Table.jsx";
import { modalResponse, QuestionModal } from "../../services/Modal.js";
import SinResultados from "../../components/SinResultados.jsx";

export default function PostuladosPage() {
  const initialFiltro = {
    estado: "",
    fechaMinima: "",
    tituloVacante: "",
    empresa: "",
  };

  const listHeader = {
    Vacante: {nameAtributo:"vacante.titulo", clase:"text-gray-800"},
    Empresa: {nameAtributo:"vacante.nameEmpresa", clase:"text-gray-800"},
    Ciudad: {nameAtributo:"vacante.ciudad", clase:"text-gray-800"},
    Modalidad: {nameAtributo:"vacante.modalidad", clase:"text-gray-800"},
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
    Estado: {nameAtributo:"estado", clase: (p) => {return `text-${ p.estado === "Aceptada" ? "green" : p.estado === "Rechazada" ? "red" : "blue" }-500 font-bold` }},
  }

  const [postulaciones, setPostulaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ filtrosLocal, filtrosAplicados, handleOnFilters, clearFilters, searchFilters ] = useFiltro(initialFiltro, setCurrentPage, "FiltrosCandidatoPostulado");
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

  const irADetalleVacante = (id) => {
    navigate(`/empleos/${id}`);
  };

  const cancelarPostulacion = async (nPostulacion, estado, nVacante) => {
  
    const isConfirmed = await QuestionModal('¿Estás seguro de que deseas cancelar esta postulación?', "question")

    if (!isConfirmed) return;   

    try {
      const res = await fetch(`${API_CLIENT_URL}/api/postulados/cancelar/${nPostulacion}?estado=${estado}&nvacante=${nVacante}`, {
        method: "PATCH",
        credentials: "include",
      });

      if (res.status === 204) {
        modalResponse("Postulación cancelada exitosamente.",'success')
        fetchPostulaciones(currentPage);
      } else {
        modalResponse("No se pudo cancelar la Postulacion",'error')

      }
    } catch (error) {
        modalResponse("Ocurrió un error al cancelar la postulación.",'error')
    }
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
                  onChange={handleOnFilters}
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
                  onChange={handleOnFilters}
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
                  onChange={handleOnFilters}
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
                  onChange={handleOnFilters}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={searchFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
              >
                Buscar
              </button>

              <button
                onClick={clearFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
              >
                Limpiar
              </button>
            </div>
          </div>


          {loading ? (
            <Loading />
          ) : postulaciones.length === 0 ? (
              <SinResultados titulo={"No se encontraron Postulaciones"}
                subTitulo={"Revisa los filtros o Realiza una postulacion"} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table listEncabezados={listHeader} listObjetos={postulaciones} action={[
                  { text: "Ver vacante", funcion: (p) => irADetalleVacante(p.vacante.id), clase: "bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-transform duration-200 hover:scale-105 w-32 text-center" },
                  { text: "Cancelar", funcion: (p) => cancelarPostulacion(p.nPostulacion, false, p.vacante.id), clase: "bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-transform duration-200 hover:scale-105" },
                ]} />
              </div>
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
