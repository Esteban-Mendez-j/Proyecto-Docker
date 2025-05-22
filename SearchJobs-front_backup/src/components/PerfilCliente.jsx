import { useEffect, useState } from 'react';
import '../styles/pages/candidato.css';
import { API_CLIENT_URL } from '../javascripts/Api';

function PerfilCliente() {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${API_CLIENT_URL}/api/candidatos/perfil`, {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Error al obtener el perfil');
        }

        const data = await res.json();
        setPerfil(data);
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
      }
    };

    fetchPerfil();
  }, []);

  if (!perfil) return <div>Cargando perfil...</div>;

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Columna Izquierda */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="p-6 mb-6 text-center bg-white border border-gray-100 rounded-lg shadow-sm">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img
                src={perfil?.candidato?.imagen || 'https://via.placeholder.com/150'}
                alt={`${perfil?.candidato?.nombre || 'Nombre'} ${perfil?.candidato?.apellido || 'Apellido'}`}
                className="object-cover w-full h-full border-4 border-white rounded-full shadow-sm"
              />
              <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full bottom-1 right-1"></div>
            </div>
            <h1 className="mb-1 text-xl font-bold">
              {perfil?.candidato?.nombre || 'Nombre'} {perfil?.candidato?.apellido || 'Apellido'}
            </h1>
            <p className="mb-2 font-medium text-blue-600">{perfil?.candidato?.estudio || 'Estudio no disponible'}</p>
            <div className="flex items-center justify-center mb-3 text-sm text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {perfil?.candidato?.ubicacion || 'Ubicación no disponible'}
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Aquí puedes agregar contenido adicional */}
        </div>
      </div>
    </div>
  );
}

export default PerfilCliente;

