import { f as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DMqpAtD-.mjs';
import { $ as $$Footer, H as Header } from '../chunks/Footer_BR33Q6Xf.mjs';
/* empty css                               */
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "P\xE1gina no encontrada | SearchJobs", "data-astro-cid-zetdm5md": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default", "data-astro-cid-zetdm5md": true })} ${maybeRenderHead()}<div class="container" data-astro-cid-zetdm5md> <div class="error-container" data-astro-cid-zetdm5md> <h1 class="error-code" data-astro-cid-zetdm5md>404</h1> <h2 class="error-title" data-astro-cid-zetdm5md>Página no encontrada</h2> <p class="error-message" data-astro-cid-zetdm5md>Lo sentimos, la página que estás buscando no existe o ha sido movida.</p> <div class="error-actions" data-astro-cid-zetdm5md> <a href="/" class="btn btn-primary" data-astro-cid-zetdm5md>Volver al inicio</a> <a href="/empleos" class="btn btn-outline" data-astro-cid-zetdm5md>Ver empleos</a> </div> </div> </div>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer", "data-astro-cid-zetdm5md": true })}` })} `;
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/404.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
