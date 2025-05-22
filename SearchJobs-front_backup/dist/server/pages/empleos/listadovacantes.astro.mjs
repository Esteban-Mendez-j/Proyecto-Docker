import { f as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$Footer, H as Header } from '../../chunks/Footer_BR33Q6Xf.mjs';
import { J as JobBoard } from '../../chunks/JobBoard_DqOyCXup.mjs';
import { $ as $$Layout } from '../../chunks/Layout_DMqpAtD-.mjs';
/* empty css                                       */
import { A as API_URL } from '../../chunks/Api_4ZQkpW66.mjs';
export { renderers } from '../../renderers.mjs';

const $$ListadoVacantes = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Empleos | SearchJobs" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header", "client:component-export": "default" })} ${maybeRenderHead()}<div class="container"> <div class="page-header"> <h1 class="page-title">Encuentra tu próximo empleo</h1> <p class="page-description">
Explora todas las oportunidades laborales disponibles
</p> </div> ${renderComponent($$result2, "JobBoard", JobBoard, { "client:load": true, "fetchUrl": `${API_URL}/api/vacantes/listar`, "rol": "empresa", "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/JobBoard", "client:component-export": "default" })} </div>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}` })}`;
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/empleos/listadoVacantes.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/empleos/listadoVacantes.astro";
const $$url = "/empleos/listadoVacantes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ListadoVacantes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
