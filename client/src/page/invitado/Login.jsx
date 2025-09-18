import Layout from "../../layouts/layout"
import "../../style/invitado/login.css"
import {useContext, useEffect, useState } from "react"
import { autenticacion } from "../../services/autenticacion.js"
import { Link, useNavigate } from 'react-router-dom';
import { RoleContext } from "../../services/RoleContext.jsx";
import useVisible from "../../hooks/useVisible.jsx";

export default function Login (){
    const [error , setError] = useState(null)
    const [data , setData] = useState(null)
    const {rol , setRol} = useContext(RoleContext)
    const [loading , setLoading] = useState(false)
    const [handleClick, visible] = useVisible();
    let navigate = useNavigate();


    useEffect(()=>{
        switch (rol) {
            case "CANDIDATO":
                navigate("/", {replace:true})
                break;
            case "EMPRESA":
                navigate("/", {replace:true})
                break;
            case "ADMIN" || "SUPER_ADMIN":
                navigate("/admin/index", {replace:true})
                break;
            default:
                break;
        }
        return;
    },[rol])
    
    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");

        if (!username || !password){
            return setError("Faltan Credenciales");
        }

        setLoading(true); 
        const { data, error } = await autenticacion(username, password);

        if (error) {
            setError(error);
            setLoading(false);
            return;
        }

        setError(null);
        setLoading(false);
        e.target.reset();
        setRol(data.rolPrincipal)
        setData(data)
    }


    return(
        <Layout>
            <div className="container">
                <div className="login-container">
                    <div className="login-header">
                        <h1 className="login-title">Inicio Sesión</h1>
                        <p className="subtitle">Accede a tu cuenta para continuar</p>
                    </div>

                    {error && 
                        <div id="ErrorElement" className="error-box" >
                            <strong>¡Error!</strong> <span id="ErrorMessage">{error}</span>
                        </div> 
                    }
                     
                    <form className="form" id="loginForm" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="identifier" id="identifierLabel">Correo electrónico</label>
                            <input 
                                type="email"
                                id="identifier"
                                name="username"
                                className="form-control"
                                placeholder="ejemplo@correo.com"
                                autoComplete="username"
                                required
                            />

                            <div className="form-group">
                                <label htmlFor="password">Contraseña</label>
                                <div className="password-input">
                                    <input 
                                        type={visible? "text": "password"}
                                        id="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Tu contraseña"
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        id="passwordToggle"
                                        aria-label="Mostrar contraseña"
                                        onClick={handleClick}
                                    >
                                        {
                                            visible ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                                
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                                </svg>
                                            )
                                        }
                                    </button>                          
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary submit-button">
                                Iniciar Sesión
                            </button>

                            <div className="register-container">
                                <p>
                                    ¿No tienes una cuenta?{" "}
                                    <Link to="/registro" className="register-link">
                                        Regístrate
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}