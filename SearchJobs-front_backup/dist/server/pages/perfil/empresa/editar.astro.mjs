import { e as createAstro, f as createComponent, i as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead } from '../../../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { m as manejarRespuesta, $ as $$Footer, H as Header } from '../../../chunks/Footer_BR33Q6Xf.mjs';
import { $ as $$Layout } from '../../../chunks/Layout_DMqpAtD-.mjs';
/* empty css                                      */
import { A as API_URL } from '../../../chunks/Api_4ZQkpW66.mjs';
export { renderers } from '../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://searchjobs.com/");
const $$Editar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Editar;
  const apiUrl = `${API_URL}/api/empresas/perfil`;
  const res = await fetch(apiUrl, {
    headers: Astro2.request.headers
  });
  const data = await manejarRespuesta(res);
  const empresa = data.empresa || {};
  const sectores = [
    "Tecnologia de la Informacion (TI) / Software",
    "Salud y Medicina",
    "Educacion y Formacion",
    "Construccion e Infraestructura",
    "Manufactura e Industria",
    "Comercio y Ventas",
    "Logistica y Transporte",
    "Banca, Finanzas y Seguros",
    "Agroindustria y Agricultura",
    "Legal y Juridico",
    "Turismo, Hoteleria y Gastronomia",
    "Medios, Comunicacion y Publicidad",
    "Energia y Mineria",
    "Servicios Profesionales y Consultoria",
    "Arte, Cultura y Entretenimiento",
    "Bienes Raices e Inmobiliaria",
    "Ciencia e Investigacion",
    "Organizaciones sin Fines de Lucro y ONG",
    "Otros"
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Editar ${empresa.nombre} | SearchJobs` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", '<div class="min-h-screen bg-sky-50/60 py-12"> <form id="PerfilForm"', ' class="mx-auto w-full max-w-5xl space-y-10 rounded-3xl bg-white/90 backdrop-blur shadow-2xl ring-1 ring-sky-100 p-10"> <!-- Cabecera --> <div class="flex flex-col md:flex-row items-center gap-8"> <!-- Logo  --> <div class="relative shrink-0"> <!-- miniatura --> <img id="logo-preview"', ' alt="Logo" class="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover ring-4 ring-sky-200"> <!-- bot\xF3n\xA0c\xE1mara --> <label for="logo-upload" class="absolute -bottom-2 -right-2 grid place-items-center h-10 w-10 rounded-full bg-sky-600 hover:bg-sky-700 transition shadow-md text-white cursor-pointer" title="Cambiar logo"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"> <path d="M3 7h2l2-3h10l2 3h2a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2Z"></path> <circle cx="12" cy="13" r="4"></circle> </svg> </label> <!-- input de archivo --> <input id="logo-upload" type="file" name="img" accept="image/*" class="hidden"> <!-- NUEVO: ruta de la imagen actual --> <input type="hidden" name="imgen"', '> <p class="error-text hidden" id="error-imagen"></p> </div> <!-- Nombre & Sector --> <div class="flex-1 w-full space-y-4"> <input id="nombre" name="nombre"', ' placeholder="Nombre de la empresa" class="w-full text-3xl font-semibold bg-transparent border-b-2 border-sky-200 focus:border-sky-500 focus:outline-none" required> <p class="error-text hidden" id="error-nombre"></p> <select id="sectorEmpresa" name="sectorEmpresarial" class="w-full rounded-lg border border-sky-200 bg-sky-50/40 py-2 px-3 focus:ring-2 focus:ring-sky-400" required> ', ' </select> <p class="error-text hidden" id="error-sectorEmpresarial"></p> </div> </div> <!-- Contenido del perfil --> <div class="empresa-perfil-content"> <!-- Informaci\xF3n de contacto --> <div class="empresa-info-grid"> <div class="empresa-info-item"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect> <line x1="16" y1="2" x2="16" y2="6"></line> <line x1="8" y1="2" x2="8" y2="6"></line> <line x1="3" y1="10" x2="21" y2="10"></line> </svg> <div class="empresa-info-content"> <span class="empresa-info-label">NIT</span> <input type="text" id="nit" name="nit"', ' class="empresa-info-input" placeholder="NIT de la empresa" required> <p class="error-text hidden" id="error-nit"></p> </div> </div> <div class="empresa-info-item"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path> <polyline points="22,6 12,13 2,6"></polyline> </svg> <div class="empresa-info-content"> <span class="empresa-info-label">Correo</span> <input type="email" id="correo" name="correo"', ' class="empresa-info-input" placeholder="Correo electr\xF3nico" required> <p class="error-text hidden" id="error-correo"></p> </div> </div> <div class="empresa-info-item"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path> </svg> <div class="empresa-info-content"> <span class="empresa-info-label">Tel\xE9fono</span> <input type="tel" id="telefono" name="telefono"', ' class="empresa-info-input" placeholder="Tel\xE9fono de contacto"> <p class="error-text hidden" id="error-telefono"></p> </div> </div> <div class="empresa-info-item"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <circle cx="12" cy="12" r="10"></circle> <line x1="2" y1="12" x2="22" y2="12"></line> <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path> </svg> <div class="empresa-info-content"> <span class="empresa-info-label">Sitio Web</span> <input type="url" id="sitioWeb" name="sitioWeb"', ' class="empresa-info-input" placeholder="Sitio web (ejemplo.com)"> <p class="error-text hidden" id="error-sitioWeb"></p> </div> </div> </div> <!-- Secci\xF3n de descripci\xF3n --> <div class="empresa-descripcion-section"> <h2 class="empresa-section-title">Descripci\xF3n</h2> <textarea id="descripcion" name="descripcion" class="empresa-descripcion-input" placeholder="Describe tu empresa, su misi\xF3n, visi\xF3n y valores...">', '</textarea> <p class="error-text hidden" id="error-descripcion"></p> </div> <!-- Botones de acci\xF3n --> <div class="empresa-form-actions"> <button type="submit" class="empresa-save-button">\nGuardar cambios\n</button> <a href="/perfil/empresa/" class="empresa-cancel-button">\nCancelar\n</a> </div> </div> </form> </div> <script>\n    const fileInput = document.getElementById("logo-upload");\n    const preview = document.getElementById("logo-preview");\n    fileInput?.addEventListener("change", () => {\n      if (fileInput.files?.[0]) {\n        const reader = new FileReader();\n        reader.onload = (e) => (preview.src = e.target.result);\n        reader.readAsDataURL(fileInput.files[0]);\n      }\n    });\n  <\/script> <script type="module" src="/src/javascripts/EditarPerfilEmpresa"><\/script>  '])), renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default" }), maybeRenderHead(), addAttribute(empresa.idUsuario, "data-id"), addAttribute(empresa.imagen ? `${API_URL}/img/${empresa.imagen}` : `${API_URL}/images/imgEmpresa.png`, "src"), addAttribute(empresa.imagen, "value"), addAttribute(empresa.nombre, "value"), sectores.map((s) => renderTemplate`<option${addAttribute(s, "value")}${addAttribute(s === empresa.sectorEmpresarial, "selected")}> ${s} </option>`), addAttribute(empresa.nit, "value"), addAttribute(empresa.correo, "value"), addAttribute(empresa.telefono || "", "value"), addAttribute(empresa.sitioWeb || "", "value"), empresa.descripcion || ""), "footer": async ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}` })}`;
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/perfil/empresa/editar.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/perfil/empresa/editar.astro";
const $$url = "/perfil/empresa/editar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Editar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
