import { useContext, useEffect, useRef, useState } from "react";
import { useFetchV2, useSendFormV2 } from "../../hooks/useFetch";
import { RoleContext } from "../../services/RoleContext";
import { useNavigate } from "react-router-dom";
import exceptionControl from "../../services/exceptionControl";
import { connect, sendMessage, subscribe } from "../../services/Websocket";
import { ListSvg } from "../../components/icons"
import Loading from "../../components/Loading";

export default function ChatBot() {
    const navigate = useNavigate();
    const { userDataSession, rol } = useContext(RoleContext);
    const { data:chatBot } = useFetchV2(`/api/chatBot/info?usuarioId=${userDataSession.id}`, "GET");
    const [messages, setMessages] = useState([]);
    const [input, setInput ] = useState("");
    const { logout, send } = useSendFormV2();
    const messagesEndRef = useRef(null);
    const [loadingResponse, setLoadingResponse] = useState(false);

    const sendChatMessage = () => {
        if (!chatBot || !userDataSession) return

        const msg = {
            chatId: chatBot.id,
            senderId: userDataSession.id,
            senderRole: rol,
            content: input,
        };
        sendMessage("/app/chat/modelo/enviar/mensaje", msg);
        setInput("")
    }

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [messages]);

    useEffect(()=>{
        if(!chatBot) return
        const getMessage = async () => {
            try {
                const res = await send(`/api/chatBot/${chatBot?.id}/mensajes`, "GET");
                if (!res?.data) return
                setMessages(res.data);
            } catch (error) {
                exceptionControl(error, logout, navigate, "Error al obtener los mensajes del chat")
            }
        }

        getMessage()
    },[chatBot])

    useEffect(() => {
        connect()

        subscribe("/user/queue/chatBot/messages", (msg) => {
            const userMessage = JSON.parse(msg.body);
            setMessages((prev) => [...prev, userMessage]);
            setLoadingResponse(true)
        });

        subscribe("/user/queue/chatBot/response", (msg) => {
            const modeloResponse = JSON.parse(msg.body);
            setLoadingResponse(false);
            setMessages((prev) => [...prev, modeloResponse]);
        });

    }, [])
    

    // if (!chatBot) return (
    //     <div id="emptyChatState" className="empty-chat-state">
    //         <div className="empty-chat-content">
    //             <div className="empty-chat-icon">
    //                 <ListSvg name={"burbujaMensaje"} height={64} width={64} />
    //             </div>
    //             <h3>Tus mensajes</h3>
    //             <p>Selecciona una conversación para ver tus mensajes o inicia una nueva</p>
    //         </div>
    //     </div>
    // );

    return (
        <div className="flex flex-col w-full h-full border-l border-blue-200 bg-white">
            {/* Header del chat */}
            <div className="p-4 border-b bg-blue-50 shadow-sm flex justify-between items-center">
                <h2 className="text-xl font-semibold text-blue-800">
                    ChatBot
                </h2>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-blue-100 space-y-3">
                {messages.length === 0 && (
                    <p className="text-center text-blue-400 mt-10">No hay mensajes aún. ¡Comienza la conversación!</p>
                )}

                {messages.map((msg, idx) => {
                    const isOwn = msg.senderId == userDataSession.id;
                    return (
                        <div
                            key={idx}
                            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`min-w-[100px] max-w-sm px-5 py-3 rounded-xl shadow-md text-base relative break-words overflow-hidden ${isOwn
                                        ? "bg-blue-500 text-white rounded-br-none"
                                        : "bg-white text-blue-900 rounded-bl-none border border-blue-200"
                                    }`}
                            >
                                <p className="mb-4">{msg.content}</p>
                                <span className="absolute bottom-1 right-3 text-xs text-black-300">
                                    {new Date(msg.time).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </span>

                            </div>
                        </div>
                    );
                })}

                {loadingResponse ?
                    <div className="flex justify-start">
                        <div className="min-w-[100px] max-w-xs px-5 py-3 rounded-xl shadow-md text-base 
                        relative break-words overflow-hidden bg-white text-blue-900 rounded-bl-none 
                        border border-blue-200">
                            Generando mensaje...
                        </div>
                    </div>
                    : null
                }
                
                <div ref={messagesEndRef} />
            </div>

            
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
                        onClick={sendChatMessage}
                        className={`px-5 py-2 rounded-lg font-semibold ${input.trim()
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-blue-200 text-blue-400 cursor-not-allowed"
                            } transition-colors duration-200 shadow`}
                    >
                        Enviar
                    </button>
                </div>
            </div>

        </div>
    );

} 