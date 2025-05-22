import { f as createComponent, r as renderTemplate, i as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DMqpAtD-.mjs';
import { $ as $$Footer, H as Header } from '../chunks/Footer_BR33Q6Xf.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", ` <script type="module">
  import { API_URL } from '/src/javascripts/Api.js';
  document.addEventListener('DOMContentLoaded', () => {
    const passwordToggle = document.getElementById('passwordToggle');
    const password = document.getElementById('password');
    const form = document.getElementById("loginForm");
    
    if (passwordToggle && password) {
      passwordToggle.addEventListener('click', () => {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        
        if (type === 'text') {
          passwordToggle.innerHTML = \`
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          \`;
          passwordToggle.setAttribute('aria-label', 'Ocultar contrase\xF1a');
        } else {
          passwordToggle.innerHTML = \`
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          \`;
          passwordToggle.setAttribute('aria-label', 'Mostrar contrase\xF1a');
        }
      });
    }

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const target = e.target; 
      const formData = new FormData(target);
      const username = formData.get("username")?.toString() || "";
      const password = formData.get("password")?.toString() || "";
      const divError = document.getElementById("ErrorElement");
      const strongError = document.getElementById("ErrorMessage");

      try {
        console.log(\`\${API_URL}/api/usuarios/login\`)
        const response = await fetch(\`\${API_URL}/api/usuarios/login\`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: username,
            password: password,
          }),
          credentials: "include"
        });

        if (response.ok) {
          target.reset();
          divError.classList.add("hidden");
          const data = await response.json();
          const roles = data.roles;
          const rolPrincipal = data.rolPrincipal;
          console.log(rolPrincipal)
          if (rolPrincipal == "ADMIN" || rolPrincipal == "SUPER_ADMIN") {
            window.location.href = "/admin";
          } else if (rolPrincipal === "EMPRESA") {
            window.location.href = "/dashboard/empresa";
          } else {
            window.location.href = "/dashboard/candidato";
          }
        } else {
          const errorData = await response.json();  
          divError.classList.remove("hidden");
          strongError.textContent = errorData.mensaje;
        }
      } catch (err) {
        console.error("Error en login:", err);
        alert("Ocurri\xF3 un error al iniciar sesi\xF3n.");
      }
    });
  });
<\/script>`], ["", ` <script type="module">
  import { API_URL } from '/src/javascripts/Api.js';
  document.addEventListener('DOMContentLoaded', () => {
    const passwordToggle = document.getElementById('passwordToggle');
    const password = document.getElementById('password');
    const form = document.getElementById("loginForm");
    
    if (passwordToggle && password) {
      passwordToggle.addEventListener('click', () => {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        
        if (type === 'text') {
          passwordToggle.innerHTML = \\\`
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          \\\`;
          passwordToggle.setAttribute('aria-label', 'Ocultar contrase\xF1a');
        } else {
          passwordToggle.innerHTML = \\\`
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          \\\`;
          passwordToggle.setAttribute('aria-label', 'Mostrar contrase\xF1a');
        }
      });
    }

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const target = e.target; 
      const formData = new FormData(target);
      const username = formData.get("username")?.toString() || "";
      const password = formData.get("password")?.toString() || "";
      const divError = document.getElementById("ErrorElement");
      const strongError = document.getElementById("ErrorMessage");

      try {
        console.log(\\\`\\\${API_URL}/api/usuarios/login\\\`)
        const response = await fetch(\\\`\\\${API_URL}/api/usuarios/login\\\`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: username,
            password: password,
          }),
          credentials: "include"
        });

        if (response.ok) {
          target.reset();
          divError.classList.add("hidden");
          const data = await response.json();
          const roles = data.roles;
          const rolPrincipal = data.rolPrincipal;
          console.log(rolPrincipal)
          if (rolPrincipal == "ADMIN" || rolPrincipal == "SUPER_ADMIN") {
            window.location.href = "/admin";
          } else if (rolPrincipal === "EMPRESA") {
            window.location.href = "/dashboard/empresa";
          } else {
            window.location.href = "/dashboard/candidato";
          }
        } else {
          const errorData = await response.json();  
          divError.classList.remove("hidden");
          strongError.textContent = errorData.mensaje;
        }
      } catch (err) {
        console.error("Error en login:", err);
        alert("Ocurri\xF3 un error al iniciar sesi\xF3n.");
      }
    });
  });
<\/script>`])), renderComponent($$result, "Layout", $$Layout, { "title": "Iniciar Sesi\xF3n | SearchJobs" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default" })} ${maybeRenderHead()}<div class="container"> <div class="login-container"> <div class="login-header"> <h1 class="title">Inicio Sesión</h1> <p class="subtitle">Accede a tu cuenta para continuar</p> </div> <div id="ErrorElement" class="error-box hidden"> <strong>¡Error!</strong> <span id="ErrorMessage"></span> </div> <form class="form" id="loginForm"> <div class="form-group"> <label for="identifier" id="identifierLabel">Correo electrónico</label> <input type="email" id="identifier" name="username" class="form-control" placeholder="ejemplo@correo.com" required> <div class="form-group"> <label for="password">Contraseña</label> <div class="password-input"> <input type="password" id="password" name="password" class="form-control" placeholder="Tu contraseña" required> <button type="button" class="password-toggle" id="passwordToggle" aria-label="Mostrar contraseña"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path> <circle cx="12" cy="12" r="3"></circle> </svg> </button> </div> </div> <button type="submit" class="btn btn-primary submit-button">
Iniciar Sesión
</button> <div class="register-container"> <p>
¿No tienes una cuenta?${" "} <a href="/registro" class="register-link">
Regístrate
</a> </p> </div> </div> </form> </div> </div>  `, "footer": async ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}` }));
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/login.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
