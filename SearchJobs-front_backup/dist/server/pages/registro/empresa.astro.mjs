import { f as createComponent, r as renderTemplate, i as renderComponent, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DMqpAtD-.mjs';
import { $ as $$Footer, H as Header } from '../../chunks/Footer_BR33Q6Xf.mjs';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Empresa = createComponent(($$result, $$props, $$slots) => {
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
  return renderTemplate(_a || (_a = __template(["", ' <script type="module" src="/src/javascripts/RegistroEmpresa.js"><\/script> '])), renderComponent($$result, "Layout", $$Layout, { "title": "Registro de Empresa | SearchJobs", "data-astro-cid-axbuicym": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default", "data-astro-cid-axbuicym": true })} ${maybeRenderHead()}<div class="container" data-astro-cid-axbuicym> <div class="registro-container" data-astro-cid-axbuicym> <h1 class="title" data-astro-cid-axbuicym>Crea tu cuenta de empresa</h1> <p class="subtitle" data-astro-cid-axbuicym>Completa el formulario para comenzar a publicar vacantes y encontrar talento</p> <form id="registroEmpresaForm" class="form" data-astro-cid-axbuicym> <!-- Paso 1: Informacion básica --> <div class="step-content active" id="step1" data-astro-cid-axbuicym> <div class="form-group" data-astro-cid-axbuicym> <label for="nombreEmpresa" data-astro-cid-axbuicym>Nombre de la empresa <span class="required" data-astro-cid-axbuicym>*</span></label> <input type="text" id="nombreEmpresa" name="nombre" class="form-control" placeholder="Nombre legal de la empresa" required data-astro-cid-axbuicym> <p class="error-text hidden" id="error-nombre" data-astro-cid-axbuicym></p> </div> <div class="form-row" data-astro-cid-axbuicym> <div class="form-group" data-astro-cid-axbuicym> <label for="nit" data-astro-cid-axbuicym>NIT / Identificación fiscal <span class="required" data-astro-cid-axbuicym>*</span></label> <input type="text" id="nit" name="nit" class="form-control" placeholder="Número de identificación tributaria" required data-astro-cid-axbuicym> <p class="error-text hidden" id="error-nit" data-astro-cid-axbuicym></p> </div> <div class="form-group" data-astro-cid-axbuicym> <label for="sectorEmpresa" data-astro-cid-axbuicym>Sector Empresa <span class="required" data-astro-cid-axbuicym>*</span></label> <select id="sectorEmpresa" name="sectorEmpresa" class="form-control" required data-astro-cid-axbuicym> <option value="" disabled selected data-astro-cid-axbuicym>Selecciona tu sector</option> ${sectores.map((sector) => renderTemplate`<option${addAttribute(sector, "value")} data-astro-cid-axbuicym>${sector}</option>`)} </select> </div> </div> <div class="form-group" data-astro-cid-axbuicym> <label for="emailEmpresa" data-astro-cid-axbuicym>Correo electrónico corporativo <span class="required" data-astro-cid-axbuicym>*</span></label> <input type="email" id="emailEmpresa" name="correo" class="form-control" placeholder="ejemplo@empresa.com" required data-astro-cid-axbuicym> <p class="form-hint" data-astro-cid-axbuicym>Usarás este correo para iniciar sesión</p> <p class="error-text hidden" id="error-correo" data-astro-cid-axbuicym></p> </div> <div class="form-group" data-astro-cid-axbuicym> <label for="telefonoEmpresa" data-astro-cid-axbuicym>Teléfono corporativo <span class="required" data-astro-cid-axbuicym>*</span></label> <input type="tel" id="telefonoEmpresa" name="telefono" class="form-control" placeholder="+57 601 123 4567" required data-astro-cid-axbuicym> <p class="error-text hidden" id="error-telefono" data-astro-cid-axbuicym></p> </div> <div class="form-row" data-astro-cid-axbuicym> <div class="form-group" data-astro-cid-axbuicym> <label for="passwordEmpresa" data-astro-cid-axbuicym>Contraseña <span class="required" data-astro-cid-axbuicym>*</span></label> <div class="password-input" data-astro-cid-axbuicym> <input type="password" id="passwordEmpresa" name="passwordEmpresa" class="form-control" placeholder="Crea una contraseña segura" required data-astro-cid-axbuicym> <button type="button" class="password-toggle" data-astro-cid-axbuicym> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-axbuicym> <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" data-astro-cid-axbuicym></path> <circle cx="12" cy="12" r="3" data-astro-cid-axbuicym></circle> </svg> </button> </div> </div> <div class="form-group" data-astro-cid-axbuicym> <label for="confirmPasswordEmpresa" data-astro-cid-axbuicym>Confirmar contraseña <span class="required" data-astro-cid-axbuicym>*</span></label> <div class="password-input" data-astro-cid-axbuicym> <input type="password" id="confirmPasswordEmpresa" name="confirmPasswordEmpresa" class="form-control" placeholder="Repite tu contraseña" required data-astro-cid-axbuicym> <button type="button" class="password-toggle" data-astro-cid-axbuicym> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-axbuicym> <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" data-astro-cid-axbuicym></path> <circle cx="12" cy="12" r="3" data-astro-cid-axbuicym></circle> </svg> </button> </div> </div> </div> <div class="password-requirements" data-astro-cid-axbuicym> <p class="requirements-title" data-astro-cid-axbuicym>La contraseña debe contener:</p> <ul data-astro-cid-axbuicym> <li id="req-length" data-astro-cid-axbuicym>Al menos 8 caracteres</li> <li id="req-uppercase" data-astro-cid-axbuicym>Al menos una letra mayúscula</li> <li id="req-lowercase" data-astro-cid-axbuicym>Al menos una letra minúscula</li> <li id="req-number" data-astro-cid-axbuicym>Al menos un número</li> <li id="req-match" data-astro-cid-axbuicym>Las contraseñas deben coincidir</li> </ul> </div> <div class="terms-container" data-astro-cid-axbuicym> <h3 data-astro-cid-axbuicym>Términos y condiciones</h3> <div class="terms-content" data-astro-cid-axbuicym> <p data-astro-cid-axbuicym>Al registrarte como empresa en SearchJobs, aceptas:</p> <ol data-astro-cid-axbuicym> <li data-astro-cid-axbuicym>1. Publicar exclusivamente ofertas laborales verificables, vigentes y auténticas.</li> <li data-astro-cid-axbuicym>2. Mantener información precisa, completa y actualizada en tu perfil empresarial y publicaciones.</li> <li data-astro-cid-axbuicym>3. Cumplir con las leyes laborales, de privacidad y contratación de tu país o región.</li> <li data-astro-cid-axbuicym>4. Evitar cualquier contenido ofensivo, fraudulento o discriminatorio.</li> <li data-astro-cid-axbuicym>5. Usar los datos personales de los candidatos únicamente con fines legítimos de selección.</li> <li data-astro-cid-axbuicym>6. Abstenerse de realizar actividades fraudulentas como suplantación o phishing.</li> <li data-astro-cid-axbuicym>7. Aceptar que SearchJobs puede revisar, suspender o eliminar publicaciones que incumplan estas
</li></ol> </div> </div> <div class="checkbox-group" data-astro-cid-axbuicym> <input type="checkbox" id="aceptoTerminos" required data-astro-cid-axbuicym> <label for="aceptoTerminos" data-astro-cid-axbuicym>Acepto los términos y condiciones <span class="required" data-astro-cid-axbuicym>*</span></label> </div> <div class="step-buttons" data-astro-cid-axbuicym> <button type="button" class="btn btn-outline" id="btnCancelar" data-astro-cid-axbuicym>Cancelar</button> <button type="submit" class="btn btn-primary" data-astro-cid-axbuicym>Completar registro</button> </div> </div> </form> <div class="login-container" data-astro-cid-axbuicym> <p data-astro-cid-axbuicym>¿Ya tienes una cuenta? <a href="/login" class="login-link" data-astro-cid-axbuicym>Iniciar sesión</a></p> </div> </div> </div>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer", "data-astro-cid-axbuicym": true })}` }));
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/registro/empresa.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/registro/empresa.astro";
const $$url = "/registro/empresa";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Empresa,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
