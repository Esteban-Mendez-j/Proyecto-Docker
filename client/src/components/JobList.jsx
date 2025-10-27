import { modal, QuestionModal } from "../services/Modal";
import { API_CLIENT_URL } from '../services/Api';
import '../style/invitado/jobcard.css';
import Paginacion from './Paginacion';
import JobCard from './JobCard';

const JobList = ({ jobs, setCurrentPage, currentPage, totalPages, fetchAllJobs }) => {

  async function cambiarEstado(id, estado) {
    let mensaje = estado ? "activar" : "desactivar";
    const isConfirmed = await QuestionModal(`¿Estás seguro de que deseas ${mensaje} esta vacante?`)
    if (!isConfirmed) return;    // e

    try {
      const response = await fetch(`${API_CLIENT_URL}/api/vacantes/estado/${id}?estado=${estado}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        modal(`Exito al ${mensaje} la vacante`, "success");
        // fetchAllJobs()
      } else {
        modal(`Error al ${mensaje} la vacante`, "error");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      modal("Hubo un problema al intentar modificar la vacante", "error");

    }
  }

  if (!jobs) {
    console.log(jobs)
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
      <div className="jobs-grid">
        {jobs.map((job) => (
          <JobCard job={job} key={job.nvacantes} cambiarEstado={cambiarEstado} />
        ))}
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

