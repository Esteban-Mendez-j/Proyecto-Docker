import { useEffect, useState } from 'react';
import { API_CLIENT_URL } from '../services/Api';
import '../style/invitado/empleos.css';
import JobCard from './JobCard.jsx';
import Paginacion from './Paginacion';

const VacantesFavoritas = ({ pageSize = 10 }) => {
  const [vacantes, setVacantes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchFavoritos, setSearchFavoritos] = useState("todos");
  const [searchUserInput, setSearchUserInput] = useState('');
  const [searchCiudadInput, setSearchCiudadInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchTipoInput, setSearchTipoInput] = useState('todos');
  const [searchPostuladoInput, setSearchPostuladoInput] = useState('');
  const [searchIsActive, setSearchIsActive] = useState(true);
  const [fade, setFade] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [onFavoritoChange, setOnFavoritoChange] = useState(false);

  useEffect(() => {
    
    fetchVacantesFav();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1); // Reiniciar a la primera página al cambiar el filtro
    fetchVacantesFav();
  }, [searchFavoritos]);

const fetchVacantesFav = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API_CLIENT_URL}/api/vacantes/favoritas/listar?page=${currentPage - 1}&size=${pageSize}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await res.json();
    console.log("📦 Respuesta del backend:", data);

    // ✅ Guarda solo el array, no todo el objeto
    setVacantes(data.vacantesFavoritas || []);
  } catch (error) {
    console.error("❌ Error al cargar vacantes favoritas:", error);
  } finally {
    setLoading(false);
  }
};
// 🔁 Cada vez que cambie "refresh", se vuelve a ejecutar
useEffect(() => {
  fetchVacantesFav();
}, [refresh]);

// Llama después de eliminar/agregar favorito
const handleToggleFavorito = async () => {
  
  setRefresh(prev => !prev); // Cambia el estado → dispara el useEffect
};

  const aplicarFiltros = () => {
    // Aquí  más filtros 
    fetchVacantesFav();
  };

  const limpiarFiltros = () => {
    setSearchUserInput('');
    setSearchCiudadInput('');
    setSearchInput('');
    setSearchTipoInput('todos');
    setSearchFavoritos('todos');
    setSearchPostuladoInput('');
    fetchVacantesFav();
  };

//   const cambiarEstadoVacante = (id, estado) => {
//     Swal.fire({
//       title: estado ? '¿Reactivar vacante?' : '¿Desactivar vacante?',
//       text: estado ? 'La vacante volverá a estar visible' : 'La vacante será ocultada',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, confirmar',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         console.log(`Cambiando estado de vacante ${id} a ${estado}`);
//         // Aquí podrías llamar al backend para actualizar el estado si lo implementas
//       }
//     });
//   };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Gestión de Vacantes Favoritas</h1>

        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Buscar Empresa..."
            value={searchUserInput}
            onChange={(e) => setSearchUserInput(e.target.value)}
            className="w-44 py-2 pl-4 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Buscar por Ciudad..."
            value={searchCiudadInput}
            onChange={(e) => setSearchCiudadInput(e.target.value)}
            className="w-44 py-2 pl-4 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Buscar por Título..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-44 py-2 pl-4 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={searchFavoritos}
            onChange={(e) => setSearchFavoritos(e.target.value)}
            className="w-44 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los tipos</option>
            <option value="Favoritos">Favoritos</option>
          </select>

          <button
            onClick={aplicarFiltros}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Buscar
          </button>

          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Limpiar
          </button>
        </div>
      </div>


          <div className={`tab-content transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
              <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm p-4">

                  {/* Contenedor con bordes de columnas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {vacantes.map((job) => (
                          <div key={job.nvacantes} className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                              <JobCard 
                              job={job} 
                              onFavoritoChange={handleToggleFavorito}/>
                              
                          </div>
                      ))}
                  </div>

                  {/* Paginación */}
                  <div className="mt-6">
                      <Paginacion
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          totalPages={totalPages}
                      />
                  </div>

              </div>
          </div>
      </div>
  );
};

export default VacantesFavoritas;
