import { f as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DMqpAtD-.mjs';
import { $ as $$Footer, H as Header } from '../../chunks/Footer_BR33Q6Xf.mjs';
import { $ as $$AdminSidebar } from '../../chunks/AdminSidebar_BiWNLNWi.mjs';
export { renderers } from '../../renderers.mjs';

const $$Analisis = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "An\xE1lisis de Datos | SearchJobs" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default" })}${maybeRenderHead()}<br> <div class="container px-4 py-6 mx-auto"> <div class="flex flex-col gap-6 md:flex-row"> ${renderComponent($$result2, "AdminSidebar", $$AdminSidebar, { "activeItem": "reportes" })} <div class="flex-1"> <div class="flex items-center justify-between mb-6"> <h1 class="text-2xl font-bold">Análisis de Datos</h1> <div class="flex gap-2"> <select class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"> <option value="ultimos30dias">Últimos 30 días</option> <option value="ultimos90dias">Últimos 90 días</option> <option value="ultimoAno">Último año</option> <option value="personalizado">Personalizado</option> </select> <button class="flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path> <polyline points="7 10 12 15 17 10"></polyline> <line x1="12" y1="15" x2="12" y2="3"></line> </svg>
Exportar Datos
</button> </div> </div> <div class="p-6 mb-8 bg-white border border-gray-100 rounded-lg shadow-sm"> <h2 class="mb-4 text-xl font-semibold">Dashboard de Power BI</h2> <div class="flex items-center justify-center bg-gray-100 rounded-lg aspect-video"> <div class="p-6 text-center"> <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-400"> <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect> <line x1="8" y1="21" x2="16" y2="21"></line> <line x1="12" y1="17" x2="12" y2="21"></line> </svg> <h3 class="mb-2 text-lg font-medium">Dashboard de Power BI</h3> <p class="mb-4 text-gray-500">El dashboard de Power BI se cargará aquí cuando se configure la integración.</p> <button id="configurePowerBI" class="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
Configurar Integración
</button> </div> </div> </div> <div class="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2"> <div class="p-6 bg-white border border-gray-100 rounded-lg shadow-sm"> <h3 class="mb-4 text-lg font-semibold">Vacantes por Categoría</h3> <div class="flex items-center justify-center h-64 bg-gray-100 rounded-lg"> <p class="text-gray-500">Gráfico de vacantes por categoría</p> </div> </div> <div class="p-6 bg-white border border-gray-100 rounded-lg shadow-sm"> <h3 class="mb-4 text-lg font-semibold">Usuarios por Ubicación</h3> <div class="flex items-center justify-center h-64 bg-gray-100 rounded-lg"> <p class="text-gray-500">Mapa de usuarios por ubicación</p> </div> </div> <div class="p-6 bg-white border border-gray-100 rounded-lg shadow-sm"> <h3 class="mb-4 text-lg font-semibold">Postulaciones por Día</h3> <div class="flex items-center justify-center h-64 bg-gray-100 rounded-lg"> <p class="text-gray-500">Gráfico de postulaciones por día</p> </div> </div> <div class="p-6 bg-white border border-gray-100 rounded-lg shadow-sm"> <h3 class="mb-4 text-lg font-semibold">Empresas más Activas</h3> <div class="flex items-center justify-center h-64 bg-gray-100 rounded-lg"> <p class="text-gray-500">Gráfico de empresas más activas</p> </div> </div> </div> </div> </div> </div>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}` })}`;
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/admin/analisis.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/admin/analisis.astro";
const $$url = "/admin/analisis";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Analisis,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
