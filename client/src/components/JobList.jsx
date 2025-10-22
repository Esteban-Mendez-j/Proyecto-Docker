import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_CLIENT_URL } from '../services/Api';
import '../style/invitado/jobcard.css';
import Paginacion from './Paginacion';
import JobCard from './JobCard';


const JobList = ({ jobs, rol, setCurrentPage, currentPage, totalPages, fetchAllJobs }) => {

  async function cambiarEstado(id, estado) {
    let mensaje = estado? "activar":"desactivar";
    const { isConfirmed } = await Swal.fire({
      title: 'Confirmar acción',
      text: `¿Estás seguro de que deseas ${mensaje} esta vacante?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,      // pone Cancelar a la izquierda
    });
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
        await Swal.fire({ text: `Exito al ${mensaje} la vacante`, icon: 'success' });        
        fetchAllJobs()
      } else {
        await Swal.fire({ text: `Error al ${mensaje} la vacante.`, icon: 'error' });    
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      await Swal.fire({ text: "Hubo un problema al intentar eliminar la vacante.", icon: 'error' });    }
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
          <JobCard job={job} key={job.nvacantes} />
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

