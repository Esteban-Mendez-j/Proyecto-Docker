import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
/* empty css                            */
import { A as API_URL } from './Api_4ZQkpW66.mjs';
import Swal from 'sweetalert2';
import { f as createComponent, m as maybeRenderHead, r as renderTemplate } from './astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import 'clsx';

const manejarRespuesta = async (res) => {
  let data;
  try {
    try {
      data = await res.json();
    } catch (e) {
      data = {};
    }
    console.log(res.status);
    if (res.status === 401) {
      if (data.error === "TOKEN_EXPIRED") {
        await Swal.fire({ text: "Tu sesión ha expirado.", icon: 'error' });       
        window.location.href=`${API_URL}/usuarios/cerrarSesion`;
      } else {
        await Swal.fire({ text: "No estás autenticado.", icon: 'error' });      
      }
      window.location.href =`${API_URL}/usuarios/cerrarSesion`;

      // window.location.href = "/login";
      data= null;
      return;
    }

    if (res.status === 403) {
      await Swal.fire({ text: "no autorizado", icon: 'error' });
      window.location.href = "/404";
      return;
    }

    if (!res.ok) {
      await Swal.fire({ text: data.message || "Error desconocido", icon: 'error' });      return;
    }

    // Si todo va bien
    return data;

  } catch (error) {
    console.error("Error de red:", error);
    await Swal.fire({ text: "Ocurrió un error de red.", icon: 'error' });  }
};

