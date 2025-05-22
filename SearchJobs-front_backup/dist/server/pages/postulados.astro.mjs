import { f as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DMqpAtD-.mjs';
import { m as manejarRespuesta, H as Header, $ as $$Footer } from '../chunks/Footer_BR33Q6Xf.mjs';
/* empty css                                       */
/* empty css                                    */
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { P as Pagination } from '../chunks/Paginacion_DYftMR45.mjs';
import { A as API_URL } from '../chunks/Api_4ZQkpW66.mjs';
import Swal from 'sweetalert2';
export { renderers } from '../renderers.mjs';

const Postulaciones = ({ itemsPerPage = 10 }) => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [estado, setEstado] = useState("");
  const [fechaMinima, setFechaMinima] = useState("");
  const [tituloVacante, setTituloVacante] = useState("");
  const [empresa, setEmpresa] = useState("");
  const fetchPostulaciones = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/postulados/lista/candidato?page=${page - 1}&size=${itemsPerPage}&estado=${estado}&fechaMinima=${fechaMinima}&tituloVacante=${tituloVacante}&empresa=${empresa}`,
        { credentials: "include" }
      );
      const data = await manejarRespuesta(res);
      setPostulaciones(data.postulados);
      setTotalPages(data.totalPage);
    } catch (error) {
      console.error("❌ Error al cargar postulaciones:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPostulaciones(currentPage);
  }, [currentPage]);
  const buscar = () => {
    setCurrentPage(1);
    fetchPostulaciones(1);
  };
  const limpiarFiltros = () => {
    setEstado("");
    setFechaMinima("");
    setTituloVacante("");
    setEmpresa("");
    setCurrentPage(1);
    fetchPostulaciones(1);
  };
  const irADetalleVacante = (id) => {
    window.location.href = `/empleos/${id}`;
  };
  const cancelarPostulacion = async (nPostulacion, estado2, nVacante) => {
    const { isConfirmed } = await Swal.fire({
      title: "Cancelar postulación",
      text: "¿Estás seguro de que deseas cancelar esta postulación?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
      reverseButtons: true
    });
    if (!isConfirmed) return;
    try {
      const res = await fetch(`${API_URL}/api/postulados/cancelar/${nPostulacion}?estado=${estado2}&nvacante=${nVacante}`, {
        method: "PATCH",
        credentials: "include"
      });
      if (res.status === 204) {
        await Swal.fire({ text: "Postulación cancelada exitosamente.", icon: "success" });
        fetchPostulaciones(currentPage);
      } else {
        await Swal.fire({ text: "No se pudo cancelar la Postulacion", icon: "error" });
      }
    } catch (error) {
      await Swal.fire({ text: "❌ Ocurrió un error al cancelar la postulación.", icon: "error" });
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-800 mb-4", children: "Filtrar Postulaciones" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: tituloVacante,
            onChange: (e) => setTituloVacante(e.target.value),
            placeholder: "Filtrar por Vacante",
            className: "px-4 py-2 border rounded-lg flex-1 min-w-[200px]"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: empresa,
            onChange: (e) => setEmpresa(e.target.value),
            placeholder: "Filtrar por Empresa",
            className: "px-4 py-2 border rounded-lg flex-1 min-w-[200px]"
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: estado,
            onChange: (e) => setEstado(e.target.value),
            className: "px-4 py-2 border rounded-lg flex-1 min-w-[200px]",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Filtrar por Estado" }),
              /* @__PURE__ */ jsx("option", { value: "Espera", children: "En Espera" }),
              /* @__PURE__ */ jsx("option", { value: "Aceptada", children: "Aceptada" }),
              /* @__PURE__ */ jsx("option", { value: "Rechazada", children: "Rechazada" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            value: fechaMinima,
            onChange: (e) => setFechaMinima(e.target.value),
            className: "px-4 py-2 border rounded-lg flex-1 min-w-[200px]"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: buscar,
            className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200",
            children: "Buscar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: limpiarFiltros,
            className: "bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200",
            children: "Limpiar Filtros"
          }
        )
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("p", { children: "Cargando postulaciones..." }) : postulaciones.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-8 text-center text-gray-600", children: [
      /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-16 h-16 mb-4 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4v1m0 14v1m8-8h-1M5 12H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.021 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold", children: "No tienes postulaciones aún" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Una vez te postules a vacantes, aparecerán aquí." })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("table", { className: "min-w-full table-auto border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-200", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-gray-600", children: "Vacante" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-gray-600", children: "Fecha" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-gray-600", children: "Estado" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-gray-600", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: postulaciones.map((p) => /* @__PURE__ */ jsxs("tr", { className: "border-t", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-gray-800", children: p.vacante.titulo }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-gray-800", children: p.fechaPostulacion || "-" }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-gray-800", children: p.estado || "Espera" }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 space-x-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => irADetalleVacante(p.vacante.id),
                className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg",
                children: "Ver Vacante"
              }
            ),
            p.estado !== "Rechazada" && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => cancelarPostulacion(p.nPostulacion, false, p.vacante.id),
                className: "bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg",
                children: "Cancelar"
              }
            )
          ] })
        ] }, p.nPostulacion)) })
      ] }),
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

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "SearchJobs | Postulados" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default" })} ${maybeRenderHead()}<section class="pagina"> <h1>Postulaciones</h1> <p>Lista de Vacantes a las que aplicaste</p> ${renderComponent($$result2, "Postulaciones", Postulaciones, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Postulaciones.jsx", "client:component-export": "default" })} </section> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/postulados/index.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/postulados/index.astro";
const $$url = "/postulados";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
