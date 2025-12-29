import { modal, modalTime, QuestionModal } from "../services/Modal";
import { API_CLIENT_URL } from "../services/Api";
import "../style/invitado/jobcard.css";
import Paginacion from "./Paginacion";
import JobCard from "./JobCard";
import { useContext, useEffect, useState } from "react";
import { useSendForm } from "../hooks/useFetch";
import { RoleContext } from "../services/RoleContext";
import Table from "./Table";
import { Link, useNavigate } from "react-router-dom";
import { ListSvg } from "./Icons";
import { toggleFavoritoRequest } from "../services/ToggleFavoritosRequest";

const JobList = ({
  jobs,
  setCurrentPage,
  currentPage,
  totalPages,
  fetchAllJobs,
  presentacion,
  loading,
  verPrediccion,
  setVerPrediccion,
  setFilteredJobs
}) => {
  const {rol} = useContext(RoleContext);
  const { data ,send} = useSendForm();
  const navigate = useNavigate();

  const handleToggleFavorito = async (nvacantes) => {
    await toggleFavoritoRequest(nvacantes);
    fetchAllJobs()
    // setFilteredJobs( prev => prev.map((job) => 
    //   job.nvacantes === nvacantes? {...job, vacanteGuardada: !job.vacanteGuardada} : job
    // ))
  };

  const listHeader = {
    ...(rol != "EMPRESA" && {
      Empresa: {
        clase: "flex items-center gap-2 max-w-[180px] truncate overflow-hidden whitespace-nowrap",
        modificacion: (job) => {
          return (
            <>
              <img
                src={
                  job.imagenEmpresa
                    ? `${API_CLIENT_URL}/img/${job.imagenEmpresa}`
                    : `${API_CLIENT_URL}/images/imgEmpresa.png`
                }
                alt={job.nameEmpresa}
                className="w-10 h-10 rounded-md flex-shrink-0"
              />
              <span className="truncate">{job.nameEmpresa}</span>
            </>
          )
        }
      }
    }),
    Titulo: {
      clase: "font-semibold max-w-[200px] truncate overflow-hidden whitespace-nowrap",
      modificacion: (job) => {
        return (
          <Link
            title={job.titulo}
            to={`/empleos/${job.nvacantes}`}
            className="hover:underline"
            style={{ color: "var(--primary)" }}
          >
            {job.titulo}
          </Link>
        )
      }
    },
    Ciudad: { nameAtributo: "ciudad" },
    Tipo: {
      modificacion: (vacantes) => {
        return (
          <span className={`px-2 inline-flex text-xs font-semibold rounded-full 
                        ${vacantes.tipo === 'Vacante' ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
            }`}>
            {vacantes.tipo}
          </span>
        )
      }
    },
    Experiencia: { modificacion: (vacantes) => { return `${vacantes.experiencia}${vacantes.experiencia > 1 ? " años" : " año"}` } },
    ...((rol == "CANDIDATO" && verPrediccion) && { Afinidad: { modificacion: (vacantes) => { return `${vacantes.prediccion}%` } } }),
    Postulaciones: { nameAtributo: "totalpostulaciones" },
    ...(rol == "CANDIDATO" && {
      Acciones: {
        modificacion: (job) => {
          return (
            <button
              className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors duration-200 ml-auto z-[100]"
              onClick={(e) => {
                e.preventDefault(); 
                e.stopPropagation();
                handleToggleFavorito(job.nvacantes);
              }}
              title="Agregar a favoritos"
            >
              <ListSvg name={"estrella"} height={10} width={10} nameClass={`w-5 h-5 transition-colors duration-200 ${job.vacanteGuardada ? "text-yellow-400 fill-yellow-400" : "text-gray-400 fill-gray-100 "}`} />
            </button>
          )
        }
      }
    }),

  } 

  async function cambiarEstado(id, estado) {
    let mensaje = estado ? "activar" : "desactivar";
    const isConfirmed = await QuestionModal(
      `¿Estás seguro de que deseas ${mensaje} esta vacante?`
    );
    if (!isConfirmed) return; // e

    try {
      const response = await fetch(
        `${API_CLIENT_URL}/api/vacantes/estado/${id}?estado=${estado}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        modalTime(`Exito al ${mensaje} la vacante`)
        fetchAllJobs()
      } else {
        modal(`Error al ${mensaje} la vacante`, "error");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      modal("Hubo un problema al intentar modificar la vacante", "error");
    }
  }
     
  useEffect(() => {
    if (rol === "CANDIDATO") {
      send("/api/candidatos/perfil", "GET");
    }
  }, [rol]);

  useEffect(() => {
    if (!data) return;

    const { experiencia, aptitudes, nivelEducativo } = data.candidato;

    const tieneExperiencia = experiencia && experiencia.trim() !== "";
    const tieneAptitudes = Array.isArray(aptitudes) && aptitudes.length > 0;
    const tieneNivel = nivelEducativo && nivelEducativo.trim() !== "";

    if (tieneExperiencia && tieneAptitudes && tieneNivel) {
      setVerPrediccion(true);
    } else {
      setVerPrediccion(false);
    }
  }, [data])
  

  if (!jobs || jobs.length == 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No se encontraron resultados
        </h2>
        <p className="text-gray-500">
          Intenta cambiar los filtros o revisar tu búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className={presentacion == 1 ? "jobs-grid" : "jobs-column"}>
        {presentacion == 3 ? (
          <div className="w-full overflow-x-auto">
            <Table listEncabezados={listHeader} listObjetos={jobs} action={rol === "EMPRESA"?[
              {
                text: "Editar",
                funcion: (job) => { navigate(`/empresa/editar/vacantes/${job.nvacantes}`) },
                clase: "px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition"
              },
              {
                text: "Desactivar", funcion: (job) => { cambiarEstado(job.nvacantes, false) },
                ocultar: (job) => job.activaPorEmpresa,
                clase: "px-3 py-1.5 text-sm font-semibold rounded-md shadow bg-red-500 hover:bg-red-600 text-white"
              },
              {
                text: "Activar", funcion: (job) => cambiarEstado(job.nvacantes, true),
                ocultar: (job) => !job.activaPorEmpresa,
                clase: "px-3 py-1.5 text-sm font-semibold rounded-md shadow bg-green-500 hover:bg-green-600 text-white"
              }
            ]: []} />

          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              job={job}
              key={job.nvacantes}
              cambiarEstado={cambiarEstado}
              verSeccionEdit={true}
              presentaion={presentacion}
              fetchAllJobs={fetchAllJobs}
              verPrediccion={verPrediccion}
            />
          ))
        )}
      </div>
      <Paginacion
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default JobList;
