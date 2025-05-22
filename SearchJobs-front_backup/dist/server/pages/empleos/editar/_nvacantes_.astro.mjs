import { e as createAstro, f as createComponent, r as renderTemplate, i as renderComponent, m as maybeRenderHead, h as addAttribute } from '../../../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../chunks/Layout_DMqpAtD-.mjs';
import { m as manejarRespuesta, $ as $$Footer, H as Header } from '../../../chunks/Footer_BR33Q6Xf.mjs';
/* empty css                                          */
import { A as API_URL } from '../../../chunks/Api_4ZQkpW66.mjs';
export { renderers } from '../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://searchjobs.com/");
const $$nvacantes = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$nvacantes;
  const { nvacantes } = Astro2.params;
  const res = await fetch(`${API_URL}/api/vacantes/seleccion/${nvacantes}`);
  const data = await manejarRespuesta(res);
  const vacante = data.vacanteSeleccionada;
  return renderTemplate(_a || (_a = __template(["", ' <script type="module" src="/src/javascripts/RegistroVacante.js"><\/script>'])), renderComponent($$result, "Layout", $$Layout, { "title": "Editar Oferta" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default" })} ${maybeRenderHead()}<div class="vacante-form-container"> <h1 class="vacante-form-title">Editar Oferta</h1> <p class="vacante-form-subtitle">Modifica los campos necesarios</p> ${vacante ? renderTemplate`<form id="vacanteForm" class="vacante-form" data-metodo="PUT"${addAttribute(`${API_URL}/api/vacantes/edit/${vacante.nvacantes}`, "data-endpoint-url")}> <input type="hidden" name="nvacantes"${addAttribute(vacante.nvacantes, "value")}> <!-- Primera fila --> <div class="form-row"> <div class="form-group"> <label for="titulo">Título del Puesto</label> <input type="text" id="titulo" name="titulo"${addAttribute(vacante.titulo || "", "value")} required> <p class="error-text hidden" id="error-titulo"></p> </div> </div> <!-- Segunda fila --> <div class="form-row"> <div class="form-group"> <label for="ciudad">Ciudad</label> <input type="text" id="ciudad" name="ciudad"${addAttribute(vacante.ciudad || "", "value")} required> <p class="error-text hidden" id="error-ciudad"></p> </div> <div class="form-group"> <label for="departamento">Departamento</label> <input type="text" id="departamento" name="departamento"${addAttribute(vacante.departamento || "", "value")} required> <p class="error-text hidden" id="error-departamento"></p> </div> </div> <!-- Fecha de publicación (solo lectura) --> <div class="form-row"> <div class="form-group full-width"> <label for="fechaPublicacion">Fecha de Publicación</label> <input type="date" id="fechaPublicacion" name="fechaPublicacion"${addAttribute(vacante.fechaPublicacion?.split("T")[0] || "", "value")} readonly> </div> </div> <!-- Tercera fila --> <div class="form-row"> <div class="form-group"> <label for="tipo">Vacante o Practica</label> <select id="tipo" name="tipo" required> <option value="" disabled>Seleccionar</option> <option value="Practica"${addAttribute(vacante.tipo === "Practica", "selected")}>Practica</option> <option value="Vacante"${addAttribute(vacante.tipo === "Vacante", "selected")}>Vacante</option> </select> <p class="error-text hidden" id="error-tipo"></p> </div> <div class="form-group"> <label for="modalidad">Modalidad</label> <select id="modalidad" name="modalidad" required> <option value="" disabled>Seleccionar</option> <option value="Presencial"${addAttribute(vacante.modalidad === "Presencial", "selected")}>Presencial</option> <option value="Remoto"${addAttribute(vacante.modalidad === "Remoto", "selected")}>Remoto</option> <option value="Hibrido"${addAttribute(vacante.modalidad === "Hibrido", "selected")}>Híbrido</option> </select> <p class="error-text hidden" id="error-modalidad"></p> </div> <div class="form-group"> <label for="sueldo">Sueldo</label> <input type="number" id="sueldo" name="sueldo" step="0.01"${addAttribute(vacante.sueldo || "", "value")}> <p class="error-text hidden" id="error-sueldo"></p> </div> </div> <!-- Cuarta fila --> <div class="form-row"> <div class="form-group"> <label for="cargo">Cargo</label> <input type="text" id="cargo" name="cargo"${addAttribute(vacante.cargo || "", "value")} required> <p class="error-text hidden" id="error-cargo"></p> </div> <div class="form-group"> <label for="experiencia">Experiencia</label> <input type="text" id="experiencia" name="experiencia"${addAttribute(vacante.experiencia || "", "value")}> <p class="error-text hidden" id="error-experiencia"></p> </div> </div> <!-- Descripción --> <div class="form-row"> <div class="form-group full-width"> <label for="descripcion">Descripción del Puesto</label> <textarea id="descripcion" name="descripcion" required>${vacante.descripcion || ""}</textarea> <p class="error-text hidden" id="error-descripcion"></p> </div> <div class="form-group full-width"> <label for="requerimientos">Requerimientos del Puesto</label> <textarea id="requerimientos" name="requerimientos" required>${vacante.requerimientos || ""}</textarea> <p class="error-text hidden" id="error-requerimientos"></p> </div> </div> <!-- Botones --> <div class="form-actions"> <a href="/empleos/listadoVacantes" class="btn btn-cancel">Cancelar</a> <button type="submit" class="btn btn-submit">Guardar Cambios</button> </div> </form>` : renderTemplate`<p>No se pudo cargar la vacante.</p>`} </div>  `, "footer": async ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}` }));
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/empleos/editar/[nvacantes].astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/empleos/editar/[nvacantes].astro";
const $$url = "/empleos/editar/[nvacantes]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$nvacantes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
