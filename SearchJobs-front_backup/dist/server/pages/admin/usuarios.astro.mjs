import { f as createComponent, r as renderTemplate, i as renderComponent, m as maybeRenderHead } from '../../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DMqpAtD-.mjs';
import { $ as $$Footer, H as Header } from '../../chunks/Footer_BR33Q6Xf.mjs';
import { $ as $$AdminSidebar } from '../../chunks/AdminSidebar_BiWNLNWi.mjs';
/* empty css                                       */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Usuarios = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", ` <script type="text/javascript">
  document.addEventListener('DOMContentLoaded', () => {
   
    const tabActivos = document.getElementById('tab-activos');
    const tabBaneados = document.getElementById('tab-baneados');
    const contentActivos = document.getElementById('content-activos');
    const contentBaneados = document.getElementById('content-baneados');
    
    tabActivos.addEventListener('click', () => {
      tabActivos.classList.add('active', 'border-blue-600', 'text-blue-600');
      tabActivos.classList.remove('border-transparent', 'text-gray-500');
      tabBaneados.classList.remove('active', 'border-blue-600', 'text-blue-600');
      tabBaneados.classList.add('border-transparent', 'text-gray-500');
      
      contentActivos.classList.remove('hidden');
      contentBaneados.classList.add('hidden');
    });
    
    tabBaneados.addEventListener('click', () => {
      tabBaneados.classList.add('active', 'border-blue-600', 'text-blue-600');
      tabBaneados.classList.remove('border-transparent', 'text-gray-500');
      tabActivos.classList.remove('active', 'border-blue-600', 'text-blue-600');
      tabActivos.classList.add('border-transparent', 'text-gray-500');
      
      contentBaneados.classList.remove('hidden');
      contentActivos.classList.add('hidden');
    });
    
    // Modal para banear usuario
    const modalBanear = document.getElementById('modal-banear');
    const usuarioBanearNombre = document.getElementById('usuario-nombre-banear');
    const cancelarBanear = document.getElementById('cancelar-banear');
    const confirmarBanear = document.getElementById('confirmar-banear');
    const banearBtns = document.querySelectorAll('.banear-btn');
    
    banearBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const nombre = btn.getAttribute('data-nombre');
        
        usuarioBanearNombre.textContent = nombre;
        modalBanear.classList.remove('hidden');
      });
    });
    
    cancelarBanear.addEventListener('click', () => {
      modalBanear.classList.add('hidden');
    });
    
    confirmarBanear.addEventListener('click', () => {
      // La l\xF3gica para usuario
      Swal.fire({ text: 'Usuario baneado correctamente', icon: 'success' });      modalBanear.classList.add('hidden');
    });
    
    // Modal para desbanear usuario
    const modalDesbanear = document.getElementById('modal-desbanear');
    const usuarioDesbanearNombre = document.getElementById('usuario-nombre-desbanear');
    const cancelarDesbanear = document.getElementById('cancelar-desbanear');
    const confirmarDesbanear = document.getElementById('confirmar-desbanear');
    const desbanearBtns = document.querySelectorAll('.desbanear-btn');
    
    desbanearBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const nombre = btn.getAttribute('data-nombre');
        
        usuarioDesbanearNombre.textContent = nombre;
        modalDesbanear.classList.remove('hidden');
      });
    });
    
    cancelarDesbanear.addEventListener('click', () => {
      modalDesbanear.classList.add('hidden');
    });
    
    confirmarDesbanear.addEventListener('click', () => {
      // La l\xF3gica para desbanear al usuario
      Swal.fire({ text: 'Usuario desbaneado correctamente', icon: 'success' });      modalDesbanear.classList.add('hidden');
    });
  });
<\/script> `])), renderComponent($$result, "Layout", $$Layout, { "title": "Gesti\xF3n de Usuarios | SearchJobs", "lang": "es", "data-astro-cid-jbpjf64y": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default", "data-astro-cid-jbpjf64y": true })}${maybeRenderHead()}<br data-astro-cid-jbpjf64y> <div class="container px-4 py-6 mx-auto" data-astro-cid-jbpjf64y> <div class="flex flex-col gap-6 md:flex-row" data-astro-cid-jbpjf64y> ${renderComponent($$result2, "AdminSidebar", $$AdminSidebar, { "activeItem": "usuarioas", "data-astro-cid-jbpjf64y": true })} <!-- <div class="flex-1">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold">Gestión de Usuarios</h1>
          
          <div class="flex gap-2">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Buscar usuarios..." 
                class="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            
            <select class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todos los tipos</option>
              <option value="candidato">Candidatos</option>
              <option value="empresa">Empresas</option>
            </select>
          </div>
        </div> --> ${renderComponent($$result2, "UsuariosActivos", null, { "client:only": true, "client:component-hydration": "only", "data-astro-cid-jbpjf64y": true, "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/UsuariosActivos.jsx", "client:component-export": "default" })} <tr data-astro-cid-jbpjf64y> <title>Usuarios activos</title> <!-- <UsuariosBaneados client:only />
                    <tr>
                      <html lang="es">
                          <head>
                            <title>Usuarios Baneados</title>
                 --> </tr> </div> </div>   `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer", "data-astro-cid-jbpjf64y": true })}` }));
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/admin/usuarios.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/admin/usuarios.astro";
const $$url = "/admin/usuarios";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Usuarios,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
