import { useEffect, useState } from 'react';
import '../styles/empleos/empleos.css';
import Paginacion from './Paginacion';
import { manejarRespuesta } from '../javascripts/ManejarRespuesta';
import { API_CLIENT_URL } from '../javascripts/Api';


const VacantesDesactivadas = () => {
  const [vacantes, setVacantes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [fade, setFade] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
    const fetchVacantes = async () => {
      try {
        const res = await fetch(`${API_CLIENT_URL}/api/admin/listVacantes/desactivadas?page=${currentPage-1}&size=${pageSize}`,{
          credentials: 'include' 
        })
          
        const data = await manejarRespuesta(res); 
        setTotalElements(data.totalElements || 0);
        setVacantes(data.vacantesDesactivadas || []);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error('Error:', err);
      }
    };

     fetchVacantes();
  }, [currentPage, pageSize]);

//     const verVacante = (idUsuario) => {
//     fetch(`${API_CLIENT_URL}/api/candidatos/perfil?idUsuario=${idUsuario}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error('Error al obtener el perfil');
//         return res.json();
//       })
//       .then(() => {
//         window.location.href = `/perfil/candidato?idUsuario=${idUsuario}`;
//       })
//       .catch((err) => console.error('Error al obtener el perfil:', err));
//   };

  const ActivarVacante = (nvacante, motivo = 'Falso Positivo') => {
    fetch(`${API_CLIENT_URL}/api/admin/cambiar-estado/vacantes?nvacante=${nvacante}&estado=true&comentario=${motivo}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },credentials: 'include' 
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al banear vacante');
        return res.json();
      })
      .then(() => {
        // Recargar lista después de banear
        return fetch(`${API_CLIENT_URL}/api/admin/listVacantes/desactivadas?page=${currentPage-1}&size=${pageSize}`,{
          credentials: 'include' 
        });
      })
      .then((res) => res.json())
      .then((data) => setVacantes(data.vacantesDesactivadas || []))
      .catch((err) => console.error('Error al activar vacante:', err));
  };
  return (
    <div>
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button className="px-4 py-3 font-medium text-blue-600 border-b-2 border-blue-600 tab-button active">
              VacantesDesactivadas ({totalElements})
            </button>
          </nav>
        </div>
      </div>

      <div className={`tab-content transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Título</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Empresa</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ubicación</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tipo</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Motivo</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Acciones</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vacantes.map((vacantes) => (
                  <tr key={vacantes.nvacantes}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{vacantes.titulo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{vacantes.nameEmpresa}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{vacantes.ciudad}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          vacantes.tipo === 'Vacante'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {vacantes.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{vacantes.comentarioAdmin}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{/* Fecha Registro */}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                      <a
                        className="mr-3 text-blue-600 hover:text-blue-900"
                        href={`/empleos/${vacantes.nvacantes}`}
                        key={vacantes.nvacantes}
                      >
                        Ver
                      </a>
                      
                      <button
                        className="mr-3 text-red-600 hover:text-red-900"
                        onClick={() => ActivarVacante(vacantes.nvacante, 'Falso Positivo')}
                      >
                        Activar Vacante
                      </button>
                    </td>
                   
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="p-4">
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

export default VacantesDesactivadas;
