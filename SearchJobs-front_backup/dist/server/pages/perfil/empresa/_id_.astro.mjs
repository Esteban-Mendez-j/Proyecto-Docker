import { e as createAstro, f as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { m as manejarRespuesta, $ as $$Footer, H as Header } from '../../../chunks/Footer_BR33Q6Xf.mjs';
import { $ as $$Layout } from '../../../chunks/Layout_DMqpAtD-.mjs';
/* empty css                                      */
import { A as API_URL } from '../../../chunks/Api_4ZQkpW66.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://searchjobs.com/");
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const apiUrl = `${API_URL}/api/empresas/perfil?idUsuario=${id}`;
  const res = await fetch(apiUrl, {
    headers: Astro2.request.headers
  });
  const data = await manejarRespuesta(res);
  const empresa = data.empresa || {};
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${empresa.nombre} | SearchJobs` }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default" })} ${maybeRenderHead()}<div class="empresa-perfil-container"> <div class="empresa-perfil"> <!-- Cabecera del perfil --> <div class="empresa-perfil-header"> <!-- Logo de la empresa --> <div class="empresa-logo-container"> <img${addAttribute(empresa.imagen ? `${API_URL}/img/` + empresa.imagen : `${API_URL}/images/imgEmpresa.png`, "src")}${addAttribute(empresa.nombre, "alt")} class="empresa-logo"> </div> <!-- Información del encabezado --> <div class="empresa-header-info"> <h1 class="empresa-nombre">${empresa.nombre}</h1> <p class="empresa-sector">${empresa.sectorEmpresarial}</p> </div> </div> <!-- Contenido del perfil --> <div class="empresa-perfil-content"> <!-- Información de contacto --> <div class="empresa-info-grid"> <div class="empresa-info-item"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect> <line x1="16" y1="2" x2="16" y2="6"></line> <line x1="8" y1="2" x2="8" y2="6"></line> <line x1="3" y1="10" x2="21" y2="10"></line> </svg> <div class="empresa-info-content"> <span class="empresa-info-label">NIT</span> <span class="empresa-info-value">${empresa.nit}</span> </div> </div> <div class="empresa-info-item"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path> <polyline points="22,6 12,13 2,6"></polyline> </svg> <div class="empresa-info-content"> <span class="empresa-info-label">Correo</span> <span class="empresa-info-value">${empresa.correo}</span> </div> </div> <div class="empresa-info-item"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path> </svg> <div class="empresa-info-content"> <span class="empresa-info-label">Teléfono</span> <span class="empresa-info-value">${empresa.telefono || "No registrado"}</span> </div> </div> <div class="empresa-info-item"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <circle cx="12" cy="12" r="10"></circle> <line x1="2" y1="12" x2="22" y2="12"></line> <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path> </svg> <div class="empresa-info-content"> <span class="empresa-info-label">Sitio Web</span> <a${addAttribute(`https://${empresa.sitioWeb}`, "href")} target="_blank" rel="noopener noreferrer" class="empresa-info-link">${empresa.sitioWeb}</a> </div> </div> </div> <!-- Sección de descripción --> <div class="empresa-descripcion-section"> <h2 class="empresa-section-title">Descripción</h2> <p class="empresa-descripcion"> ${empresa.descripcion || "No registrada"} </p> </div> </div> </div> </div>  `, "footer": async ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}` })}`;
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/perfil/empresa/[id].astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/perfil/empresa/[id].astro";
const $$url = "/perfil/empresa/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
