import Layout from "../../layouts/layout";
import "../../style/invitado/registroEmpresa.css"
export default function RegistroEmpresa (){
    
    const sectores = [
        "Tecnologia de la Informacion (TI) / Software",
        "Salud y Medicina",
        "Educacion y Formacion",
        "Construccion e Infraestructura",
        "Manufactura e Industria",
        "Comercio y Ventas",
        "Logistica y Transporte",
        "Banca, Finanzas y Seguros",
        "Agroindustria y Agricultura",
        "Legal y Juridico",
        "Turismo, Hoteleria y Gastronomia",
        "Medios, Comunicacion y Publicidad",
        "Energia y Mineria",
        "Servicios Profesionales y Consultoria",
        "Arte, Cultura y Entretenimiento",
        "Bienes Raices e Inmobiliaria",
        "Ciencia e Investigacion",
        "Organizaciones sin Fines de Lucro y ONG",
        "Otros"
    ];

    return(
        <Layout>
            <div className="container">
                <div className="registro-container">
                    <h1 className="title">Crea tu cuenta de empresa</h1>
                    <p className="subtitle">Completa el formulario para comenzar a publicar vacantes y encontrar talento</p>

                    <form id="registroEmpresaForm" className="form">
                        <div className="step-content active" id="step1">
                            <div className="form-group">
                                <label for="nombreEmpresa">Nombre de la empresa <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="nombreEmpresa"
                                    name="nombre"
                                    className="form-control"
                                    placeholder="Nombre legal de la empresa"
                                    required
                                />
                                <p className="error-text hidden" id="error-nombre"></p>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label for="nit">NIT / Identificación fiscal <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        id="nit"
                                        name="nit"
                                        className="form-control"
                                        placeholder="Número de identificación tributaria"
                                        required
                                    />
                                    <p className="error-text hidden" id="error-nit"></p>
                                </div>
                                <div className="form-group">
                                    <label for="sectorEmpresa">Sector Empresa <span className="required">*</span></label>
                                    <select id="sectorEmpresa" name="sectorEmpresa" className="form-control" required>
                                        <option value="" disabled selected>Selecciona tu sector</option>
                                        {sectores.map((sector) => (
                                            <option value={sector}>{sector}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label for="emailEmpresa">Correo electrónico corporativo <span className="required">*</span></label>
                                <input
                                    type="email"
                                    id="emailEmpresa"
                                    name="correo"
                                    className="form-control"
                                    placeholder="ejemplo@empresa.com"
                                    required
                                />
                                <p className="form-hint">Usarás este correo para iniciar sesión</p>
                                <p className="error-text hidden" id="error-correo"></p>
                            </div>

                            <div className="form-group">
                                <label for="telefonoEmpresa">Teléfono corporativo <span className="required">*</span></label>
                                <input
                                    type="tel"
                                    id="telefonoEmpresa"
                                    name="telefono"
                                    className="form-control"
                                    placeholder="+57 601 123 4567"
                                    required
                                />
                                <p className="error-text hidden" id="error-telefono"></p>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label for="passwordEmpresa">Contraseña <span className="required">*</span></label>
                                    <div className="password-input">
                                        <input
                                            type="password"
                                            id="passwordEmpresa"
                                            name="passwordEmpresa"
                                            className="form-control"
                                            placeholder="Crea una contraseña segura"
                                            required
                                        />
                                        <button type="button" className="password-toggle">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label for="confirmPasswordEmpresa">Confirmar contraseña <span className="required">*</span></label>
                                    <div className="password-input">
                                        <input
                                            type="password"
                                            id="confirmPasswordEmpresa"
                                            name="confirmPasswordEmpresa"
                                            className="form-control"
                                            placeholder="Repite tu contraseña"
                                            required
                                        />
                                        <button type="button" className="password-toggle">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="password-requirements">
                                <p className="requirements-title">La contraseña debe contener:</p>
                                <ul>
                                    <li id="req-length">Al menos 8 caracteres</li>
                                    <li id="req-uppercase">Al menos una letra mayúscula</li>
                                    <li id="req-lowercase">Al menos una letra minúscula</li>
                                    <li id="req-number">Al menos un número</li>
                                    <li id="req-match">Las contraseñas deben coincidir</li>
                                </ul>
                            </div>

                            <div className="terms-container">
                                <h3>Términos y condiciones</h3>
                                <div className="terms-content">
                                    <p>Al registrarte como empresa en SearchJobs, aceptas:</p>
                                    <ol>
                                        <li>1. Publicar exclusivamente ofertas laborales verificables, vigentes y auténticas.</li>
                                        <li>2. Mantener información precisa, completa y actualizada en tu perfil empresarial y publicaciones.</li>
                                        <li>3. Cumplir con las leyes laborales, de privacidad y contratación de tu país o región.</li>
                                        <li>4. Evitar cualquier contenido ofensivo, fraudulento o discriminatorio.</li>
                                        <li>5. Usar los datos personales de los candidatos únicamente con fines legítimos de selección.</li>
                                        <li>6. Abstenerse de realizar actividades fraudulentas como suplantación o phishing.</li>
                                        <li>7. Aceptar que SearchJobs puede revisar, suspender o eliminar publicaciones que incumplan estas</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="checkbox-group">
                                <input type="checkbox" id="aceptoTerminos" required />
                                <label for="aceptoTerminos">Acepto los términos y condiciones <span className="required">*</span></label>
                            </div>

                            <div className="step-buttons">
                                <button type="button" className="btn btn-outline" id="btnCancelar">Cancelar</button>
                                <button type="submit" className="btn btn-primary">Completar registro</button>
                            </div>
                        </div>
                    </form>

                    <div className="login-container">
                        <p>¿Ya tienes una cuenta? <a href="/login" className="login-link">Iniciar sesión</a></p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}