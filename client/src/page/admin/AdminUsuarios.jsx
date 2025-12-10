import { useContext, useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import '../../style/invitado/empleos.css';
import { manejarRespuesta } from '../../services/ManejarRespuesta';
import { API_CLIENT_URL } from "../../services/Api";
import Pagination from '../../components/Paginacion';
import { RoleContext } from "../../services/RoleContext";
import useFiltro from "../../hooks/useFiltro"

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [AdminId, setAdminId] = useState('');
  const { rol:userRol } = useContext(RoleContext)
  
  const initialFiltros = {
    nombre: "",
    correo: "",
    rol: "",
    estado: true // true:activos; false:baneados
  }
  
  const [filtrosLocal, filtrosAplicados, handleOnFilters, clearFilters, searchFilters, handleOnFilterAplicados] = useFiltro(initialFiltros, setCurrentPage, "FiltrosAdminUsuarios");

  const fetchUsuarios = async () => {
    try {
      const url = `${API_CLIENT_URL}/api/admin/listar/filtrados?page=${currentPage - 1}&size=${pageSize}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(filtrosAplicados),
      });
      const data = await manejarRespuesta(res);
      if (!data) { return }
      setTotalElements(data.totalElements);
      setUsuarios(data.usuarios || []);
      setTotalPages(data.totalPage);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [currentPage, pageSize, AdminId, filtrosAplicados]);


  const crearAdmin = async (idUsuario, estado) => {
    const accion = estado ? 'crear este admin' : 'revocar este administrador';

    const confirmacion = await Swal.fire({
      title: `¿Estás seguro de ${accion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirmacion.isConfirmed) return;

    fetch(`${API_CLIENT_URL}/api/admin/agregarRol?idUsuario=${idUsuario}&estado=${estado}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al modificar el rol del admin');
        return res.json();
      })
      .then((data) => {
        setAdminId(data.idUsuario);
        fetchUsuarios(); // recargar la lista
      })
      .catch((err) => console.error('Error al modificar el rol del admin:', err));
  };

  const cambiarEstado = async (idUsuario, isActive) => {
    const { isConfirmed, value: motivo } = await Swal.fire({
      title: `Escribe el motivo ${isActive ? 'de la activación' : 'del baneo'}`,
      input: 'text',
      inputLabel: 'Comentario',
      inputPlaceholder: 'Escribe aquí...',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      inputValidator: (value) => {
        if (!value) return 'El comentario es obligatorio';
      }
    });

    if (!isConfirmed) return; // si el usuario cancela, no continúa

    fetch(`${API_CLIENT_URL}/api/admin/cambiar-estado/usuario?idUsuario=${idUsuario}&estado=${isActive}&comentario=${encodeURIComponent(motivo)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al cambiar el estado del usuario');
        return res.json();
      })
      .then(() => {
        fetchUsuarios(); // recargar la lista
      })
      .catch((err) => console.error('Error al cambiar el estado del usuario:', err));
  };

  const handleOnEstado = (e) => {
    e.target = { name: "estado", value: !filtrosAplicados.estado }
    handleOnFilterAplicados(e)
  }

  return (
    <Layout >

      <br />
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row">

          <div className="flex-1">

            <div className="flex-1">
              <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Buscar por Nombre ..."
                    name="nombre"
                    value={filtrosLocal.nombre}
                    onChange={handleOnFilters}
                    className="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Buscar por correo ..."
                    name="correo"
                    value={filtrosLocal.correo}
                    onChange={handleOnFilters}
                    className="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

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

                  <button onClick={searchFilters} className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Buscar
                  </button>
                  <button onClick={handleOnEstado} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                    {!filtrosAplicados.estado ? 'Ver Activos' : 'Ver Baneados'}
                  </button>
                  <button onClick={clearFilters} className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Eliminar Filtros
                  </button>
                </div>
              </div>
              <p className="px-4 py-3 font-medium text-blue-600 ">
                {totalElements} Usuarios {!filtrosAplicados.estado ? 'Baneados' : 'Activos'}
              </p>
              <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className={`px-6 py-3 text-xs font-medium text-left uppercase ${!filtrosAplicados.estado ? 'text-red-800' : 'text-blue-500'}`}>Nombre</th>
                      <th className={`px-6 py-3 text-xs font-medium text-left uppercase ${!filtrosAplicados.estado ? 'text-red-800' : 'text-blue-500'}`}>Email</th>
                      <th className={`px-6 py-3 text-xs font-medium text-left uppercase ${!filtrosAplicados.estado ? 'text-red-800' : 'text-blue-500'}`}>Tipo</th>
                      {!filtrosAplicados.estado ? (
                        <th className="px-6 py-3 text-xs font-medium text-left uppercase text-red-800">Comentario Admin</th>
                      ) : (
                        <th className="px-6 py-3 text-xs font-medium text-left uppercase text-blue-500">Fecha Registro</th>
                      )}
                      <th className={`px-6 py-3 text-xs font-medium text-left uppercase ${!filtrosAplicados.estado ? 'text-red-800' : 'text-blue-500'}`}>Último Acceso</th>
                      <th className={`px-6 py-3 text-xs font-medium text-right uppercase ${!filtrosAplicados.estado ? 'text-red-800' : 'text-blue-500'}`}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usuarios.map((user) => (
                      <tr key={user.idUsuario}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.correo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.rolPrinciapl === 'CANDIDATO' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {user.rolPrinciapl}
                          </span>
                        </td>
                        {!filtrosAplicados.estado ? (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.comentarioAdmin || '-'}</td>
                        ) : (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.fechaRegistro || '-'}</td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.fechaInicioSesion || '-'}</td>


                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {userRol !== 'ADMIN' && (
                            <button
                              onClick={() => crearAdmin(user.idUsuario, !user.roles.includes("ADMIN"))}
                              className="hover:underline font-semibold text-purple-600 hover:text-purple-800 mr-3"
                              title={user.roles.includes("ADMIN") ? "Remover Permisos" : "Darle Permisos"}
                            >
                              {user.roles.includes("ADMIN") ? "- Admin" : "+ Admin"}
                            </button>
                          )}

                          {user.rolPrinciapl !== 'ADMIN' && (
                            <a className="mr-3 text-blue-600 hover:text-blue-900" href={`/perfil/${user.rolPrinciapl.toLowerCase()}/${user.idUsuario}`}> Ver Perfil
                            </a>
                          )}

                          {(
                            (userRol === "SUPER_ADMIN") ||
                            (userRol === "ADMIN" && !["ADMIN", "SUPER_ADMIN"].includes(user.rolPrinciapl))
                          ) && (
                              !filtrosAplicados.estado ? (
                                <button
                                  onClick={() => cambiarEstado(user.idUsuario, true)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  Reactivar
                                </button>
                              ) : (
                                <button
                                  onClick={() => cambiarEstado(user.idUsuario, false)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Banear
                                </button>
                              )
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4">
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

    </Layout>
  );
}
