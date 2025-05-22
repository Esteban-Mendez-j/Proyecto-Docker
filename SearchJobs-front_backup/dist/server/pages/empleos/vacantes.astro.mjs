import { f as createComponent, r as renderTemplate, i as renderComponent, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DMqpAtD-.mjs';
import { $ as $$Footer, H as Header } from '../../chunks/Footer_BR33Q6Xf.mjs';
/* empty css                                       */
import { A as API_URL } from '../../chunks/Api_4ZQkpW66.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Vacantes = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", ' <script type="module" src="/src/javascripts/RegistroVacante.js"><\/script>'])), renderComponent($$result, "Layout", $$Layout, { "title": "Crear Nueva Oferta" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default" })} ${maybeRenderHead()}<div class="vacante-form-container"> <h1 class="vacante-form-title">Crear Nueva Oferta</h1> <p class="vacante-form-subtitle">Complete todos los campos requeridos</p> <form id="vacanteForm" class="vacante-form" data-metodo="POST"${addAttribute(`${API_URL}/api/vacantes/add`, "data-endpoint-url")}> <!-- Primera fila --> <div class="form-row"> <div class="form-group"> <label for="titulo">Título del Puesto</label> <input type="text" id="titulo" name="titulo" placeholder="Ej: Desarrollador Frontend" required> <p class="error-text hidden" id="error-titulo"></p> </div> </div> <!-- Segunda fila --> <div class="form-row"> <div class="form-group"> <label for="ciudad">Ciudad</label> <input type="text" id="ciudad" name="ciudad" placeholder="Ciudad" required> <p class="error-text hidden" id="error-ciudad"></p> </div> <div class="form-group"> <label for="departamento">Departamento</label> <input type="text" id="departamento" name="departamento" placeholder="Ej: Bolívar" required> <p class="error-text hidden" id="error-departamento"></p> </div> </div> <!-- Tercera fila --> <div class="form-row"> <div class="form-group"> <label for="tipo">Vacante o Practica</label> <select id="tipo" name="tipo" required> <option value="" disabled selected>Seleccionar</option> <option value="Practica">Practica</option> <option value="Vacante">Vacante</option> </select> <p class="error-text hidden" id="error-tipo"></p> </div> <div class="form-group"> <label for="modalidad">Modalidad</label> <select id="modalidad" name="modalidad" required> <option value="" disabled selected>Seleccionar</option> <option value="Presencial">Presencial</option> <option value="Remoto">Remoto</option> <option value="Hibrido">Híbrido</option> </select> <p class="error-text hidden" id="error-modalidad"></p> </div> <div class="form-group"> <label for="sueldo">Sueldo</label> <input type="number" id="sueldo" name="sueldo" placeholder="Ej: 3000000" step="0.01"> <p class="error-text hidden" id="error-sueldo"></p> </div> </div> <!-- Cuarta fila --> <div class="form-row"> <div class="form-group"> <label for="cargo">Cargo</label> <input type="text" id="cargo" name="cargo" placeholder="Ej: Diseñador UI/UX" required> <p class="error-text hidden" id="error-cargo"></p> </div> <div class="form-group"> <label for="experiencia">Experiencia</label> <input type="text" id="experiencia" name="experiencia" placeholder="Ej: 2 años en desarrollo web"> <p class="error-text hidden" id="error-experiencia"></p> </div> </div> <!-- Descripción --> <div class="form-row"> <div class="form-group full-width"> <label for="descripcion">Descripción del Puesto</label> <textarea id="descripcion" name="descripcion" placeholder="Detalle las responsabilidades y requisitos" required></textarea> <p class="error-text hidden" id="error-descripcion"></p> </div> <div class="form-group full-width"> <label for="requerimientos">Requerimientos del Puesto</label> <textarea id="requerimientos" name="requerimientos" placeholder="Detalle las responsabilidades y requisitos" required></textarea> <p class="error-text hidden" id="error-requerimientos"></p> </div> </div> <!-- Botones --> <div class="form-actions"> <a href="/empleos/listadoVacantes" class="btn btn-cancel">Cancelar</a> <button type="submit" class="btn btn-submit">Guardar Vacante</button> </div> </form> </div>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}` }));
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/empleos/Vacantes.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/empleos/Vacantes.astro";
const $$url = "/empleos/Vacantes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Vacantes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
