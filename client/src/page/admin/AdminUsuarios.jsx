import { useState } from "react";
import UsuariosActivos from "../../components/UsuariosActivos";
import Layout from "../../layouts/Layout";

export default function AdminUsuarios() {
  const [activeTab, setActiveTab] = useState("activos");
  const [modalBanear, setModalBanear] = useState(false);
  const [modalDesbanear, setModalDesbanear] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");

  const handleBanear = (nombre) => {
    setUsuarioSeleccionado(nombre);
    setModalBanear(true);
  };

  const handleConfirmarBanear = () => {
    Swal.fire({ text: "Usuario baneado correctamente", icon: "success" });
    setModalBanear(false);
  };

  const handleDesbanear = (nombre) => {
    setUsuarioSeleccionado(nombre);
    setModalDesbanear(true);
  };

  const handleConfirmarDesbanear = () => {
    Swal.fire({ text: "Usuario desbaneado correctamente", icon: "success" });
    setModalDesbanear(false);
  };

  return (
    <Layout >
      
      <br />

      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row">

          <div className="flex-1">
            {/* Tabs
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("activos")}
                className={`tab-button px-4 py-2 ${
                  activeTab === "activos"
                    ? "active border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => setActiveTab("baneados")}
                className={`tab-button px-4 py-2 ${
                  activeTab === "baneados"
                    ? "active border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Baneados
              </button>
            </div> */}

            {/* Contenido */}
            <UsuariosActivos onBanear={handleBanear} />
            
          </div>
        </div>
      </div>

      {/* Modal Banear */}
      {modalBanear && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              Banear a {usuarioSeleccionado}?
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => setModalBanear(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarBanear}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Desbanear */}
      {modalDesbanear && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              Desbanear a {usuarioSeleccionado}?
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => setModalDesbanear(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarDesbanear}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
