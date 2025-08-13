import Layout from "../../layouts/layout"
import "../../style/invitado/login.css"

export default function Login (){

    return(
        <Layout>
            <div className="container">
                <div className="login-container">
                    <div className="login-header">
                        <h1 className="title">Inicio Sesión</h1>
                        <p className="subtitle">Accede a tu cuenta para continuar</p>
                    </div>
                    <div id="ErrorElement" className="error-box hidden" >
                    <strong>¡Error!</strong> <span id="ErrorMessage"></span>
                    </div>  
                    <form className="form" id="loginForm">
                        <div className="form-group">
                            <label for="identifier" id="identifierLabel">Correo electrónico</label>
                            <input 
                                type="email"
                                id="identifier"
                                name="username"
                                className="form-control"
                                placeholder="ejemplo@correo.com"
                                required
                            />

                            <div className="form-group">
                                <label for="password">Contraseña</label>
                                <div className="password-input">
                                    <input 
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Tu contraseña"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        id="passwordToggle"
                                        aria-label="Mostrar contraseña"
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    </button>                          
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary submit-button">
                                Iniciar Sesión
                            </button>

                            <div className="register-container">
                                <p>
                                    ¿No tienes una cuenta?{" "}
                                    <a href="/registro" className="register-link">
                                        Regístrate
                                    </a>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}