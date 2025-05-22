import React, { useState } from "react";
import ChatList from "./ChatList.jsx";
import ChatBox from "./ChatBox.jsx";


export default function ChatApp({ chatId: initialChatId }) {
  const [chatId, setChatId] = useState(initialChatId);
  const [searchText, setSearchText] = useState("");
  const [searchTextLocal, setSearchTextLocal] = useState("");
  const [Estado, setEstado] = useState(null); // Estado para filtro

  return (
    <div className="h-screen flex">
      <aside className="w-1/4 flex flex-col border-r border-gray-200 bg-white">
        <header className="p-4 border-b">
          <h2 className="text-lg font-semibold text-blue-700">Mensajes</h2>
        </header>

        <div className="p-3">
           <div className="flex items-center gap-2 border border-blue-200 rounded-lg px-3 py-2 bg-blue-50 focus-within:ring-2 focus-within:ring-blue-300">
            <button onClick={() => setSearchText(searchTextLocal)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <input
              type="text"
              className="flex-1 bg-blue-50 text-blue-900 placeholder-blue-400 outline-none"
              placeholder="Buscar conversaciones..."
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

        <div className="flex-1 overflow-y-auto min-h-0 px-2 pb-4">
          {/* Pasamos searchText y Estado al componente que lista chats */}
          <ChatList
            searchText={searchText}
            Estado={Estado}
            onSelectChat={setChatId}
          />
        </div>
      </aside>

      <main className="flex flex-col flex-1">
        <ChatBox  chatId={chatId} />
      </main>
    </div>
  );
}
