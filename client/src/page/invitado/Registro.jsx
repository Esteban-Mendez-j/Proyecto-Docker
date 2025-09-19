import "../../style/invitado/registro.css"
import Layout from "../../layouts/Layout"

export default function Registro() {

    return (
        <Layout>
            <div className="container">
                <div className="registro-container">
                    <h1 className="registro-title">Elige tu tipo de cuenta</h1>
                    <p className="subtitle">Selecciona el tipo de cuenta que deseas crear para comenzar</p>

                    <div className="options-container">
                        <a href="/registro/candidato" className="option">
                            <div className="option-content">
                                <h2 className="option-title">Candidato</h2>
                                <p className="option-description">
                                    Crea un perfil profesional, postúlate a empleos y conecta con empresas.
                                </p>
                                <ul className="option-features">
                                    <li>Busca empleos y voluntariados</li>
                                    <li>Crea un perfil profesional</li>
                                    <li>Postúlate con un solo clic</li>
                                    <li>Chatea con empresas</li>
                                </ul>
                                <span className="option-cta">Registrarse como candidato</span>
                            </div>
                        </a>

                        <a href="/registro/empresa" className="option">
                            <div className="option-content">
                                <h2 className="option-title">Empresa</h2>
                                <p className="option-description">
                                    Publica vacantes, encuentra talento y gestiona tus procesos de selección.
                                </p>
                                <ul className="option-features">
                                    <li>Publica empleos y voluntariados</li>
                                    <li>Encuentra talento calificado</li>
                                    <li>Gestiona postulaciones</li>
                                    <li>Chatea con candidatos</li>
                                </ul>
                                <span className="option-cta">Registrarse como empresa</span>
                            </div>
                        </a>
                    </div>

                    <div className="login-container">
                        <p>
                            ¿Ya tienes una cuenta?{" "}
                            <a href="/login" className="login-link">
                                Iniciar sesión
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}