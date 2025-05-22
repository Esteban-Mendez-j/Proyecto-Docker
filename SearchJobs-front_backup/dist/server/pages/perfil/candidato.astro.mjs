import { e as createAstro, f as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { m as manejarRespuesta, $ as $$Footer, H as Header } from '../../chunks/Footer_BR33Q6Xf.mjs';
import { $ as $$Layout } from '../../chunks/Layout_DMqpAtD-.mjs';
/* empty css                                   */
import { A as API_URL } from '../../chunks/Api_4ZQkpW66.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://searchjobs.com/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const res = await fetch(`${API_URL}/api/candidatos/perfil`, {
    headers: Astro2.request.headers
  });
  const data = await manejarRespuesta(res);
  const candidato = data.candidato;
  const estudios = data.estudios;
  const historialLaboral = data.historialLaboral;
  console.log(candidato);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default" })} ${maybeRenderHead()}<div class="candidato-perfil-container"> <div class="candidato-perfil"> <!-- Cabecera del perfil --> <div class="candidato-perfil-header"> <!-- Imagen de perfil --> <div class="candidato-imagen-container"> <img${addAttribute(candidato.imagen ? `${API_URL}/img/${candidato.imagen}` : `${API_URL}/images/imgCandidato.png`, "src")}${addAttribute(`${candidato.nombre} ${candidato.apellido}`, "alt")} class="h-32 w-32 object-cover shadow"> </div> <!-- Información del encabezado --> <div class="candidato-header-info"> <h1 class="candidato-nombre"> ${candidato.nombre} ${candidato.apellido} </h1> <p class="candidato-cargo"> ${candidato.experiencia ? `${candidato.experiencia} a\xF1os laborando` : ""} </p> </div> <!-- Botones de acción --> <div class="candidato-header-actions"> <a href="/perfil/candidato/editar" id="editProfileBtn" class="candidato-edit-button"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path> <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path> </svg>
Editar perfil
</a> <a${addAttribute(candidato.curriculo ? `${API_URL}/pdf/${candidato.curriculo}` : "#", "href")}${addAttribute("candidato-cv-button " + (!candidato.curriculo ? "pointer-events-none opacity-50" : ""), "class")} target="_blank" rel="noopener noreferrer"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path> <polyline points="7 10 12 15 17 10"></polyline> <line x1="12" y1="15" x2="12" y2="3"></line> </svg>
Ver CV
</a> </div> </div> <!-- Contenido del perfil --> <div class="candidato-perfil-content"> <!-- Información de contacto --> <div class="candidato-info-grid"> <div class="candidato-info-item"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path> <polyline points="22,6 12,13 2,6"></polyline> </svg> <div class="candidato-info-content"> <span class="candidato-info-label">Correo</span> <span class="candidato-info-value">${candidato.correo}</span> </div> </div> <div class="candidato-info-item"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path> </svg> <div class="candidato-info-content"> <span class="candidato-info-label">Teléfono</span> <span class="candidato-info-value">${candidato.telefono}</span> </div> </div> </div> <!-- Sección de descripción --> <div class="candidato-section"> <h2 class="candidato-section-title">Descripción</h2> <p class="candidato-descripcion"> ${candidato.descripcion} </p> </div> <!-- Sección de Estudios --> <section class="mb-6 pb-6 border-b border-[var(--border)]"> <h2 class="text-[1.125rem] font-semibold text-[var(--text)] mb-4 pl-4 relative flex items-center"> <span class="absolute left-0 top-1 h-4/5 w-1 bg-[var(--gradient-primary)] rounded"></span>
Estudios
</h2> <div class="space-y-6 mt-4"> ${estudios.map((estudio) => renderTemplate`<div class="relative pl-6 border-l-2 border-[var(--border)] pb-4"> <div class="absolute -left-[0.4rem] top-0 w-3 h-3 bg-[var(--primary)] rounded-full border-2 border-white"></div> <h3 class="text-base font-semibold text-[var(--text)]"> ${estudio.titulo} </h3> <p class="text-sm text-[var(--primary)]"> ${estudio.academia} </p> </div>`)} </div> </section> <!-- Sección de Historial Laboral --> <section> <h2 class="text-[1.125rem] font-semibold text-[var(--text)] mb-4 pl-4 relative flex items-center"> <span class="absolute left-0 top-1 h-4/5 w-1 bg-[var(--gradient-primary)] rounded"></span>
Historial Laboral
</h2> <div class="space-y-6 mt-4"> ${historialLaboral.map((exp) => renderTemplate`<div class="relative pl-6 border-l-2 border-[var(--border)] pb-4"> <div class="absolute -left-[0.4rem] top-0 w-3 h-3 bg-[var(--primary)] rounded-full border-2 border-white"></div> <h3 class="text-base font-semibold text-[var(--text)]"> ${exp.titulo} </h3> <p class="text-sm text-[var(--primary)]">${exp.empresa}</p> </div>`)} </div> </section> </div> </div> </div>  `, "footer": async ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}` })}`;
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/perfil/candidato/index.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/perfil/candidato/index.astro";
const $$url = "/perfil/candidato";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
