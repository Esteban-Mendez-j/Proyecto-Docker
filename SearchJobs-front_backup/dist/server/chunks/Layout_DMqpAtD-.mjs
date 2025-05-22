import { e as createAstro, f as createComponent, h as addAttribute, ad as renderScript, ae as renderHead, af as renderSlot, r as renderTemplate } from './astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                            */

const $$Astro = createAstro("https://searchjobs.com/");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "SearchJobs | Encuentra empleo o talento",
    description = "Plataforma intuitiva y moderna para conectar empresas con talentos"
  } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="theme-color" content="#4f46e5"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="description"${addAttribute(description, "content")}><title>${title}</title><!-- <ClientRouter/> --><!-- Fuentes --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">${renderScript($$result, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")}${renderHead()}</head> <body> ${renderSlot($$result, $$slots["header"])} <main> ${renderSlot($$result, $$slots["default"])} </main> ${renderSlot($$result, $$slots["footer"])} </body></html>`;
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
