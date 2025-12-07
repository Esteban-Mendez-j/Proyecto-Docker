import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import useVisible from "../../hooks/useVisible.jsx";
import { autenticacion } from "../../services/autenticacion.js";
import { RoleContext } from "../../services/RoleContext.jsx";
import Header from "../../layouts/Header.jsx"
import "../../style/invitado/login.css";
import ScrollTop from "../../components/ScrollTop.jsx";
import { clearLocalStore } from "../../services/localStore.js";
import { ListSvg } from "../../components/Icons.jsx";

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
            case "ADMIN":
                navigate("/admin/index", {replace:true})
                break;
            case "SUPER_ADMIN":
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
        clearLocalStore()
    }


    return(
        <>
        <Header/>
        <ScrollTop/>
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
                    
                <form className="login-form" id="loginForm" onSubmit={handleSubmit}>
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
                                            <ListSvg name={"ojo"} height={20} width={20} />
                                            
                                        ) : (
                                            <ListSvg name={"ojoTapado"} height={20} width={20} />
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
        </>
    )
}