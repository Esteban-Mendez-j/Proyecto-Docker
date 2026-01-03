import { useContext, useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import "../../style/invitado/empleos.css";
import { manejarRespuesta } from "../../services/ManejarRespuesta";
import { API_CLIENT_URL } from "../../services/Api";
import Pagination from "../../components/Paginacion";
import { RoleContext } from "../../services/RoleContext";
import useFiltro from "../../hooks/useFiltro";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { inputModal, QuestionModal } from "../../services/Modal";
import SinResultados from "../../components/SinResultados"

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
      setTotalElements(data.totalElements);
      setUsuarios(data.usuarios || []);
      setTotalPages(data.totalPage);
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
      `${API_CLIENT_URL}/api/admin/agregarRol?idUsuario=${idUsuario}&estado=${estado}`,
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
        fetchUsuarios(); // recargar la lista
      })
      .catch((err) =>
        console.error("Error al modificar el rol del admin:", err)
      );
  };

  const cambiarEstado = async (idUsuario, isActive) => {
    
    const {isConfirmed, value: motivo} = await inputModal(`Escribe el motivo ${isActive ? "de la activación" : "del baneo"}`, "text", "Comentario",  "Escribe aquí..."  )

    if (!isConfirmed) return; // si el usuario cancela, no continúa

    fetch(
      `${API_CLIENT_URL}/api/admin/cambiar-estado/usuario?idUsuario=${idUsuario}&estado=${isActive}&comentario=${encodeURIComponent(
        motivo
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error al cambiar el estado del usuario");
        return res.json();
      })
      .then(() => {
        fetchUsuarios(); // recargar la lista
      })
      .catch((err) =>
        console.error("Error al cambiar el estado del usuario:", err)
      );
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
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <div className="flex flex-col">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      placeholder="Buscar por Nombre ..."
                      name="nombre"
                      value={filtrosLocal.nombre}
                      onChange={handleOnFilters}
                      className="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="correo">Correo electronico</label>
                    <input
                      type="text"
                      placeholder="Buscar por correo ..."
                      name="correo"
                      value={filtrosLocal.correo}
                      onChange={handleOnFilters}
                      className="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="rol">Rol</label>
                    <select
                      name="rol"
                      value={filtrosLocal.rol}
                      onChange={handleOnFilters}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todos los tipos</option>

                      {userRol !== "ADMIN" && (
                        <option value="ADMIN">Administradores</option>
                      )}

                      <option value="CANDIDATO">Candidatos</option>
                      <option value="EMPRESA">Empresas</option>
                    </select>
                  </div>

                  <div className="flex gap-3 items-center">
                    <button
                      onClick={searchFilters}
                      className="px-4 py-2 h-10 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Buscar
                    </button>
                    <button
                      onClick={handleOnEstado}
                      className="px-4 py-2 h-10 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      {!filtrosAplicados.estado ? "Ver Activos" : "Ver Baneados"}
                    </button>
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 h-10 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Eliminar Filtros
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
    </Layout>
  );
}
