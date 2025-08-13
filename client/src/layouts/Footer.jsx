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
                        <a href="/empleos" className="link">
                            Buscar empleos
                        </a>
                        <a href="/voluntariados" className="link">
                            Voluntariados
                        </a>
                        <a href="/registro/candidato" className="link">
                            Registrarse
                        </a>
                        <a href="/login" className="link">
                            Iniciar sesión
                        </a>
                    </div>

                    <div className="column">
                        <h4 className="column-title">Empresas</h4>
                        <a href="/publicar-vacante" className="link">
                            Publicar vacante
                        </a>
                        <a href="/buscar-talento" className="link">
                            Buscar talento
                        </a>
                        <a href="/registro/empresa" className="link">
                            Registrarse
                        </a>
                        <a href="/login" className="link">
                            Iniciar sesión
                        </a>
                    </div>

                    <div className="column">
                        <h4 className="column-title">Contacto</h4>
                        <a href="mailto:info@searchjobs.com" className="link">
                            info@searchjobs.com
                        </a>
                        <a href="tel:+123456789" className="link">
                            +1 (234) 567-89
                        </a>
                    </div>
                </div>

                <div className="bottom">
                    <p className="copyright">© {currentYear} SearchJobs. Todos los derechos reservados.</p>
                    <div className="links">
                        <a href="/terminos" className="bottom-link">
                            Términos y condiciones
                        </a>
                        <a href="/privacidad" className="bottom-link">
                            Política de privacidad
                        </a>
                    </div>
                </div>
            </div>
        </footer>

    )
}