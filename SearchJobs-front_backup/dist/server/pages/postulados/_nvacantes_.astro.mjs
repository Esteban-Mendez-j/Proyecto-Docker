import { e as createAstro, f as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DMqpAtD-.mjs';
import { m as manejarRespuesta, H as Header, $ as $$Footer } from '../../chunks/Footer_BR33Q6Xf.mjs';
/* empty css                                          */
/* empty css                                       */
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { P as Pagination } from '../../chunks/Paginacion_DYftMR45.mjs';
import { A as API_URL } from '../../chunks/Api_4ZQkpW66.mjs';
import Swal from 'sweetalert2';
export { renderers } from '../../renderers.mjs';

const Postulados = ({ vacanteId, itemsPerPage = 10 }) => {
  const [postulados, setPostulados] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("ROLE_INVITADO");
  const [filtroLocal, setFiltroLocal] = useState({
    estado: "",
    fechaMinima: "",
    nombreCandidato: ""
  });
  const [filtroActivo, setFiltroActivo] = useState({ ...filtroLocal });
  const fetchUserRole = async () => {
    try {
      const res = await fetch(`${API_URL}/api/usuarios/rol`, {
        credentials: "include"
      });
      const data = await manejarRespuesta(res);
      if (!data) {
        return;
      }
      setUserRole(data.rolPrincipal);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };
  const fetchPostulados = async (page = 1) => {
    setLoading(true);
    const { estado, fechaMinima, nombreCandidato } = filtroActivo;
    const params = new URLSearchParams({
      nvacantes: vacanteId,
      estado: estado || "",
      fechaMinima: fechaMinima || "",
      nombreCandidato: nombreCandidato || "",
      page: page - 1,
      size: itemsPerPage
    });
    try {
      const res = await fetch(`${API_URL}/api/postulados/lista?${params}`, {
        credentials: "include"
      });
      const data = await manejarRespuesta(res);
      if (!data) {
        return;
      }
      setPostulados(data.postulados);
      setTotalPages(data.totalPage);
    } catch (error) {
      console.error("❌ Error al cargar postulados:", error);
    } finally {
      setLoading(false);
    }
    fetchUserRole();
  };
  const handleBuscar = () => {
    setFiltroActivo({ ...filtroLocal });
    setCurrentPage(1);
  };
  const handleReset = () => {
    const valoresIniciales = { estado: "", fechaMinima: "", nombreCandidato: "" };
    setFiltroLocal(valoresIniciales);
    setFiltroActivo(valoresIniciales);
    setCurrentPage(1);
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltroLocal((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    fetchPostulados(currentPage);
  }, [vacanteId, currentPage, filtroActivo]);
  const abrirChat = async (candidatoId, vacanteId2) => {
    try {
      const response = await fetch(`${API_URL}/api/chats/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ candidatoId, vacanteId: vacanteId2 }),
        credentials: "include"
      });
      const chat = await manejarRespuesta(response);
      if (!chat) {
        return;
      }
      window.location.href = `/chat/${chat.id}`;
    } catch (err) {
      console.error("Error al abrir el chat:", err);
      await Swal.fire({ text: "No se pudo abrir el chat.", icon: "info" });
    }
  };
  const actualizarEstadoPostulacion = async (nPostulacion, nuevoEstado) => {
    const { isConfirmed } = await Swal.fire({
      title: "Confirmar acción",
      text: `¿Seguro que deseas marcar esta postulación como "${nuevoEstado}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    });
    if (!isConfirmed) return;
    try {
      const res = await fetch(`${API_URL}/api/postulados/edit/${nPostulacion}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (!res.ok) {
        await Swal.fire({ text: "Error al actualizar estado", icon: "error" });
      }
      alert(`Postulación ${nuevoEstado.toLowerCase()} correctamente`);
      fetchPostulados(currentPage);
    } catch (error) {
      console.error("Error al actualizar:", error);
      await Swal.fire({ text: "Ocurrió un error al actualizar la postulación", icon: "error" });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-md rounded-lg p-4 flex flex-wrap gap-4 items-end", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold mb-1", children: "Estado:" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            name: "estado",
            onChange: handleFilterChange,
            value: filtroLocal.estado,
            className: "border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Todos" }),
              /* @__PURE__ */ jsx("option", { value: "Espera", children: "En Espera" }),
              /* @__PURE__ */ jsx("option", { value: "Aceptada", children: "Aceptada" }),
              /* @__PURE__ */ jsx("option", { value: "Rechazada", children: "Rechazada" }),
              /* @__PURE__ */ jsx("option", { value: "Cancelada", children: "Canceladas" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold mb-1", children: "Fecha mínima:" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            name: "fechaMinima",
            value: filtroLocal.fechaMinima,
            onChange: handleFilterChange,
            className: "border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold mb-1", children: "Nombre Candidato:" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "nombreCandidato",
            value: filtroLocal.nombreCandidato,
            onChange: handleFilterChange,
            className: "border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleBuscar,
            className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md",
            children: "Buscar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleReset,
            className: "bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md",
            children: "Borrar filtros"
          }
        )
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500 text-lg", children: "Cargando postulados..." }) : postulados.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center p-6 bg-yellow-50 border border-yellow-200 rounded-lg", children: [
      /* @__PURE__ */ jsx("p", { className: "text-yellow-700 font-medium text-lg", children: "No hay postulaciones registradas." }),
      /* @__PURE__ */ jsx("p", { className: "text-yellow-600 text-sm", children: "Prueba ajustando los filtros o intenta más tarde." })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg overflow-hidden", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase", children: "Nombre" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase", children: "Fecha" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase", children: "Estado" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase", children: "CV" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase", children: "Perfil" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase", children: "Chat" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase", children: "Acción" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: postulados.map((postulado) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: [
            postulado.candidato.nombre,
            !postulado.active && /* @__PURE__ */ jsx("span", { className: "block text-xs text-yellow-600 font-medium", children: "Postulación desactivada" }),
            !postulado.vacanteIsActive && /* @__PURE__ */ jsx("span", { className: "block text-xs text-red-600 font-medium", children: "Vacante deshabilitada" })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: postulado.fechaPostulacion || "-" }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: postulado.estado || "Espera" }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx(
            "a",
            {
              href: `${API_URL}/pdf/${postulado.candidato.curriculo}`,
              target: "_blank",
              className: "text-blue-500 hover:underline font-medium",
              children: "Ver CV"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx(
            "a",
            {
              href: `/perfil/candidato/${postulado.candidato.id}?nPostulacion=${postulado.nPostulacion}`,
              className: "text-blue-500 hover:underline font-medium",
              children: "Ver perfil"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: (postulado.estado === "Espera" || postulado.estado === "Aceptada") && postulado.active && postulado.vacanteIsActive && userRole === "EMPRESA" && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => abrirChat(postulado.candidato.id, postulado.vacante.id),
              className: "bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-1 px-3 rounded-md",
              children: "Abrir chat"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap space-y-2", children: postulado.estado === "Espera" && postulado.active && postulado.vacanteIsActive && userRole === "EMPRESA" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "block w-full bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-1 px-3 rounded-md",
                onClick: () => actualizarEstadoPostulacion(postulado.nPostulacion, "Rechazada"),
                children: "Rechazar"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "block w-full bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-1 px-3 rounded-md",
                onClick: () => actualizarEstadoPostulacion(postulado.nPostulacion, "Aceptada"),
                children: "Aceptar"
              }
            )
          ] }) })
        ] }, postulado.candidato.id)) })
      ] }) }),
      /* @__PURE__ */ jsx(
        Pagination,
        {
          currentPage,
          setCurrentPage,
          totalPages
        }
      )
    ] })
  ] });
};

const $$Astro = createAstro("https://searchjobs.com/");
const $$nvacantes = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$nvacantes;
  const { nvacantes } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "SearchJobs | Postulados" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default" })} ${maybeRenderHead()}<section class="pagina"> <h1>Postulados</h1> <p>Lista de candidatos que han aplicado a vacantes.</p> ${renderComponent($$result2, "Postulados", Postulados, { "client:load": true, "vacanteId": Number(nvacantes), "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Postulados.jsx", "client:component-export": "default" })} </section> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/postulados/[nvacantes].astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/postulados/[nvacantes].astro";
const $$url = "/postulados/[nvacantes]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$nvacantes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
