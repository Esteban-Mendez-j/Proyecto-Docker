import { useNavigate, useParams } from "react-router-dom";
import "../../style/invitado/chat.css";
import Header from "../../layouts/Header";
import ChatList from "../../components/ChatList";
import ChatBox from "../../components/ChatBox";
import { API_CLIENT_URL } from "../../services/Api";
import manejarRespuesta from "../../services/ManejarRespuesta";
import { useContext, useEffect, useState } from "react";
import { ListSvg } from "../../components/Icons";
import { RoleContext } from "../../services/RoleContext";
import { useSendFormV2 } from "../../hooks/useFetch";
import exceptionControl from "../../services/exceptionControl";

export default function ChatPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { logout, rol, userDataSession } = useContext(RoleContext);
  const { loading, send } = useSendFormV2();
  const [chatId, setChatId] = useState(id);
  const [searchText, setSearchText] = useState("");
  const [searchTextLocal, setSearchTextLocal] = useState("");
  const [Estado, setEstado] = useState(null); // Estado para filtro
  const [chats, setChats] = useState([]);

  // Traer chats desde backend con filtros
  useEffect(() => {
    async function fetchChats() {
      if (!rol || !userDataSession.id) return;

      try {
        const tipoUsuario = rol.toLowerCase(); // empresa o candidato
        const params = new URLSearchParams({
          estado: Estado, // "todos", "activos", "inactivos"
          search: searchText || "",
          page: 0,
          size: 10,
        });
        let url = `/api/chats/${tipoUsuario}/${userDataSession.id}?${params.toString()}`;
        const res = await send(url, "PATCH");
        
        if (!res?.data) return 
        setChats(res.data);
      } catch (error) {
        exceptionControl(error, logout, navigate, "Error al cargar los chats");
      }
    }
    fetchChats();
  }, [rol, userDataSession.id, searchText, Estado]);
  
  return (

    <div className="chat-layout">
      <Header />
      <div className="h-screen flex">
        <aside className="w-1/4 flex flex-col border-r border-gray-200 bg-white pt-20">
          <header className="p-4 border-b">
            <h2 className="text-lg font-semibold text-blue-700">Mensajes</h2>
          </header>

          <div className="p-3">
            <div className="flex items-center gap-2 border border-blue-200 rounded-lg px-3 py-2 bg-blue-50 focus-within:ring-2 focus-within:ring-blue-300">
              <button onClick={() => setSearchText(searchTextLocal)}>
                <ListSvg name={"lupa"} width={18} height={18} />
              </button>

              <input
                type="text"
                className="flex-1 bg-blue-50 text-blue-900 placeholder-blue-400 outline-none"
                placeholder="Buscar por vacante..."
                value={searchTextLocal}
                onChange={(e) => setSearchTextLocal(e.target.value)}
              />
            </div>
          </div>

          <nav className="flex justify-between px-4 py-2 text-sm">
            <div className="flex gap-4">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="estado"
                  checked={Estado === null}
                  onChange={() => setEstado(null)}
                  className="accent-blue-600"
                />
                <span className={`font-semibold hover:underline ${Estado === null ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
                  Todos
                </span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="estado"
                  checked={Estado === "activos"}
                  onChange={() => setEstado("activos")}
                  className="accent-blue-600"
                />
                <span className={`font-semibold hover:underline ${Estado === "activos" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
                  Activos
                </span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="estado"
                  checked={Estado === "inactivos"}
                  onChange={() => setEstado("inactivos")}
                  className="accent-blue-600"
                />
                <span className={`font-semibold hover:underline ${Estado === "inactivos" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
                  Inactivos
                </span>
              </label>
            </div>

          </nav>

          <div className="flex-1 overflow-y-auto min-h-0 px-2 pb-4 ">
            {/* Pasamos searchText y Estado al componente que lista chats */}
            <ChatList
              onSelectChat={setChatId}
              chats={chats}
              loading={loading}
              userRole={rol}
            />
          </div>
        </aside>

        <main className="flex flex-col flex-1">
          <ChatBox chatId={chatId} setChats={setChats} />
        </main>
      </div>
    </div>
  );
}
