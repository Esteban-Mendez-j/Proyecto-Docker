import { useContext, useEffect, useRef, useState } from "react";
import { useFetchV2, useSendFormV2 } from "../../hooks/useFetch";
import { RoleContext } from "../../services/RoleContext";
import { useNavigate } from "react-router-dom";
import exceptionControl from "../../services/exceptionControl";
import { connect, sendMessage, subscribe } from "../../services/Websocket";
import { ListSvg } from "../../components/icons"
import Loading from "../../components/Loading";
import { modal, modalTime } from "../../services/Modal";
import { API_CLIENT_URL, URL_FILE } from "../../services/Api";

export default function ChatBot() {
    const navigate = useNavigate();
    const [viewFileWindow, setViewFileWindow] = useState(false);
    const [nameFiles, setNameFiles] = useState([]);
    const { userDataSession, rol } = useContext(RoleContext);
    const { data:chatBot, error } = useFetchV2(`/api/chatBot/info?usuarioId=${userDataSession.id}`, "GET");
    const [messages, setMessages] = useState([]);
    const [input, setInput ] = useState("");
    const { logout, send, error:errorSend } = useSendFormV2();
    const messagesEndRef = useRef(null);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const fileRef = useRef(null)
    const maxFileSize = 1;

    // crea un chatBot en MongoDB cuando la consulta a la informacion da 404
    useEffect(()=>{

        if( error?.code !== "NOT_FOUND") return

        const dataChat = {
            usuarioId: userDataSession.id,
            usuarioRol: rol
        }

        try {
            send("/api/chatBot/add", "POST", JSON.stringify(dataChat))
        } catch (error) {
            exceptionControl(error, logout, navigate, "Error en la creacion del chatBot")
        }
    },[ error ])

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
    }, [messages, viewFileWindow]);

    const getNameFiles = async () => {
        try {
            const res = await send(`/api/chatBot/files?chatId=${chatBot?.id}`, "GET");
            setNameFiles(res.data);
        } catch (error) {
            exceptionControl(error, logout, navigate, "Error al obtener los mensajes del chat")
        }
    }

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
        
        getNameFiles()
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
        
        subscribe("/user/queue/errors", (msg) => {
            const errorMessage = msg.body;
            setLoadingResponse(false)
            modal(errorMessage, "error")
        });

    }, [])

    /* Manejar cambio de file para validar su peso */
    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (!file) {return;}

        if (file.size > (maxFileSize * 1024 * 1024)) {
            modal(`El archivo es demasiado pesado. Debe ser menor a ${maxFileSize}MB`, "warning")
            e.target.value = "";
            return;
        }
        
        const formData = new FormData();
        if(chatBot?.id){
            formData.append("chatId", chatBot.id)
        }

        if (fileRef.current?.files[0]) {
            formData.append("file", fileRef.current.files[0]);
        }

        try {
            const {data} = await send("/api/chatBot/file", "PUT", formData, null )
            setNameFiles((prev) => [...prev, data]);
            fileRef.current.value = "";
            await modalTime("Archivo guardado")
        } catch (error) {
            exceptionControl(error, logout, navigate, "Error al guardar el archivo")
            await modalTime("Error al guardar el archivo", "error")
        }
    };

    const deleteFile = async (name) => {
        if (!name || !chatBot?.id ) return; 

        try {
            await send(`/api/chatBot/file?nameFile=${name}&chatId=${chatBot?.id}`, "DELETE")
            setNameFiles((prev) =>
                prev.filter((file) => file !== name)
            );
            await modalTime("Archivo Eliminado")
        } catch (error) {
            exceptionControl(error, logout, navigate, "Error al eliminar el archivo")
            await modalTime("Error al eliminar el archivo", "error")
        }
    }

    const downloadFile = async (name) => {
        try {

            const response = await fetch(
                `${API_CLIENT_URL}/api/chatBot/file?nameFile=${name}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Error al descargar archivo");
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = name;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col w-full h-full border-l border-blue-200 bg-white">
            {/* Header del chat */}
            <div className="p-4 border-b bg-blue-50 shadow-sm flex justify-between items-center">
                <h2 className="text-xl font-semibold text-blue-800">
                    ChatBot
                </h2>
                {viewFileWindow &&
                    <button className="text-blue-800 flex flex-row items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-200 transition-colors"
                        onClick={() => { setViewFileWindow(false) }}>
                        <ListSvg name={"burbujaMensaje"} width={20} height={20} /> Chat
                    </button>
                }
                {!viewFileWindow &&
                    <button className="text-blue-800 flex flex-row items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-200 transition-colors"
                        onClick={() => { setViewFileWindow(true) }}>
                        <ListSvg name={"carpeta"} width={20} height={20} nameClass="fill-blue-500" /> Archivos guardados
                    </button>
                }
                
            </div>

       
            {/* Area de archivos */}
            {(viewFileWindow && nameFiles) && (
                <>
                    <div className="flex-1 min-h-0 flex flex-col bg-blue-100 p-5">

                        {/* Header fijo */}
                        <div className="flex items-center justify-between mb-5 flex-shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold text-blue-900">
                                    Archivos guardados
                                </h2>
                                <p className="text-sm text-blue-500">
                                    Administra los archivos del chat
                                </p>
                            </div>

                            <div className="inline-flex  items-center gap-2 ">
                                <button className="text-blue-800 flex flex-row items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-200 transition-colors"
                                    onClick={getNameFiles}>
                                    <ListSvg name={"recargar"} width={20} height={20} nameClass="fill-blue-500" /> Recargar
                                </button>

                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-md hover:bg-blue-700 transition-colors">
                                    <ListSvg
                                        name={"subir_archivo"}
                                        width={18}
                                        height={18}
                                    />

                                    <span className="font-medium">
                                        Subir archivo
                                    </span>

                                    <input
                                        type="file"
                                        name="file"
                                        accept=".txt,.csv"
                                        ref={fileRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            
                        </div>

                        {/* Lista scrolleable */}
                        <div className="flex-1 overflow-y-auto pr-2 bg-white/70 backdrop-blur-sm border border-blue-200 shadow-inner p-5">

                                <div className="space-y-4">

                                    {nameFiles.length === 0 && (
                                        <div className="bg-white rounded-2xl shadow-sm border border-dashed border-blue-300 p-10 text-center">
                                            <p className="text-blue-400 text-lg">
                                                No hay archivos subidos aún
                                            </p>
                                        </div>
                                    )}

                                    {nameFiles.map((name, index) => (
                                        <div
                                            key={index}
                                            className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200"
                                        >
                                            <div className="flex items-center justify-between gap-4">

                                                {/* Info archivo */}
                                                <div className="flex items-center gap-3 overflow-hidden">

                                                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-2xl shadow-sm">
                                                        <ListSvg
                                                            name={"archivo"}
                                                            width={22}
                                                            height={22}
                                                            nameClass="fill-blue-600"
                                                        />
                                                    </div>

                                                    <div className="overflow-hidden">
                                                        <p className="font-semibold text-blue-900 truncate text-[15px]">
                                                            {name}
                                                        </p>

                                                        <p className="text-xs text-blue-400 mt-1">
                                                            Archivo almacenado
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Acciones */}
                                                <div className="flex items-center gap-2 flex-shrink-0">

                                                    {/* Descargar */}
                                                    <button
                                                        onClick={() => downloadFile(name)}
                                                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        <ListSvg
                                                            name={"descargar"}
                                                            width={18}
                                                            height={18}
                                                        />
                                                        Descargar
                                                    </button>

                                                    {/* Eliminar */}
                                                    <button
                                                        onClick={() => deleteFile(name)}
                                                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        <ListSvg
                                                            name={"eliminar"}
                                                            width={18}
                                                            height={18}
                                                        />
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                        </div>
                    </div>
                </>
            )}

            {/* Área de mensajes */}
            {!viewFileWindow && <>
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
                        <label className="inline-flex w-max cursor-pointer items-center gap-2 rounded-full bg-blue-500 px-4 py-2 font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
                            <ListSvg name={"subir_archivo"} width={20} height={20} />
                            <input
                                type="file"
                                name="file"
                                accept=".txt,.csv"
                                ref={fileRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
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
            </>
            }

        </div>
    );

} 