import Layout from "../../layouts/layout";
import "../../style/invitado/registroCandidato.css"

export default function RegistroCandidato() {

    return (
        <Layout>
            <div class="container">
                <div class="registro-container">
                    <h1 class="registroCandidato-title">Crea tu cuenta de candidato</h1>
                    <p class="subtitle">Completa el formulario para acceder a todas las oportunidades laborales</p>

                    <form id="registroForm" class="form">
                        <div class="step-content active" id="step1">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="nombre">Nombre completo <span class="required">*</span></label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        class="form-control"
                                        placeholder="Ingresa tu nombre completo"
                                        required
                                    />
                                    <p class="error-text hidden" id="error-nombre"></p>
                                </div>

                                <div class="form-group">
                                    <label for="apellido">Apellido completo <span class="required">*</span></label>
                                    <input
                                        type="text"
                                        id="apellido"
                                        name="apellido"
                                        class="form-control"
                                        placeholder="Ingresa tu Apellido completo"
                                        required
                                    />
                                    <p class="error-text hidden" id="error-apellido"></p>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="email">Correo electrónico <span class="required">*</span></label>
                                <input
                                    type="email"
                                    id="email"
                                    name="correo"
                                    class="form-control"
                                    placeholder="ejemplo@correo.com"
                                    required
                                />
                                <p class="error-text hidden" id="error-correo"></p>
                                <p class="form-hint">Usarás este correo para iniciar sesión</p>
                            </div>


                            <div class="form-row">
                                <div class="form-group">
                                    <label for="telefono">Teléfono</label>
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        class="form-control"
                                        placeholder="Ej: +57 300 123 4567"
                                    />
                                    <p class="error-text hidden" id="error-telefono"></p>
                                </div>

                                <div class="form-group">
                                    <label for="identificacion">Identificacion<span class="required">*</span></label>
                                    <input
                                        type="number"
                                        id="identificacion"
                                        name="identificacion"
                                        class="form-control"
                                        placeholder="Ingresa su numero de identificacion"
                                        required
                                    />
                                    <p class="error-text hidden" id="error-identificacion"></p>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="password">Contraseña <span class="required">*</span></label>
                                    <div class="password-input">
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            class="form-control"
                                            placeholder="Crea una contraseña segura"
                                            required
                                        />
                                        <button
                                            type="button"
                                            class="password-toggle"
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

                                <div class="form-group">
                                    <label for="confirmPassword">Confirmar contraseña <span class="required">*</span></label>
                                    <div class="password-input">
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            class="form-control"
                                            placeholder="Repite tu contraseña"
                                            required
                                        />
                                        <button
                                            type="button"
                                            class="password-toggle"
                                            id="confirmPasswordToggle"
                                            aria-label="Mostrar contraseña"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="password-requirements">
                                <p class="requirements-title">La contraseña debe contener:</p>
                                <ul>
                                    <li id="req-length">Longitud de 8 a 15 carateres</li>
                                    <li id="req-uppercase">Al menos una letra mayúscula</li>
                                    <li id="req-lowercase">Al menos una letra minúscula</li>
                                    <li id="req-number">Al menos un número</li>
                                    <li id="req-match">Las contraseñas deben coincidir</li>
                                </ul>
                            </div>

                            <div class="form-group">
                                <div class="terms-container">
                                    <h3>Términos y condiciones</h3>
                                    <div class="terms-content">
                                        <p>Al registrarte en SearchJobs, aceptas los siguientes términos y condiciones:</p>
                                        <ol>
                                            <li>1. SearchJobs actúa como una plataforma de conexión entre candidatos y empresas, pero no es responsable de las ofertas laborales publicadas por terceros.</li>
                                            <li>2. La información proporcionada en tu perfil debe ser veraz y actualizada.</li>
                                            <li>3. Eres responsable de mantener la confidencialidad de tu contraseña y cuenta.</li>
                                            <li>4. SearchJobs puede enviar notificaciones relacionadas con ofertas de empleo y actualizaciones de la plataforma.</li>
                                            <li>5. Tu información personal será tratada de acuerdo con nuestra Política de Privacidad.</li>
                                        </ol>
                                    </div>
                                </div>

                                <div class="checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="terminos" name="terminos" required />
                                        <span class="checkbox-text">Acepto los términos y condiciones <span class="required">*</span></span>
                                    </label>
                                </div>
                            </div>

                            <div class="step-buttons">
                                <a href="/registro" class="btn btn-outline">Cancelar</a>
                                <button type="submit" class="btn btn-primary">Completar registro</button>
                            </div>
                        </div>
                    </form>

                    <div class="login-container">
                        <p>
                            ¿Ya tienes una cuenta?{" "}
                            <a href="/login" class="login-link">
                                Iniciar sesión
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}