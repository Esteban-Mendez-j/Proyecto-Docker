import { f as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DMqpAtD-.mjs';
import { m as manejarRespuesta, $ as $$Footer, H as Header } from '../../chunks/Footer_BR33Q6Xf.mjs';
import { $ as $$JobCard, a as $$FeatureCard } from '../../chunks/FeatureCard_DIJyJAbC.mjs';
/* empty css                                        */
import { A as API_URL } from '../../chunks/Api_4ZQkpW66.mjs';
export { renderers } from '../../renderers.mjs';

const $$Candidato = createComponent(async ($$result, $$props, $$slots) => {
  const res = await fetch(`${API_URL}/api/vacantes/Top/listar`);
  const data = await manejarRespuesta(res);
  const featuredJobs = data.vacantes;
  const features = [
    {
      icon: "search",
      title: "B\xFAsqueda Inteligente",
      description: "Encuentra el empleo perfecto con nuestros filtros avanzados y recomendaciones personalizadas."
    },
    {
      icon: "briefcase",
      title: "Publicaci\xF3n Sencilla",
      description: "Empresas pueden publicar vacantes en minutos con nuestro proceso simplificado."
    },
    {
      icon: "message-circle",
      title: "Chat en Tiempo Real",
      description: "Comun\xEDcate directamente con empresas o candidatos a trav\xE9s de nuestro chat integrado."
    },
    {
      icon: "user",
      title: "Perfiles Profesionales",
      description: "Crea un perfil atractivo para destacar tus habilidades y experiencia."
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "SearchJobs | Encuentra empleo" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default" })} ${maybeRenderHead()}<section class="hero"> <div class="container"> <div class="hero-content"> <h1 class="hero-title">Encuentra empleo o talento de forma fácil y profesional</h1> <p class="hero-subtitle">
Conectamos empresas con los mejores talentos a través de una plataforma intuitiva y moderna
</p> <div class="hero-cta"> <a href="/empleos" class="btn btn-primary">
Buscar empleo
</a> <a href="/postulados" class="btn btn-outline">
Ver Postulaciones
</a> </div> </div> </div> </section> <section class="section"> <div class="container"> <h2 class="section-title">Empleos Destacados</h2> <p class="section-subtitle">Descubre las mejores oportunidades laborales seleccionadas para ti</p> <div class="jobs-grid"> ${featuredJobs.map((job) => renderTemplate`${renderComponent($$result2, "JobCard", $$JobCard, { "job": job })}`)} </div> <div class="view-all-container"> <a href="/empleos" class="btn btn-secondary">
Ver todos los empleos
</a> </div> </div> </section> <section class="features-section section"> <div class="container"> <h2 class="section-title">¿Por qué elegir SearchJobs?</h2> <p class="section-subtitle">
Nuestra plataforma ofrece herramientas modernas para conectar talento y oportunidades
</p> <div class="features-grid"> ${features.map((feature) => renderTemplate`${renderComponent($$result2, "FeatureCard", $$FeatureCard, { "feature": feature })}`)} </div> </div> </section>  `, "footer": async ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}` })}`;
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/dashboard/candidato.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/dashboard/candidato.astro";
const $$url = "/dashboard/candidato";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Candidato,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
