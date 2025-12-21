import { useEffect } from "react";
import Loading from "../components/Loading"

const ChatList = ({ onSelectChat, chats, loading, userRole }) => {

  useEffect(() => {
    console.log("modificado")
    console.log(chats)
    
  }, [chats])

  if (loading) return <Loading />;
  if (chats.length === 0)
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 text-gray-500">
        <h2 className="text-lg font-semibold text-gray-700">
          No hay chats disponibles
        </h2>
        <p className="text-sm text-gray-500">
          Cuando inicies una conversación, aparecerá aquí.
        </p>
      </div>
    );
  return (
    <div className=" h-full overflow-y-auto bg-white border border-blue-200 rounded-lg shadow-sm custom-scroll">
      <ul className="divide-y divide-blue-100">
        {chats.map((chat) => (
          <li key={chat.id}>
            <button
              onClick={() => onSelectChat(chat.id)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition duration-200 group"
            >
              <div className="flex justify-between items-center mb-1">
                {chat.tipoChat === 'Privado' ? (
                  <h3 className="font-semibold text-blue-800 text-sm group-hover:text-blue-900">
                    {userRole === 'EMPRESA'
                      ? `Candidato: ${chat.nombreCandidato}`
                      : `Empresa: ${chat.nombreEmpresa}`}
                  </h3>
                ) : (
                  <h3 className="font-semibold text-green-800 text-sm group-hover:text-green-900">
                    {chat.tituloVacante}
                  </h3>
                )}

                <span className="text-xs text-blue-400">
                  {new Date(chat.horaUltimoMensaje).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
              <p className="text-xs text-blue-600">
                <span className="font-medium">
                  {chat.tipoChat === 'Privado'
                    ? `Vacante: ${chat.tituloVacante}`
                    : 'Chat grupal'}
                </span>
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
