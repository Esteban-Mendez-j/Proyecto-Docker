import { f as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DMqpAtD-.mjs';
import { $ as $$Footer, H as Header } from '../chunks/Footer_BR33Q6Xf.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Registro | SearchJobs" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default" })} ${maybeRenderHead()}<div class="container"> <div class="registro-container"> <h1 class="title">Elige tu tipo de cuenta</h1> <p class="subtitle">Selecciona el tipo de cuenta que deseas crear para comenzar</p> <div class="options-container"> <a href="/registro/candidato" class="option"> <div class="option-content"> <h2 class="option-title">Candidato</h2> <p class="option-description">
Crea un perfil profesional, postúlate a empleos y conecta con empresas.
</p> <ul class="option-features"> <li>Busca empleos y voluntariados</li> <li>Crea un perfil profesional</li> <li>Postúlate con un solo clic</li> <li>Chatea con empresas</li> </ul> <span class="option-cta">Registrarse como candidato</span> </div> </a> <a href="/registro/empresa" class="option"> <div class="option-content"> <h2 class="option-title">Empresa</h2> <p class="option-description">
Publica vacantes, encuentra talento y gestiona tus procesos de selección.
</p> <ul class="option-features"> <li>Publica empleos y voluntariados</li> <li>Encuentra talento calificado</li> <li>Gestiona postulaciones</li> <li>Chatea con candidatos</li> </ul> <span class="option-cta">Registrarse como empresa</span> </div> </a> </div> <div class="login-container"> <p>
¿Ya tienes una cuenta?${" "} <a href="/login" class="login-link">
Iniciar sesión
</a> </p> </div> </div> </div>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}` })}`;
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/registro/index.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/registro/index.astro";
const $$url = "/registro";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
