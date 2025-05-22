import { f as createComponent, r as renderTemplate, i as renderComponent, m as maybeRenderHead } from '../../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$AdminSidebar } from '../../chunks/AdminSidebar_BiWNLNWi.mjs';
import { m as manejarRespuesta, $ as $$Footer, H as Header } from '../../chunks/Footer_BR33Q6Xf.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { A as API_URL } from '../../chunks/Api_4ZQkpW66.mjs';
/* empty css                                       */
import { P as Pagination } from '../../chunks/Paginacion_DYftMR45.mjs';
import { $ as $$Layout } from '../../chunks/Layout_DMqpAtD-.mjs';
/* empty css                                       */
export { renderers } from '../../renderers.mjs';

const VacantesActivas = () => {
  const [vacantes, setVacantes] = useState([]);
  const [npostulaciones, setnPostulaciones] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [fade, setFade] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchCiudad, setSearchCiudad] = useState("");
  const [searchCiudadInput, setSearchCiudadInput] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchUserInput, setSearchUserInput] = useState("");
  const [searchTipo, setSearchTipo] = useState("todos");
  const [searchTipoInput, setSearchTipoInput] = useState("todos");
  const [searchIsActive, setSearchIsActive] = useState(true);
  const [searchPostulado, setSearchPostulado] = useState(0);
  const [searchPostuladoInput, setSearchPostuladoInput] = useState("");
  const fetchVacantes = async () => {
    try {
      const filtro = {
        titulo: searchTerm,
        ciudad: searchCiudad,
        nameEmpresa: searchUser,
        tipo: searchTipo,
        isActive: searchIsActive,
        totalpostulaciones: searchPostulado
      };
      const res = await fetch(`${API_URL}/api/admin/listar/filtrovacantes?page=${currentPage - 1}&size=${pageSize}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(filtro)
      });
      const data = await manejarRespuesta(res);
      setTotalElements(data.totalElements);
      setVacantes(data.vacantes || []);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error:", err);
    }
  };
  const aplicarFiltros = () => {
    setSearchTerm(searchInput);
    setSearchCiudad(searchCiudadInput);
    setSearchUser(searchUserInput);
    setSearchTipo(searchTipoInput);
    setSearchPostulado(searchPostuladoInput);
  };
  const limpiarFIltros = () => {
    setSearchTerm(null);
    setSearchCiudad(null);
    setSearchUser(null);
    setSearchTipo("todos");
    setSearchPostulado(0);
    setSearchInput("");
    setSearchCiudadInput("");
    setSearchUserInput("");
    setSearchTipoInput("todos");
    setSearchPostuladoInput(0);
  };
  useEffect(
    () => {
      fetchVacantes();
    },
    [currentPage, pageSize, searchTerm, searchCiudad, searchUser, searchTipo, searchIsActive, searchPostulado]
  );
  const cambiarEstadoVacante = async (nvacante, estado) => {
    const { value: motivo } = await Swal.fire({
      title: `Escribe el motivo ${estado ? "de activación" : "de desactivación"} de la vacante`,
      input: "text",
      inputLabel: "Comentario",
      inputPlaceholder: "Escribe aquí...",
      showCancelButton: true,
      confirmButtonText: "Enviar"
    });
    if (!motivo) {
      return Swal.fire("Cancelado", "No se cambió el estado de la vacante.", "info");
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/cambiar-estado/vacantes?nvacante=${nvacante}&estado=${estado}&comentario=${encodeURIComponent(motivo)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      if (!res.ok) throw new Error("Error al cambiar el estado de la vacante");
      await Swal.fire("Éxito", "El estado de la vacante fue actualizado.", "success");
      const vacantesRes = await fetchVacantes();
      const data = await vacantesRes.json();
      setVacantes(data.vacantes || []);
    } catch (err) {
      console.error("Error al cambiar el estado de la vacante:", err);
      Swal.fire("Error", "Ocurrió un error al cambiar el estado.", "error");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 max-w-7xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Gestión de Vacantes" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Buscar Empresa...",
            value: searchUserInput,
            onChange: (e) => setSearchUserInput(e.target.value),
            className: "w-44 py-2 pl-4 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Buscar por Ciudad...",
            value: searchCiudadInput,
            onChange: (e) => setSearchCiudadInput(e.target.value),
            className: "w-44 py-2 pl-4 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Buscar por Título...",
            value: searchInput,
            onChange: (e) => setSearchInput(e.target.value),
            className: "w-44 py-2 pl-4 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: searchTipoInput,
            onChange: (e) => setSearchTipoInput(e.target.value),
            className: "w-44 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: "todos", children: "Todos los tipos" }),
              /* @__PURE__ */ jsx("option", { value: "Vacante", children: "Vacante" }),
              /* @__PURE__ */ jsx("option", { value: "Practica", children: "Práctica" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            placeholder: "Buscar por Postulacion..",
            type: "number",
            value: searchPostuladoInput,
            onChange: (e) => setSearchPostuladoInput(e.target.value),
            min: "0",
            className: "w-44 py-2 pl-4 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        ),
        /* @__PURE__ */ jsx("button", { onClick: aplicarFiltros, className: "px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700", children: "Buscar" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setSearchIsActive(!searchIsActive), className: "px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600", children: searchIsActive ? "Ver Baneados" : "Ver Activos" }),
        /* @__PURE__ */ jsx("button", { onClick: limpiarFIltros, className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-gray-600", children: "Limpiar Filtros" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200", children: /* @__PURE__ */ jsx("nav", { className: "flex -mb-px", children: searchIsActive ? /* @__PURE__ */ jsxs("button", { className: "px-4 py-3 font-medium text-blue-600 border-b-2 border-blue-600 tab-button active", children: [
      "Vacantes Activas (",
      totalElements,
      ")"
    ] }) : /* @__PURE__ */ jsxs("button", { className: "px-4 py-3 font-medium text-blue-600 border-b-2 border-blue-600 tab-button active", children: [
      "Vacantes Desactivadas (",
      totalElements,
      ")"
    ] }) }) }) }),
    /* @__PURE__ */ jsx("div", { className: `tab-content transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`, children: /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto bg-white border border-gray-100 rounded-lg shadow-sm", children: [
      /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: `px-4 py-3 text-left text-xs font-semibold ${searchIsActive ? "text-blue-900 uppercase" : "text-red-900 uppercase"}`, children: "Título" }),
          /* @__PURE__ */ jsx("th", { className: `px-4 py-3 text-left text-xs font-semibold ${searchIsActive ? "text-blue-900 uppercase" : "text-red-900 uppercase"}`, children: "Empresa" }),
          /* @__PURE__ */ jsx("th", { className: `px-4 py-3 text-left text-xs font-semibold ${searchIsActive ? "text-blue-900 uppercase" : "text-red-900 uppercase"}`, children: "Ubicación" }),
          /* @__PURE__ */ jsx("th", { className: `px-4 py-3 text-left text-xs font-semibold ${searchIsActive ? "text-blue-900 uppercase" : "text-red-900 uppercase"}`, children: "Tipo" }),
          searchIsActive ? /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase", children: "Postulaciones" }) : /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-red-900 uppercase", children: "Motivo" }),
          /* @__PURE__ */ jsx("th", { className: `px-4 py-3 text-right text-xs font-semibold ${searchIsActive ? "text-blue-900 uppercase" : "text-red-900 uppercase"}`, children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: vacantes.map((vacantes2) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: vacantes2.titulo }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: vacantes2.nameEmpresa }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: vacantes2.ciudad }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-xs font-semibold rounded-full ${vacantes2.tipo === "Vacante" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`, children: vacantes2.tipo }) }),
          searchIsActive ? /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: vacantes2.nPostulados }) : /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: vacantes2.comentarioAdmin }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-4 flex justify-center", children: [
            /* @__PURE__ */ jsx("a", { href: `/empleos/${vacantes2.nvacantes}`, className: "mr-3 text-blue-600 hover:text-blue-900", children: "Ver" }),
            searchIsActive ? /* @__PURE__ */ jsx(
              "button",
              {
                className: "mr-3 text-red-600 hover:text-red-500",
                onClick: () => cambiarEstadoVacante(vacantes2.nvacantes, false),
                children: "Desactivar"
              }
            ) : /* @__PURE__ */ jsx(
              "button",
              {
                className: "mr-3 text-green-800 hover:text-green-500",
                onClick: () => cambiarEstadoVacante(vacantes2.nvacantes, true),
                children: "Reactivar"
              }
            ),
            /* @__PURE__ */ jsx("a", { href: `/postulados/${vacantes2.nvacantes}`, className: "text-blue-600 hover:text-blue-900", children: "Postulados" })
          ] })
        ] }, vacantes2.nvacantes)) })
      ] }),
      /* @__PURE__ */ jsx(
        Pagination,
        {
          currentPage,
          setCurrentPage,
          totalPages
        }
      )
    ] }) })
  ] });
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Vacantes = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", ` <!-- <VacantesDesactivadas client:load /> --> <!-- 
      
      <div class="flex-1">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold">Gesti\xF3n de Vacantes</h1>
          
          <div class="flex gap-2">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Buscar vacantes..." 
                class="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2">
                <circle cx="11" cy="11" class="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            
            <button class="flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Nueva Vacante
            </button>
          </div>
        </div>
        
        <div class="mb-6">
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px">
              <button id="tab-activas" class="px-4 py-3 font-medium text-blue-600 border-b-2 border-blue-600 tab-button active">
                Vacantes Activas ({vacantesActivas.length})
              </button>
              <button id="tab-desactivadas" class="px-4 py-3 font-medium text-gray-500 border-b-2 border-transparent tab-button hover:text-gray-700 hover:border-gray-300">
                Vacantes Desactivadas ({vacantesDesactivadas.length})
              </button>
            </nav>
          </div>
        </div>
        
        <div id="content-activas" class="tab-content">
          <div class="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">T\xEDtulo</th>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Empresa</th>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ubicaci\xF3n</th>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Fecha</th>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Postulaciones</th>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {vacantesActivas.map((vacante) => (
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{vacante.titulo}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{vacante.empresa}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{vacante.ubicacion}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{vacante.fechaPublicacion}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{vacante.postulaciones}</div>
                    </td>
                    <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <button class="mr-3 text-blue-600 hover:text-blue-900">Ver</button>
                      <button class="text-red-600 hover:text-red-900 desactivar-btn" data-id={vacante.id} data-titulo={vacante.titulo}>Desactivar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div id="content-desactivadas" class="hidden tab-content">
          <div class="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">T\xEDtulo</th>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Empresa</th>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ubicaci\xF3n</th>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Fecha Desactivaci\xF3n</th>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Motivo</th>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {vacantesDesactivadas.map((vacante) => (
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{vacante.titulo}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{vacante.empresa}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{vacante.ubicacion}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{vacante.fechaDesactivacion}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{vacante.motivo}</div>
                    </td>
                    <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <button class="mr-3 text-blue-600 hover:text-blue-900">Ver</button>
                      <button class="text-green-600 hover:text-green-900 activar-btn" data-id={vacante.id} data-titulo={vacante.titulo}>Activar</button>
                    </td>
                  </tr> --> <!-- </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div> --> <!-- <div id="modal-desactivar" class="fixed inset-0 z-50 flex items-center justify-center hidden bg-black bg-opacity-50">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
      <h3 class="mb-4 text-lg font-semibold">Desactivar Vacante</h3>
      <p class="mb-4">\xBFEst\xE1s seguro de que deseas desactivar la vacante <span id="vacante-titulo-desactivar" class="font-medium"></span>?</p>
      
      <div class="mb-4">
        <label for="motivo-desactivar" class="block mb-1 text-sm font-medium text-gray-700">Motivo de desactivaci\xF3n</label>
        <textarea id="motivo-desactivar" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Explica el motivo de la desactivaci\xF3n..."></textarea>
      </div>
      
      <div class="flex justify-end gap-3">
        <button id="cancelar-desactivar" class="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
        <button id="confirmar-desactivar" class="px-4 py-2 text-white transition-colors bg-red-600 rounded-md hover:bg-red-700">Desactivar</button>
      </div>
    </div>
  </div>
  
  <div id="modal-activar" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style="display: none;">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
      <h3 class="mb-4 text-lg font-semibold">Activar Vacante</h3>
      <p class="mb-4">\xBFEst\xE1s seguro de que deseas activar la vacante <span id="vacante-titulo-activar" class="font-medium"></span>?</p>
      
      <div class="mb-4">
        <label for="comentario-activar" class="block mb-1 text-sm font-medium text-gray-700">Comentario (opcional)</label>
        <textarea id="comentario-activar" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="A\xF1ade un comentario..."></textarea>
      </div>
      
      <div class="flex justify-end gap-3">
        <button id="cancelar-activar" class="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
        <button id="confirmar-activar" class="px-4 py-2 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700">Activar</button>
      </div>
    </div>
  </div> --> <!-- <script type="text/javascript">
  document.addEventListener('DOMContentLoaded', () => {
 
    const tabActivas = document.getElementById('tab-activas');
    const tabDesactivadas = document.getElementById('tab-desactivadas');
    const contentActivas = document.getElementById('content-activas');
    const contentDesactivadas = document.getElementById('content-desactivadas');
    
    tabActivas.addEventListener('click', () => {
      tabActivas.classList.add('active', 'border-blue-600', 'text-blue-600');
      tabActivas.classList.remove('border-transparent', 'text-gray-500');
      tabDesactivadas.classList.remove('active', 'border-blue-600', 'text-blue-600');
      tabDesactivadas.classList.add('border-transparent', 'text-gray-500');
      
      contentActivas.classList.remove('hidden');
      contentDesactivadas.classList.add('hidden');
    });
    
    tabDesactivadas.addEventListener('click', () => {
      tabDesactivadas.classList.add('active', 'border-blue-600', 'text-blue-600');
      tabDesactivadas.classList.remove('border-transparent', 'text-gray-500');
      tabActivas.classList.remove('active', 'border-blue-600', 'text-blue-600');
      tabActivas.classList.add('border-transparent', 'text-gray-500');
      
      contentDesactivadas.classList.remove('hidden');
      contentActivas.classList.add('hidden');
    });
    
    const modalDesactivar = document.getElementById('modal-desactivar');
    const vacanteDesactivarTitulo = document.getElementById('vacante-titulo-desactivar');
    const cancelarDesactivar = document.getElementById('cancelar-desactivar');
    const confirmarDesactivar = document.getElementById('confirmar-desactivar');
    const desactivarBtns = document.querySelectorAll('.desactivar-btn');
    
    desactivarBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const titulo = btn.getAttribute('data-titulo');
        
        vacanteDesactivarTitulo.textContent = titulo;
        modalDesactivar.classList.remove('hidden');
      });
    });
    
    cancelarDesactivar.addEventListener('click', () => {
      modalDesactivar.classList.add('hidden');
    });
    
    confirmarDesactivar.addEventListener('click', () => {
     
      await Swal.fire({ text: 'Vacante desactivada correctamente', icon: 'info' });      modalDesactivar.classList.add('hidden');
    });
    
    const modalActivar = document.getElementById('modal-activar');
    const vacanteActivarTitulo = document.getElementById('vacante-titulo-activar');
    const cancelarActivar = document.getElementById('cancelar-activar');
    const confirmarActivar = document.getElementById('confirmar-activar');
    const activarBtns = document.querySelectorAll('.activar-btn');
    
    activarBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const titulo = btn.getAttribute('data-titulo');
        
        vacanteActivarTitulo.textContent = titulo;
        modalActivar.classList.remove('hidden');
      });
    });
    
    cancelarActivar.addEventListener('click', () => {
      modalActivar.classList.add('hidden');
    });
    
    confirmarActivar.addEventListener('click', () => {
     
      await Swal.fire({ text: 'Vacante activada correctamente', icon: 'info' });      modalActivar.classList.add('hidden');
    });
  });
<\/script> --> `])), renderComponent($$result, "Layout", $$Layout, { "title": "Gesti\xF3n de Vacantes | SearchJobs", "data-astro-cid-636y5yty": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default", "data-astro-cid-636y5yty": true })}${maybeRenderHead()}<br data-astro-cid-636y5yty> <div class="container px-4 py-6 mx-auto" data-astro-cid-636y5yty> <div class="flex flex-col gap-6 md:flex-row" data-astro-cid-636y5yty> ${renderComponent($$result2, "AdminSidebar", $$AdminSidebar, { "activeItem": "vacantes", "data-astro-cid-636y5yty": true })} <div class="flex-1" data-astro-cid-636y5yty> ${renderComponent($$result2, "VacantesActivas", VacantesActivas, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/VacantesActivas.jsx", "client:component-export": "default", "data-astro-cid-636y5yty": true })} </div> </div> </div>  `, "footer": async ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer", "data-astro-cid-636y5yty": true })}` }));
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/admin/vacantes.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/admin/vacantes.astro";
const $$url = "/admin/vacantes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Vacantes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
