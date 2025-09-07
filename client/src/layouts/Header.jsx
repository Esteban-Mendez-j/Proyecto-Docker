import { useContext } from "react";
import "../style/invitado/header.css"
import { RoleContext} from "../services/RoleContext";
import {NavLink} from "react-router-dom";

export default function Header () {

    const {rol, setRol} = useContext(RoleContext)

    const linksByRole = {
        SUPER_ADMIN: [
            { name: "Inicio", path: "/dashboard/admin" },
            { name: "Empleos", path: "/admin/vacantes" },
            { name: "Crear admins", path: "/404" },
            { name: "Usuarios", path: "/admin/usuarios" }
        ],
        ADMIN: [
            { name: "Inicio", path: "/admin" },
            { name: "Empleos", path: "/admin/vacantes" },
            { name: "Usuarios", path: "/admin/usuarios" }
        ],
        CANDIDATO: [
            { name: "Inicio", path: "/dashboard/candidato" },
            { name: "Chats", path: "/chat/candidato" },
            { name: "Empleos", path: "/empleos" },
            { name: "Postulaciones", path: "/postulados" },
            { name: "Perfil", path: "/perfil/candidato" }
        ],
        EMPRESA: [
            { name: "Inicio", path: "/dashboard/empresa" },
            { name: "Mis Vacantes", path: "/empleos/listadoVacantes" },
            { name: "Publicar oferta", path: "/empleos/Vacantes" },
            { name: "Chats", path: "/chat/empresa" },
            { name: "Perfil", path: "/perfil/empresa" }
        ],
        ROLE_INVITADO: [
            { name: "Inicio", path: "/" },
            { name: "Empleos", path: "/empleos" },
            { name: "Iniciar Sesión", path: "/login" },
            { name: "Registrarse", path: "/registro", className: "register-btn" }
        ]
    };


    return (
        <header className="header">
            <div className="container">
                <a className="flex items-center">
                    <div className="text-2xl font-extrabold">
                        <span className="bg-gradient-primary bg-clip-text text-transparent">
                            SearchJobs
                        </span>
                    </div>
                </a>

                <button
                    id="menuToggle"
                    className="md:hidden bg-transparent border-none cursor-pointer text-text hover:text-primary transition-transform duration-300 hover:rotate-90"
                    aria-label="Abrir menú"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    >
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button> 

                <nav className="nav" id="mainNav">
                    {/*userRole*/}
                    {linksByRole[rol].map(link => (
                        <NavLink className={({isActive}) => isActive? "selected-link": "nav-link"} key={link.path} to={link.path}>
                            {link.name}
                        </NavLink>
                    ))}
                    <label className="nav-link register-btn">{rol}</label>
                </nav>
            </div>
        </header>
    );
    
}