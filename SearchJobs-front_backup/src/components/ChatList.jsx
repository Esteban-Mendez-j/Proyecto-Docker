import { useEffect, useState } from "react";
import manejarRespuesta from "../javascripts/ManejarRespuesta";
import { API_CLIENT_URL } from '../javascripts/Api';

const ChatList = ({ searchText, Estado , onSelectChat }) => {
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener rol e id del usuario
  useEffect(() => {
    async function fetchUserRole() {
      try {
        const res = await fetch(`${API_CLIENT_URL}/api/usuarios/rol`, {
          credentials: "include",
        });
        const  data = await manejarRespuesta(res);
        if(!data){return}
        setUserId(data.id);
        setUserRole(data.rolPrincipal);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    }
    fetchUserRole();
  }, []);

  // Traer chats desde backend con filtros
  useEffect(() => {
    async function fetchChats() {
      if (!userRole || !userId) return;

      setLoading(true);
      try {
        const tipoUsuario = userRole.toLowerCase(); // empresa o candidato
        const params = new URLSearchParams({
          estado: Estado, // "todos", "activos", "inactivos"
          search: searchText || "",
          page: 0,
          size: 10,
        });  
        let url =`${API_CLIENT_URL}/api/chats/${tipoUsuario}/${userId}?${params.toString()}`;

        const res = await fetch(url, {
          method: 'PATCH',
          credentials: 'include'
        });

        const  data = await manejarRespuesta(res);
        if(!data){return}
        setChats(data.chats || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, [userRole, userId, searchText, Estado]);

  if (loading) return <div>Cargando chats...</div>;
  if (chats.length === 0) return <div>No hay chats para mostrar.</div>;
  return (
    <div className="h-full overflow-y-auto bg-white border border-blue-200 rounded-lg shadow-sm custom-scroll">
      <ul className="divide-y divide-blue-100">
        {chats.map((chat) => (
          <li key={chat.id}>
            <button
              onClick={() => onSelectChat(chat.id)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition duration-200 group"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-blue-800 text-sm group-hover:text-blue-900">
                  {userRole === 'EMPRESA'
                    ? `Candidato: ${chat.nombreCandidato}`
                    : `Empresa: ${chat.nombreEmpresa}`}
                </h3>
                <span className="text-xs text-blue-400">
                  {new Date(chat.horaUltimoMensaje).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-xs text-blue-600">
                Vacante: <span className="font-medium">{chat.tituloVacante}</span>
              </p>
              <p className="text-sm text-blue-700 truncate">
                {chat.contentUltimoMensaje || (
                  <span className="italic text-blue-300">Sin mensajes</span>
                )}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
