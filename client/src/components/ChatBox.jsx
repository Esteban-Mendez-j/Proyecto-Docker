import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';
import { API_CLIENT_URL, WS_CLIENT_URL } from '../services/Api';
import { manejarRespuesta } from '../services/ManejarRespuesta';

const ChatBox = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatInfo, setChatInfo] = useState(null);
  const [chatChange, setChatChange] = useState(null);
  const [ setUserRole] = useState(null);
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch(`${API_CLIENT_URL}/api/usuarios/rol`, {
          credentials: 'include',
        });
        const data = await manejarRespuesta(res);
        if (!data) return;
        setUserRole(data.rolPrincipal);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchChatInfo = async () => {
      if(chatId === "candidato" || chatId === "empresa"){return}
      const mensajeGuardado = localStorage.getItem(`chat-mensaje-${chatId}`);
      setChatChange(mensajeGuardado)
      try {
        const res = await fetch(`${API_CLIENT_URL}/api/chats/${chatId}/info`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener la información del chat");
        const data = await manejarRespuesta(res);
        if(!data){return}
        setChatInfo(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    const mensajeGuardado = localStorage.getItem(`chat-mensaje-${chatId}`);
    if (mensajeGuardado) {
      setChatChange(mensajeGuardado);
      console.log(mensajeGuardado)
    }
    fetchChatInfo();
  }, [chatId, chatChange ]);

  useEffect(() => {
    if (!chatInfo) return;

    const { tipoChat} = chatInfo;

    const client = new Client({
      brokerURL: `${WS_CLIENT_URL}/chats`,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("✅ Conectado a WebSocket");
        if (tipoChat === "Grupo") {
          // CHAT PÚBLICO
          // client.subscribe(`/topic/vacantes/${vacanteId}`, (msg) => {
          //   const message = JSON.parse(msg.body);
          //   setMessages((prev) => [...prev, message]);
          // });
        } else {
          // CHAT PRIVADO
          client.subscribe(`/user/queue/messages`, (msg) => {
            const message = JSON.parse(msg.body);
            setMessages((prev) => [...prev, message]);
          });
        }
        
        // Escuchar cierre de chat
        client.subscribe(`/user/queue/chat-change`, (msg) => {
          const contenido = msg.body;
          setChatChange(contenido);
          console.log(contenido)
          localStorage.setItem(`chat-mensaje-${chatId}`, contenido);
        });

        // Cargar historial al conectar
        fetch(`${API_CLIENT_URL}/api/chats/${chatId}/mensajes`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => setMessages(data))
          .catch((error) =>
            console.error("❌ Error al obtener los mensajes:", error)
          );
      },
      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame);
      },
    });

    stompClient.current = client;
    client.activate();

    return () => {
      if (client.active) client.deactivate();
    };
  }, [chatInfo, chatId]);

 useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);


  const sendMessage = () => {
    if (!chatInfo || input.trim() === "") return;

    const { userId, rolPrincipal: role, chatInfo: chatDetails } = chatInfo;
    const { empresaId, candidatoId } = chatDetails;

    const receptorId = role === "EMPRESA" ? candidatoId : empresaId;

    const msg = {
      chatId,
      senderId: userId,
      receiverId: receptorId,
      senderRole: role,
      content: input,
    };

    const client = stompClient.current;

    if (client && client.connected) {
      client.publish({
        destination: "/app/chats.sendMessage",
        body: JSON.stringify(msg),
      });
      setInput("");
    }
  };

  const cambiarEstadoChat = async (chatId, estado) => {
    let mensaje = estado? "Abrir":"Cerrar";
    try {
      const response = await fetch(`${API_CLIENT_URL}/api/chats/${chatId}/estado?isActive=${estado}`, {
        method: 'PATCH',
        credentials: 'include', 
      });

      if (response.ok) {
        await Swal.fire({ text: `Chat ${estado? "Abierto":"Cerrardo"} correctamente`, icon: 'info' });        
        setChatInfo(prev => ({
          ...prev,
          chatInfo: {
            ...prev.chatInfo,
            isActive: estado
          }
        }));
        
      } else if (response.status === 403) {
        await Swal.fire({ text: `No tienes permisos para ${mensaje} este chat`, icon: 'error' });      } else {
        await Swal.fire({ text: `Ocurrió un error al ${mensaje} el chat`, icon: 'error' });      }
    } catch (error) {
      console.error(`Error al ${mensaje} el chat:`, error);
      await Swal.fire({ text: `Error de red o servidor al ${mensaje} el chat`, icon: 'error' });    }
  };

  if (!chatInfo) return (
      <div id="emptyChatState" className="empty-chat-state">
        <div className="empty-chat-content">
          <div className="empty-chat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3>Tus mensajes</h3>
          <p>Selecciona una conversación para ver tus mensajes o inicia una nueva</p>
        </div>
      </div>
    );
    
  return (
    <div className="flex flex-col w-full h-full border-l border-blue-200 bg-white">
      {/* Header del chat */}
      <div className="p-4 border-b bg-blue-50 shadow-sm flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blue-800">
          Conversación con{" "}
          {chatInfo.rolPrincipal === "EMPRESA"
            ? chatInfo.chatInfo.nombreCandidato
            : chatInfo.chatInfo.nombreEmpresa || "Usuario"}
        </h2>

        {chatInfo.rolPrincipal === 'EMPRESA' && (
          <button
            onClick={() => cambiarEstadoChat(chatInfo.chatInfo.id, !chatInfo.chatInfo.isActive)} 
            className={`${
              chatInfo.chatInfo.isActive 
                ? "bg-red-100 text-red-600 hover:bg-red-200" 
                : "bg-green-100 text-green-600 hover:bg-green-200"
            } font-semibold px-4 py-2 rounded-lg transition duration-200 text-sm shadow-sm`}
          >
            {chatInfo.chatInfo.isActive ? "Cerrar Chat" : "Reabrir Chat"}
          </button>
        )}
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-blue-100 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-blue-400 mt-10">No hay mensajes aún. ¡Comienza la conversación!</p>
        )}

        {messages.map((msg, idx) => {
          const isOwn = msg.senderId === chatInfo.userId;
          return (
            <div
              key={idx}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`min-w-[100px] max-w-sm px-5 py-3 rounded-xl shadow-md text-base relative break-words overflow-hidden ${
                  isOwn
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-blue-900 rounded-bl-none border border-blue-200"
                }`}
              >
                <p className="mb-4">{msg.content}</p>
                <span className="absolute bottom-1 right-3 text-xs text-black-300">
                  {new Date(msg.time + 'Z').toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>

              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {!chatInfo.chatInfo.isActive && (
        <div className="p-4 border-t bg-white text-center text-red-600 font-semibold">
          {chatChange}
        </div>
      )}

      {chatInfo.chatInfo.isActive && (
        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-3">
            <input
              type="text"
              className="flex-1 resize-none border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
            />
            <button
              type="button"
              disabled={!input.trim()}
              onClick={() => sendMessage()}
              className={`px-5 py-2 rounded-lg font-semibold ${
                input.trim()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-200 text-blue-400 cursor-not-allowed"
              } transition-colors duration-200 shadow`}
            >
              Enviar
            </button>
          </div>
        </div>
      )}

    </div>
  );

};

export default ChatBox;
