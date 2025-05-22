import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { A as API_URL } from './Api_4ZQkpW66.mjs';
/* empty css                         */
import { P as Pagination } from './Paginacion_DYftMR45.mjs';
import { m as manejarRespuesta } from './Footer_BR33Q6Xf.mjs';

function FilterComponent({ filtersLocal, clearAllFilters, handleFilterChange, setFilters, rol, handleEstadoChange }) {
  return /* @__PURE__ */ jsxs("div", { className: "filters-container", children: [
    /* @__PURE__ */ jsxs("div", { className: "filter-group", children: [
      /* @__PURE__ */ jsx("h4", { className: "filter-group-title", children: "Tipo de empleo" }),
      /* @__PURE__ */ jsxs("div", { className: "filter-options", children: [
        /* @__PURE__ */ jsxs("label", { className: "filter-option", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "radio",
              name: "tipo",
              value: "Vacante",
              onChange: handleFilterChange,
              checked: filtersLocal.tipo === "Vacante"
            }
          ),
          /* @__PURE__ */ jsx("span", { children: "Vacantes" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "filter-option", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "radio",
              name: "tipo",
              value: "Practica",
              onChange: handleFilterChange,
              checked: filtersLocal.tipo === "Practica"
            }
          ),
          /* @__PURE__ */ jsx("span", { children: "Practicas" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "filter-group", children: [
      /* @__PURE__ */ jsx("h4", { className: "filter-group-title", children: "Experiencia Minima" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          min: 0,
          name: "experiencia",
          onChange: handleFilterChange,
          value: filtersLocal.experiencia || "",
          className: "search-input"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "filter-group", children: [
      /* @__PURE__ */ jsx("h4", { className: "filter-group-title", children: "Sueldo Minimo" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          name: "sueldo",
          min: 0,
          onChange: handleFilterChange,
          value: filtersLocal.sueldo || "",
          className: "search-input"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "filter-group", children: [
      /* @__PURE__ */ jsx("h4", { className: "filter-group-title", children: "Postulados" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          min: 0,
          name: "totalpostulaciones",
          onChange: handleFilterChange,
          value: filtersLocal.totalpostulaciones || "",
          className: "search-input"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "filter-group", children: [
      /* @__PURE__ */ jsx("h4", { className: "filter-group-title", children: "Modalidad" }),
      /* @__PURE__ */ jsxs("div", { className: "filter-options", children: [
        /* @__PURE__ */ jsxs("label", { className: "filter-option", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "radio",
              name: "modalidad",
              value: "Remoto",
              onChange: handleFilterChange,
              checked: filtersLocal.modalidad === "Remoto"
            }
          ),
          /* @__PURE__ */ jsx("span", { children: "Remoto" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "filter-option", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "radio",
              name: "modalidad",
              value: "Presencial",
              onChange: handleFilterChange,
              checked: filtersLocal.modalidad === "Presencial"
            }
          ),
          /* @__PURE__ */ jsx("span", { children: "Presencial" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "filter-option", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "radio",
              name: "modalidad",
              value: "Hibrido",
              onChange: handleFilterChange,
              checked: filtersLocal.modalidad === "Hibrido"
            }
          ),
          /* @__PURE__ */ jsx("span", { children: "Híbrido" })
        ] })
      ] })
    ] }),
    rol === "empresa" && /* @__PURE__ */ jsxs("div", { className: "filter-group", children: [
      /* @__PURE__ */ jsx("h4", { className: "filter-group-title", children: "Estado" }),
      /* @__PURE__ */ jsxs("select", { name: "estado", value: filtersLocal.estado, onChange: handleEstadoChange, className: "search-input", children: [
        /* @__PURE__ */ jsx("option", { value: "todas", selected: true, children: "Todas" }),
        /* @__PURE__ */ jsx("option", { value: "activas", children: "Activas" }),
        /* @__PURE__ */ jsx("option", { value: "desactivadasAdmin", children: "Desactivadas por Admin" }),
        /* @__PURE__ */ jsx("option", { value: "pausadasEmpresa", children: "Pausadas por Empresa" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "filter-group", children: [
      /* @__PURE__ */ jsx("h4", { className: "filter-group-title", children: "Cargo" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          name: "cargo",
          onChange: handleFilterChange,
          value: filtersLocal.cargo || "",
          className: "search-input"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "btn btn-primary filter-search-button",
        onClick: () => {
          clearAllFilters();
          setFilters({
            titulo: null,
            tipo: "todos",
            experiencia: null,
            modalidad: null,
            cargo: null,
            isActive: null,
            activaPorEmpresa: null,
            ciudad: null,
            sueldo: null,
            totalpostulaciones: null
          });
        },
        children: "Eliminar filtros"
      }
    )
  ] });
}

const JobList = ({ jobs, rol, setCurrentPage, currentPage, totalPages, fetchAllJobs }) => {
  async function cambiarEstado(id, estado) {
    let mensaje = estado ? "activar" : "desactivar";
    const { isConfirmed } = await Swal.fire({
      title: "Confirmar acción",
      text: `¿Estás seguro de que deseas ${mensaje} esta vacante?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
      // pone Cancelar a la izquierda
    });
    if (!isConfirmed) return;
    try {
      const response = await fetch(`${API_URL}/api/vacantes/estado/${id}?estado=${estado}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      if (response.ok) {
        await Swal.fire({ text: `Exito al ${mensaje} la vacante`, icon: "success" });
        fetchAllJobs();
      } else {
        await Swal.fire({ text: `Error al ${mensaje} la vacante.`, icon: "error" });
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      await Swal.fire({ text: "Hubo un problema al intentar eliminar la vacante.", icon: "error" });
    }
  }
  if (jobs.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-96 text-center p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-700 mb-2", children: "No se encontraron resultados" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Intenta cambiar los filtros o revisar tu búsqueda." })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "jobs-grid", children: jobs.map((job) => /* @__PURE__ */ jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxs("a", { href: `/empleos/${job.nvacantes}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "header", children: [
          /* @__PURE__ */ jsx("div", { className: "logo", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: job.imagenEmpresa ? `${API_URL}/img/` + job.imagenEmpresa : `${API_URL}/images/imgEmpresa.png`,
              alt: `${job.nameEmpresa} logo`,
              width: "60",
              height: "60"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "info", children: [
            !job.active && /* @__PURE__ */ jsx("span", { className: " top-4 left-4 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md", children: rol === "empresa" ? "Desactivada por Admin" : "Desactivada" }),
            !job.activaPorEmpresa && job.active && /* @__PURE__ */ jsx("span", { className: " top-4 left-4 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md", children: rol === "empresa" ? "Desactivada por ti" : "Desactivada" }),
            job.candidatoPostulado && job.estadoPostulacion !== "Cancelada" && /* @__PURE__ */ jsx(
              "span",
              {
                className: `top-4 right-4 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md ${job.estadoPostulacion === "Aceptada" ? "bg-green-500" : job.estadoPostulacion === "Rechazada" ? "bg-red-500" : "bg-blue-500"}`,
                children: job.estadoPostulacion
              }
            ),
            /* @__PURE__ */ jsx("h3", { className: "title", children: job.titulo }),
            /* @__PURE__ */ jsx("p", { className: "company", children: job.nameEmpresa })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "details", children: [
          /* @__PURE__ */ jsxs("div", { className: "detail", children: [
            /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "icon", children: [
              /* @__PURE__ */ jsx("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
              /* @__PURE__ */ jsx("circle", { cx: "12", cy: "10", r: "3" })
            ] }),
            /* @__PURE__ */ jsx("span", { children: job.ciudad })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "detail", children: [
            /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "icon", children: [
              /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ jsx("polyline", { points: "12 6 12 12 16 14" })
            ] }),
            /* @__PURE__ */ jsx("span", { children: job.tipo })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "detail", children: [
            /* @__PURE__ */ jsxs(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: "icon",
                children: [
                  /* @__PURE__ */ jsx("rect", { x: "2", y: "7", width: "20", height: "14", rx: "2", ry: "2" }),
                  /* @__PURE__ */ jsx("path", { d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs("span", { children: [
              job.experiencia,
              " años"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "detail", children: [
            /* @__PURE__ */ jsxs(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: "icon",
                children: [
                  /* @__PURE__ */ jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
                  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7", r: "4" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs("span", { children: [
              job.nPostulados,
              " postulados"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "apply", children: /* @__PURE__ */ jsx("span", { className: "apply-text", children: "Ver detalles" }) })
      ] }),
      rol === "empresa" && /* @__PURE__ */ jsxs("div", { className: "apply", children: [
        /* @__PURE__ */ jsx("a", { href: `/empleos/editar/${job.nvacantes}`, className: "btn btn-edit", children: "Editar" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => cambiarEstado(job.nvacantes, !job.activaPorEmpresa),
            className: `px-4 py-2 font-semibold rounded-lg shadow ${job.activaPorEmpresa ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`,
            children: job.activaPorEmpresa ? "Desactivar" : "Activar"
          }
        )
      ] })
    ] }, job.nvacantes)) }),
    /* @__PURE__ */ jsx(
      Pagination,
      {
        currentPage,
        setCurrentPage,
        totalPages
      }
    )
  ] });
};

function FiltroSuperior({ filtersLocal, handleFilterChange, setFilters }) {
  return /* @__PURE__ */ jsx("div", { className: "search-container", children: /* @__PURE__ */ jsxs("div", { className: "search-form", children: [
    /* @__PURE__ */ jsxs("div", { className: "search-input-group", children: [
      /* @__PURE__ */ jsxs(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: "search-icon",
          children: [
            /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
            /* @__PURE__ */ jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Titulo de la vacante",
          name: "titulo",
          onChange: handleFilterChange,
          value: filtersLocal.titulo || "",
          className: "search-input-sup"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "search-input-group", children: [
      /* @__PURE__ */ jsxs(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: "search-icon",
          children: [
            /* @__PURE__ */ jsx("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
            /* @__PURE__ */ jsx("circle", { cx: "12", cy: "10", r: "3" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Ciudad",
          name: "ciudad",
          onChange: handleFilterChange,
          value: filtersLocal.ciudad || "",
          className: "search-input-sup"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "btn btn-primary search-button",
        onClick: () => setFilters(filtersLocal),
        children: "Buscar"
      }
    )
  ] }) });
}

const JobBoard = ({ fetchUrl, rol }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElement, setTotalElement] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    titulo: null,
    tipo: "todos",
    experiencia: null,
    modalidad: null,
    active: null,
    activaPorEmpresa: null,
    cargo: null,
    ciudad: null,
    sueldo: null,
    totalpostulaciones: null
  });
  const [filtersLocal, setFiltersLocal] = useState({
    titulo: null,
    tipo: "todos",
    experiencia: null,
    modalidad: null,
    active: null,
    activaPorEmpresa: null,
    cargo: null,
    ciudad: null,
    sueldo: null,
    totalpostulaciones: null
  });
  const [filteredJobs, setFilteredJobs] = useState([]);
  const itemsPerPage = 20;
  const fetchAllJobs = async () => {
    try {
      const res = await fetch(`${fetchUrl}?page=${currentPage - 1}&size=${itemsPerPage}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(filters)
      });
      const data = await manejarRespuesta(res);
      if (!data) {
        return;
      }
      setFilteredJobs(data.vacantes || []);
      setTotalElement(data.totalElements);
      setTotalPages(data.totalPage);
    } catch (error) {
      console.error("Error cargando vacantes:", error);
    }
  };
  useEffect(() => {
    fetchAllJobs();
  }, [filters, currentPage]);
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFiltersLocal((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleEstadoChange = (event) => {
    const estadoSeleccionado = event.target.value;
    setFiltersLocal((prev) => ({
      ...prev,
      estado: estadoSeleccionado
    }));
    const nuevoFiltro = {
      ...filtersLocal,
      estado: estadoSeleccionado,
      active: void 0,
      activaPorEmpresa: void 0
    };
    switch (estadoSeleccionado) {
      case "activas":
        nuevoFiltro.active = true;
        nuevoFiltro.activaPorEmpresa = true;
        break;
      case "desactivadasAdmin":
        nuevoFiltro.active = false;
        break;
      case "pausadasEmpresa":
        nuevoFiltro.activaPorEmpresa = false;
        break;
    }
    setFiltersLocal(nuevoFiltro);
    setCurrentPage(1);
  };
  const clearAllFilters = () => {
    setFiltersLocal({
      titulo: null,
      tipo: null,
      experiencia: null,
      active: null,
      activaPorEmpresa: null,
      modalidad: null,
      cargo: null,
      ciudad: null,
      sueldo: null,
      totalpostulaciones: null
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "page-header", children: /* @__PURE__ */ jsx(
      FiltroSuperior,
      {
        filtersLocal,
        handleFilterChange,
        setFilters
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "content-container", children: [
      /* @__PURE__ */ jsx(
        FilterComponent,
        {
          filtersLocal,
          clearAllFilters,
          handleFilterChange,
          setFilters,
          rol,
          handleEstadoChange
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "jobs-container", children: [
        /* @__PURE__ */ jsxs("div", { className: "jobs-header", children: [
          /* @__PURE__ */ jsx("h2", { className: "jobs-title", children: "Empleos disponibles" }),
          /* @__PURE__ */ jsxs("div", { className: "jobs-count", children: [
            totalElement,
            " empleos encontrados"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          JobList,
          {
            jobs: filteredJobs,
            rol,
            currentPage,
            setCurrentPage,
            totalPages,
            fetchAllJobs
          }
        )
      ] })
    ] })
  ] });
};

export { JobBoard as J };
