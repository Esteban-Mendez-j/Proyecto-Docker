import { useContext, useEffect, useState } from "react";
import Layout from "../../layouts/layout.jsx";
import "../../style/invitado/empleos.css";
import { manejarRespuesta } from "../../services/ManejarRespuesta.js";
import { API_CLIENT_URL } from "../../services/Api.js";
import Pagination from "../../components/Paginacion.jsx";
import { RoleContext } from "../../services/RoleContext.jsx";
import useFiltro from "../../hooks/useFiltro.jsx";
import Table from "../../components/Table.jsx";
import { useNavigate } from "react-router-dom";
import { inputModal, modal, modalTime, QuestionModal } from "../../services/Modal.js";
import SinResultados from "../../components/SinResultados.jsx"
import "../../style/usuarios/filtros.css"

export default function AdminUsuarios() {
  const listHeaders = {
    Nombre: {
      nameAtributo: "nombre",
      clase: "whitespace-nowrap text-sm text-gray-900",
    },
    Email: {
      nameAtributo: "correo",
      clase: "whitespace-nowrap text-sm text-gray-900",
    },
    Tipo: {
      nameAtributo: "rolPrinciapl",
      clase: "whitespace-nowrap",
      modificacion: (user) => {
        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              user.rolPrinciapl === "CANDIDATO"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {user.rolPrinciapl}
          </span>
        );
      },
    },
    Comentario_Admin: {
      nameAtributo: "comentarioAdmin",
      clase: "whitespace-nowrap text-sm text-gray-900",
    },
    Fecha_Registro: {
      nameAtributo: "fechaRegistro",
      clase: "whitespace-nowrap text-sm text-gray-900",
      modificacion: (user) => {
        return new Date(user.fechaRegistro).toLocaleDateString("es-CO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    Último_Acceso: {
      nameAtributo: "fechaInicioSesion",
      clase: "whitespace-nowrap text-sm text-gray-900",
      modificacion: (user) => {
        return new Date(user.fechaInicioSesion).toLocaleDateString("es-CO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
  };

  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [AdminId, setAdminId] = useState("");
  const { rol: userRol } = useContext(RoleContext);

  const initialFiltros = {
    nombre: "",
    correo: "",
    rol: "",
    estado: true, // true:activos; false:baneados
  };

  const [
    filtrosLocal,
    filtrosAplicados,
    handleOnFilters,
    clearFilters,
    searchFilters,
    handleOnFilterAplicados,
  ] = useFiltro(initialFiltros, setCurrentPage, "FiltrosAdminUsuarios");

  const fetchUsuarios = async () => {
    try {
      const url = `${API_CLIENT_URL}/api/admin/listar/filtrados?page=${
        currentPage - 1
      }&size=${pageSize}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(filtrosAplicados),
      });
      const data = await manejarRespuesta(res);
      if (!data) {
        return;
      }
      setTotalElements(data.meta.pagination.totalElements);
      setUsuarios(data.data || []);
      setTotalPages(data.meta.pagination.totalPage);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [currentPage, pageSize, AdminId, filtrosAplicados]);

  const crearAdmin = async (idUsuario, estado) => {
    const accion = estado ? "crear este admin" : "revocar este administrador";

    const confirmacion = await QuestionModal(`¿Estás seguro de ${accion}?`, "warning" )

    if (!confirmacion) return;

    fetch(
      `${API_CLIENT_URL}/api/admin/nuevo/rol?idUsuario=${idUsuario}&estado=${estado}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error al modificar el rol del admin");
        return res.json();
      })
      .then((data) => {
        setAdminId(data.idUsuario);
        modalTime(`${estado? "Admin creado" : "Permisos removidos"} correctamente`)
        fetchUsuarios(); // recargar la lista
      })
      .catch((err) =>
        console.error("Error al modificar el rol del admin:", err)
      );
  };

  const cambiarEstado = async (idUsuario, isActive) => {
    
    const {isConfirmed, value: motivo} = await inputModal(`Escribe el motivo ${isActive ? "de la activación" : "del baneo"}`, "text", "Comentario",  "Escribe aquí..."  )

    if (!isConfirmed) return; // si el usuario cancela, no continúa
    try {
      const res = await fetch(
        `${API_CLIENT_URL}/api/admin/estado/cuenta/usuario?idUsuario=${idUsuario}&estado=${isActive}&comentario=${encodeURIComponent(
          motivo
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          credentials: "include",
        }
      )
      const json = await res.json();
      if (!res.ok) throw new Error(json.error.message);

      modalTime("Cambio Realizado Correctamente")
      fetchUsuarios();
    } catch (error) {
      console.error("Error al cambiar el estado del usuario:", error);
      modal(error || "Error al cambiar el estado del usuario", "error");
    }
  };

  const handleOnEstado = (e) => {
    e.target = { name: "estado", value: !filtrosAplicados.estado };
    handleOnFilterAplicados(e);
  };

  return (
    <Layout>
      <br />
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
            <div className="flex-1">
              {/* Filtros de usuarios */}
              <div className="admin-filtros">
                <h2 className="admin-filtros-titulo">
                  Filtrar usuarios
                </h2>

                <div className="admin-filtros-grid">

                  {/* Filtro por nombre */}
                  <div className="admin-filtro-campo">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      id="nombre"
                      type="text"
                      placeholder="Buscar por nombre..."
                      name="nombre"
                      value={filtrosLocal.nombre}
                      onChange={handleOnFilters}
                      className="admin-filtro-control"
                    />
                  </div>

                  {/* Filtro por correo */}
                  <div className="admin-filtro-campo">
                    <label htmlFor="correo">Correo electrónico</label>
                    <input
                      id="correo"
                      type="text"
                      placeholder="Buscar por correo..."
                      name="correo"
                      value={filtrosLocal.correo}
                      onChange={handleOnFilters}
                      className="admin-filtro-control"
                    />
                  </div>

                  {/* Filtro por rol */}
                  <div className="admin-filtro-campo">
                    <label htmlFor="rol">Rol</label>
                    <select
                      id="rol"
                      name="rol"
                      value={filtrosLocal.rol}
                      onChange={handleOnFilters}
                      className="admin-filtro-control"
                    >
                      <option value="">Todos los tipos</option>

                      {userRol !== "ADMIN" && (
                        <option value="ADMIN">Administradores</option>
                      )}

                      <option value="CANDIDATO">Candidatos</option>
                      <option value="EMPRESA">Empresas</option>
                    </select>
                  </div>

                  {/* Botones */}
                  <div className="admin-filtros-botones">
                    <button
                      type="button"
                      onClick={searchFilters}
                      className="admin-btn-buscar"
                    >
                      Buscar
                    </button>

                    <button
                      type="button"
                      onClick={handleOnEstado}
                      className="admin-btn-estado"
                    >
                      {!filtrosAplicados.estado
                        ? "Activos"
                        : "Baneados"}
                    </button>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="admin-btn-limpiar"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
              </div>
              <p className="px-4 py-3 font-medium text-blue-600 ">
                {totalElements} Usuarios{" "}
                {!filtrosAplicados.estado ? "Baneados" : "Activos"}
              </p>
              <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm">
                {usuarios.length === 0 ? 
                  (<SinResultados titulo={"No se encontraron resultados"}
                    subTitulo={"Revisa los Filtros o espera a que se registre un usuario"} />
                  )
                  : 
                  (
                    <Table
                      listObjetos={usuarios}
                      listEncabezados={listHeaders}
                      mobileCards={true}
                      action={[
                        (userRol !== "ADMIN" && filtrosAplicados.estado) && {
                          text: "+Admin",
                          funcion: (user) => crearAdmin(user.idUsuario, true),
                          ocultar: (user) => !user.roles.includes("ADMIN"),
                          clase:
                            "hover:underline font-semibold text-purple-600 hover:text-purple-800 mr-3",
                        },
                        userRol !== "ADMIN" && {
                          text: "-Admin",
                          funcion: (user) => crearAdmin(user.idUsuario, false),
                          ocultar: (user) => user.roles.includes("ADMIN"),
                          clase:
                            "hover:underline font-semibold text-purple-600 hover:text-purple-800 mr-3",
                        },
                        {
                          text: "Ver Perfil",
                          funcion: (user) =>
                            navigate(`/perfil/${user.rolPrinciapl.toLowerCase()}/${user.idUsuario}`),
                          ocultar: (user) => user.rolPrinciapl !== "ADMIN",
                          clase: "mr-3 text-blue-600 hover:text-blue-900",
                        },
                          !filtrosAplicados.estado
                          ? {
                            text: "Reactivar",
                            funcion: (user) => cambiarEstado(user.idUsuario, true),
                            ocultar: (user) => userRol == "SUPER_ADMIN" || (userRol == "ADMIN" && !["ADMIN", "SUPER_ADMIN"].includes(user.rolPrinciapl)),
                            clase: "text-green-600 hover:text-green-800",
                          }
                          : {
                            text: "Banear",
                            funcion: (user) => cambiarEstado(user.idUsuario, false),
                            ocultar: (user) => userRol == "SUPER_ADMIN" || (userRol == "ADMIN" && !["ADMIN", "SUPER_ADMIN"].includes(user.rolPrinciapl)),
                            clase: "text-red-600 hover:text-red-800",
                          },
                      ]}
                    />)
                }
              </div>

              <div className="p-4">
                { usuarios && usuarios.length > 0 && <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
    </Layout>
  );
}
