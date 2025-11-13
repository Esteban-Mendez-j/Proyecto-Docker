import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSendForm } from "../hooks/useFetch";
import useVisible from "../hooks/useVisible";
import { API_CLIENT_URL } from "../services/Api";
import { RoleContext } from "../services/RoleContext";
import "../style/invitado/header.css";
import { clearLocalStore } from "../services/localStore"
import BandejaNotificacion from "../components/BandejaNotificacion";

export default function Header () {

    const {rol} = useContext(RoleContext);
    const [urlImagen, setUrlImagen] = useState(null);
    const [handleOnClick, visible] = useVisible()
    const { data, send }  = useSendForm();
    useEffect(()=>{
        if(rol && rol != "ROLE_INVITADO"){
            send("/api/usuarios/datos", "GET");
        }
    }, [rol])
    
    useEffect(() => {
        if (!rol || !data) return;

        const imagenPorDefecto = rol === "CANDIDATO"
            ? "/images/imgCandidato.png"
            : "/images/imgEmpresa.png";

        setUrlImagen(
            data?.imagen
                ? `${API_CLIENT_URL}/img/${data.imagen}`
                : API_CLIENT_URL+ imagenPorDefecto
        );
    }, [data]);


    const linksByRole = {
        SUPER_ADMIN: [
            { name: "Inicio", path: "/admin/index" },
            { name: "Empleos", path: "/admin/vacantes" },
            { name: "Crear admins", path: "/404" },
            { name: "Usuarios", path: "/admin/usuarios" },
        ],
        ADMIN: [
            { name: "Inicio", path: "/admin/index" },
            { name: "Empleos", path: "/admin/vacantes" },
            { name: "Usuarios", path: "/admin/usuarios" },
        ],
        CANDIDATO: [
            { name: "Inicio", path: "/" },
            { name: "Chats", path: "/chat/candidato" },
            { name: "Empleos", path: "/empleos" },
            { name: "Postulaciones", path: "/postulaciones" },
            { name: "Favoritos", path: "/vacantes/favoritas" },
        ],
        EMPRESA: [
            { name: "Inicio", path: "/" },
            { name: "Mis Vacantes", path: "/empresa/listado/vacantes" },
            { name: "Publicar oferta", path: "/empresa/vacantes" },
            { name: "Chats", path: "/chat/empresa" },
            { name: "Perfil", path: "/perfil/empresa" },
        ],
        ROLE_INVITADO: [
            { name: "Inicio", path: "/" },
            { name: "Empleos", path: "/empleos" },
            { name: "Iniciar Sesión", path: "/login" },
            { name: "Registrarse", path: "/registro", className: "register-btn" },
        ],
    };

    if (!rol) return null;

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
                    className="md:hidden z-10 bg-transparent border-none cursor-pointer text-text hover:text-primary transition-transform duration-300 hover:rotate-90"
                    aria-label={visible ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={visible ? true : false}
                    onClick={handleOnClick}
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
                
                <nav className={`nav ${visible ? "nav-open" : ""}`}>
                    {linksByRole[rol].map((link) => (
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? "selected-link" : "nav-link"
                            }
                            key={link.path}
                            to={link.path}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                    
                    {rol !== "ROLE_INVITADO" &&
                        <button className="nav-link"
                            onClick={() => {
                                clearLocalStore()
                                window.location.href = `${API_CLIENT_URL}/usuarios/cerrarSesion`;
                            }}>
                            Cerrar Sesion
                        </button>
                    }
                    {/* {rol == "CANDIDATO" && <Notificaciones />} // jesus */}
                    {["CANDIDATO", "EMPRESA"].includes(rol) && <BandejaNotificacion/>}
                    {["CANDIDATO", "EMPRESA"].includes(rol) &&
                        <Link to={"/perfil/"+ rol.toLowerCase()} className="perfil-link">
                            <picture className="perfil-header">
                                <img
                                    src={urlImagen}
                                    className="foto-perfil"
                                    alt="foto de perfil"
                                />
                                <p className="nombre-perfil">{data?.nombre}</p>
                            </picture>
                        </Link>
                    }
                </nav>
            </div>
        </header>
    );
}
