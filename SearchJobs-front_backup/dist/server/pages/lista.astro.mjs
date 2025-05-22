import { f as createComponent, i as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DMqpAtD-.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Lista = createComponent(async ($$result, $$props, $$slots) => {
  let currentPage = 1;
  let totalPages = 1;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Vacantes Disponibles" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<h1>Vacantes Disponibles</h1> <ul id="vacantes-list"> <!-- Aqu\xED se llenar\xE1n las vacantes mediante JS --> </ul> <div class="pagination"> <button id="prev-btn"', ' onclick="cargarVacantes(currentPage - 1)">\nAnterior\n</button> <span id="page-number">P\xE1gina ', " de ", '</span> <button id="next-btn"', ' onclick="cargarVacantes(currentPage + 1)">\nSiguiente\n</button> </div> <script type="module">\n    // Variables para manejar la paginaci\xF3n\n    let currentPage = 1;\n    const itemsPerPage = 10;\n    const vacantesList = document.getElementById("vacantes-list");\n    const pageNumber = document.getElementById("page-number");\n    const prevBtn = document.getElementById("prev-btn");\n    const nextBtn = document.getElementById("next-btn");\n\n    // Funci\xF3n para cargar las vacantes\n    const cargarVacantes = async (page = 1) => {\n      try {\n        const res = await fetch(`/api/vacantes?page=${page}&size=${itemsPerPage}`);\n        const data = await manejarRespuesta(res); \n\n        vacantes = data.vacantes; // Los datos de las vacantes\n        totalPages = data.totalPages; // N\xFAmero total de p\xE1ginas\n        currentPage = page; // P\xE1gina actual\n\n        // Actualizar el contenido de la lista de vacantes\n        vacantesList.innerHTML = vacantes.map(vacante => {\n          return `\n            <li key="${vacante.id}">${vacante.titulo}</li>\n          `;\n        }).join(\'\');\n\n        // Actualizar la informaci\xF3n de la p\xE1gina\n        pageNumber.textContent = `P\xE1gina ${currentPage} de ${totalPages}`;\n\n        // Desactivar botones si estamos en la primera o \xFAltima p\xE1gina\n        prevBtn.disabled = currentPage === 1;\n        nextBtn.disabled = currentPage === totalPages;\n      } catch (err) {\n        console.error("Error al cargar vacantes:", err);\n      }\n    };\n\n    // Cargar la primera p\xE1gina de vacantes\n    cargarVacantes(currentPage);\n  <\/script> '], [" ", '<h1>Vacantes Disponibles</h1> <ul id="vacantes-list"> <!-- Aqu\xED se llenar\xE1n las vacantes mediante JS --> </ul> <div class="pagination"> <button id="prev-btn"', ' onclick="cargarVacantes(currentPage - 1)">\nAnterior\n</button> <span id="page-number">P\xE1gina ', " de ", '</span> <button id="next-btn"', ' onclick="cargarVacantes(currentPage + 1)">\nSiguiente\n</button> </div> <script type="module">\n    // Variables para manejar la paginaci\xF3n\n    let currentPage = 1;\n    const itemsPerPage = 10;\n    const vacantesList = document.getElementById("vacantes-list");\n    const pageNumber = document.getElementById("page-number");\n    const prevBtn = document.getElementById("prev-btn");\n    const nextBtn = document.getElementById("next-btn");\n\n    // Funci\xF3n para cargar las vacantes\n    const cargarVacantes = async (page = 1) => {\n      try {\n        const res = await fetch(\\`/api/vacantes?page=\\${page}&size=\\${itemsPerPage}\\`);\n        const data = await manejarRespuesta(res); \n\n        vacantes = data.vacantes; // Los datos de las vacantes\n        totalPages = data.totalPages; // N\xFAmero total de p\xE1ginas\n        currentPage = page; // P\xE1gina actual\n\n        // Actualizar el contenido de la lista de vacantes\n        vacantesList.innerHTML = vacantes.map(vacante => {\n          return \\`\n            <li key="\\${vacante.id}">\\${vacante.titulo}</li>\n          \\`;\n        }).join(\'\');\n\n        // Actualizar la informaci\xF3n de la p\xE1gina\n        pageNumber.textContent = \\`P\xE1gina \\${currentPage} de \\${totalPages}\\`;\n\n        // Desactivar botones si estamos en la primera o \xFAltima p\xE1gina\n        prevBtn.disabled = currentPage === 1;\n        nextBtn.disabled = currentPage === totalPages;\n      } catch (err) {\n        console.error("Error al cargar vacantes:", err);\n      }\n    };\n\n    // Cargar la primera p\xE1gina de vacantes\n    cargarVacantes(currentPage);\n  <\/script> '])), maybeRenderHead(), addAttribute(currentPage === 1, "disabled"), currentPage, totalPages, addAttribute(currentPage === totalPages, "disabled")) })}`;
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/lista.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/lista.astro";
const $$url = "/lista";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Lista,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
