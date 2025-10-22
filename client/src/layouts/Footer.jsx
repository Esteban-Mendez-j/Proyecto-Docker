import { Link } from "react-router-dom";
import "../style/invitado/footer.css"

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (

        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="column">
                        <h3 className="title">SearchJobs</h3>
                        <p className="description">Plataforma intuitiva y moderna para conectar empresas con talentos.</p>
                    </div>

                    <div className="column">
                        <h4 className="column-title">Candidatos</h4>
                        <Link to="/empleos" className="link">
                            Buscar empleos
                        </Link>
                        <Link to="/postulaciones" className="link">
                            Postulaciones
                        </Link>
                        <Link to="/registro/candidato" className="link">
                            Registrarse
                        </Link>
                    </div>

                    <div className="column">
                        <h4 className="column-title">Empresas</h4>
                        <Link to="/empresa/vacantes" className="link">
                            Publicar vacante
                        </Link>
                        <Link to="/empresa/listado/vacantes" className="link">
                            Vacantes Publicadas
                        </Link>
                        <Link to="/registro/empresa" className="link">
                            Registrarse
                        </Link>
                    </div>

                    <div className="column">
                        <h4 className="column-title">Contacto</h4>
                        <a href="mailto:info@searchjobs.com" className="link">
                            info@searchjobs.com
                        </a>
                        <a href="tel:+3116244567" className="link">
                            +57 311 624 4567
                        </a>
                    </div>
                </div>

                <div className="bottom">
                    <p className="copyright">© {currentYear} SearchJobs. Todos los derechos reservados.</p>
                    <div className="links">
                        <Link to="/terminos" className="bottom-link">
                            Términos y condiciones
                        </Link>
                        <Link to="/privacidad" className="bottom-link">
                            Política de privacidad
                        </Link>
                    </div>
                </div>
            </div>
        </footer>

    )
}