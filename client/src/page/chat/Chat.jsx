import { useParams } from "react-router-dom";
import "../../style/invitado/chat.css";
import Header from "../../layouts/Header";
import ChatList from "../../components/ChatList";
import ChatBox from "../../components/ChatBox";
import { API_CLIENT_URL } from "../../services/Api";
import manejarRespuesta from "../../services/ManejarRespuesta";
import { useEffect, useState } from "react";
import { ListSvg } from "../../components/Icons";

export default function ChatPage() {
  const { id } = useParams(); // equivalente a Astro.params
  const [chatId, setChatId] = useState(id);
  const [searchText, setSearchText] = useState("");
  const [searchTextLocal, setSearchTextLocal] = useState("");
  const [Estado, setEstado] = useState(null); // Estado para filtro
  const [chats, setChats] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Obtener rol e id del usuario
  useEffect(() => {
    async function fetchUserRole() {
      try {
        const res = await fetch(`${API_CLIENT_URL}/api/usuarios/rol`, {
          credentials: "include",
        });
        const data = await manejarRespuesta(res);
        if (!data) { return }
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
        let url = `${API_CLIENT_URL}/api/chats/${tipoUsuario}/${userId}?${params.toString()}`;

        const res = await fetch(url, {
          method: 'PATCH',
          credentials: 'include'
        });

        const data = await manejarRespuesta(res);
        if (!data) { return }
        setChats(data.chats || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, [userRole, userId, searchText, Estado]);
  
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
              userRole={userRole}
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