const Header = () => {
  const [userRole, setUserRole] = useState("ROLE_INVITADO");
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch(`${API_URL}/api/usuarios/rol`, {
          credentials: "include"
        });
        const data = await manejarRespuesta(res);
        if (!data) {
          return;
        }
        setUserRole(data.rolPrincipal);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    fetchUserRole();
  }, []);
  function getRoleDisplayName(role) {
    switch (role) {
      case "SUPER_ADMIN":
        return "Super Administrador";
      case "ADMIN":
        return "Administrador";
      case "EMPRESA":
        return "Empresa";
      case "CANDIDATO":
        return "Candidato";
      case "ROLE_INVITADO":
        return "Invitado";
      default:
        return role ?? "";
    }
  }
  useEffect(() => {
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    if (menuToggle && mainNav) {
      const handleClick = () => {
        mainNav.classList.toggle("nav-open");
        const isOpen = mainNav.classList.contains("nav-open");
        menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
        menuToggle.innerHTML = isOpen ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      };
      menuToggle.addEventListener("click", handleClick);
      return () => menuToggle.removeEventListener("click", handleClick);
    }
  }, []);
  return /* @__PURE__ */ jsx("header", { className: "header", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsx("a", { href: "/", className: "flex items-center", children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-extrabold", children: /* @__PURE__ */ jsx("span", { className: "bg-gradient-primary bg-clip-text text-transparent", children: "SearchJobs" }) }) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        id: "menuToggle",
        className: "md:hidden bg-transparent border-none cursor-pointer text-text hover:text-primary transition-transform duration-300 hover:rotate-90",
        "aria-label": "Abrir menú",
        children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ jsx("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
          /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
          /* @__PURE__ */ jsx("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("nav", { className: "nav", id: "mainNav", children: [
      userRole === "SUPER_ADMIN" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("a", { href: "/admin", className: "nav-link", children: "Inicio" }),
        /* @__PURE__ */ jsx("a", { href: "/admin/vacantes", className: "nav-link", children: "Empleos" }),
        /* @__PURE__ */ jsx("a", { href: "/404", className: "nav-link", children: "Crear admins " }),
        /* @__PURE__ */ jsx("a", { href: "/admin/usuarios", className: "nav-link", children: "Usuarios" })
      ] }),
      userRole === "ADMIN" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("a", { href: "/admin", className: "nav-link", children: "Inicio" }),
        /* @__PURE__ */ jsx("a", { href: "/admin/vacantes", className: "nav-link", children: "Empleos" }),
        /* @__PURE__ */ jsx("a", { href: "/admin/usuarios", className: "nav-link", children: "Usuarios" })
      ] }),
      userRole === "CANDIDATO" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("a", { href: "/dashboard/candidato", className: "nav-link", children: "Inicio" }),
        /* @__PURE__ */ jsx("a", { href: `/chat/candidato`, className: "nav-link", children: "Chats" }),
        /* @__PURE__ */ jsx("a", { href: "/empleos", className: "nav-link", children: "Empleos" }),
        /* @__PURE__ */ jsx("a", { href: "/postulados", className: "nav-link", children: "Postulaciones" }),
        /* @__PURE__ */ jsx("a", { href: "/perfil/candidato", className: "nav-link", children: "Perfil" })
      ] }),
      userRole === "EMPRESA" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("a", { href: "/dashboard/empresa", className: "nav-link", children: "Inicio" }),
        /* @__PURE__ */ jsx("a", { href: "/empleos/listadoVacantes", className: "nav-link", children: "Mis Vacantes" }),
        /* @__PURE__ */ jsx("a", { href: "/empleos/Vacantes", className: "nav-link", children: "Publicar oferta" }),
        /* @__PURE__ */ jsx("a", { href: `/chat/empresa`, className: "nav-link", children: "Chats" }),
        /* @__PURE__ */ jsx("a", { href: "/perfil/empresa", className: "nav-link", children: "Perfil" })
      ] }),
      userRole && userRole !== "ROLE_INVITADO" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("a", { href: `${API_URL}/usuarios/cerrarSesion`, className: "nav-link register-btn", children: "Cerrar Sesión" }),
        /* @__PURE__ */ jsx("a", { className: "nav-link register-btn", children: getRoleDisplayName(userRole) })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("a", { href: "/", className: "nav-link", children: "Inicio" }),
        /* @__PURE__ */ jsx("a", { href: "/empleos", className: "nav-link", children: "Empleos" }),
        /* @__PURE__ */ jsx("a", { href: "/login", className: "nav-link", children: "Iniciar Sesión" }),
        /* @__PURE__ */ jsx("a", { href: "/registro", className: "nav-link register-btn", children: "Registrarse" }),
        /* @__PURE__ */ jsx("a", { className: "nav-link register-btn", children: getRoleDisplayName(userRole) })
      ] })
    ] })
  ] }) });
};

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="footer" data-astro-cid-sz7xmlte> <div class="container" data-astro-cid-sz7xmlte> <div class="grid" data-astro-cid-sz7xmlte> <div class="column" data-astro-cid-sz7xmlte> <h3 class="title" data-astro-cid-sz7xmlte>SearchJobs</h3> <p class="description" data-astro-cid-sz7xmlte>Plataforma intuitiva y moderna para conectar empresas con talentos.</p> </div> <div class="column" data-astro-cid-sz7xmlte> <h4 class="column-title" data-astro-cid-sz7xmlte>Candidatos</h4> <a href="/empleos" class="link" data-astro-cid-sz7xmlte>
Buscar empleos
</a> <a href="/voluntariados" class="link" data-astro-cid-sz7xmlte>
Voluntariados
</a> <a href="/registro/candidato" class="link" data-astro-cid-sz7xmlte>
Registrarse
</a> <a href="/login" class="link" data-astro-cid-sz7xmlte>
Iniciar sesión
</a> </div> <div class="column" data-astro-cid-sz7xmlte> <h4 class="column-title" data-astro-cid-sz7xmlte>Empresas</h4> <a href="/publicar-vacante" class="link" data-astro-cid-sz7xmlte>
Publicar vacante
</a> <a href="/buscar-talento" class="link" data-astro-cid-sz7xmlte>
Buscar talento
</a> <a href="/registro/empresa" class="link" data-astro-cid-sz7xmlte>
Registrarse
</a> <a href="/login" class="link" data-astro-cid-sz7xmlte>
Iniciar sesión
</a> </div> <div class="column" data-astro-cid-sz7xmlte> <h4 class="column-title" data-astro-cid-sz7xmlte>Contacto</h4> <a href="mailto:info@searchjobs.com" class="link" data-astro-cid-sz7xmlte>
info@searchjobs.com
</a> <a href="tel:+123456789" class="link" data-astro-cid-sz7xmlte>
+1 (234) 567-89
</a> </div> </div> <div class="bottom" data-astro-cid-sz7xmlte> <p class="copyright" data-astro-cid-sz7xmlte>© ${currentYear} SearchJobs. Todos los derechos reservados.</p> <div class="links" data-astro-cid-sz7xmlte> <a href="/terminos" class="bottom-link" data-astro-cid-sz7xmlte>
Términos y condiciones
</a> <a href="/privacidad" class="bottom-link" data-astro-cid-sz7xmlte>
Política de privacidad
</a> </div> </div> </div> </footer> `;
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Footer.astro", void 0);

export { $$Footer as $, Header as H, manejarRespuesta as m };
