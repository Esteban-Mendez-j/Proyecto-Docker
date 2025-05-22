import { f as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$AdminSidebar } from '../chunks/AdminSidebar_BiWNLNWi.mjs';
import { $ as $$Footer, H as Header } from '../chunks/Footer_BR33Q6Xf.mjs';
import { $ as $$Layout } from '../chunks/Layout_DMqpAtD-.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Panel de Administrador | SearchJobs" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default" })}${maybeRenderHead()}<br> <div class="container px-4 py-6 mx-auto mt-12"> <div class="flex flex-col gap-6 md:flex-row"> ${renderComponent($$result2, "AdminSidebar", $$AdminSidebar, { "activeItem": "dashboard" })} <div class="flex-1"> <h1 class="mb-6 text-2xl font-bold">Panel de Administrador</h1> <div class="p-6 mb-8 bg-white border border-gray-200 rounded-2xl shadow-md"> <h2 class="mb-6 text-2xl font-bold text-gray-800">📊 Análisis de Datos</h2> <div class="relative w-full overflow-hidden rounded-xl shadow-inner aspect-video bg-gray-200 hover:shadow-lg transition-shadow"> <iframe title="Dashboard Power BI" class="w-full h-full border-0 rounded-xl" src="https://app.powerbi.com/view?r=eyJrIjoiNzdhMWQzZmItOWNlZC00ZTY4LWE3YzItMWNiNDI4Y2IyOGM5IiwidCI6IjlkMTJiZjNmLWU0ZjYtNDdhYi05MTJmLTFhMmYwZmM0OGFhNCIsImMiOjR9" allowfullscreen></iframe> </div> </div> </div> </div> </div>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}` })}`;
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/admin/index.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
