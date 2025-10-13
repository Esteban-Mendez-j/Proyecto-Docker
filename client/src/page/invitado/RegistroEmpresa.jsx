import { useSendForm } from "../../hooks/useFetch";
import useValidation from "../../hooks/useValidation";
import Layout from "../../layouts/Layout";
import InputForm from "../../components/InputForm";
import "../../style/invitado/registroEmpresa.css"
import Loading from "../../components/Loading";
import useVisible from "../../hooks/useVisible";
import { modalResponse } from "../../services/Modal";
import { useNavigate } from "react-router-dom";
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

    const initialData = {
        nombre: "",
        nit: "",
        correo: "",
        contrasena: "",
        telefono: "",
        sectorEmpresa: "",
        contraseñaVerificada: ""
    }
    
    const {send , data, error, setError, loading} = useSendForm();
    const { validarPassword, dataFrom, setDataFrom } = useValidation(initialData);
    const [handleOnClick, visible] = useVisible();
    const [handleOnClick2, visible2] = useVisible();
    const navigate = useNavigate();

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setDataFrom(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        if (!validarPassword) {
            setError(prev => ({
                ...prev,
                contrasena: "Contraseña Invalida"
            }));
            return;
        }
        const result = await send("/api/empresas/add", "POST", JSON.stringify(dataFrom));
        if(result.status === 201){
            const isOk = await modalResponse(result.mensaje, "success");
            if(isOk){
                navigate("/login");
            }
        }
    }

    return(
        <Layout>
            <div className="container">
                <div className="registro-container">
                    <h1 className="registroEmpresa-title">Crea tu cuenta de empresa</h1>
                    <p className="subtitle">Completa el formulario para comenzar a publicar vacantes y encontrar talento</p>

                    <form id="registroEmpresaForm" className="form" onSubmit={handleSubmit}>
                        <div className="step-content active" id="step1">
                            <div className="form-group">
                                <label htmlFor="nombreEmpresa">Nombre de la empresa <span className="required">*</span></label>
                                <InputForm
                                    type={"text"}
                                    name={"nombre"}
                                    placeholder={"Nombre legal de la empresa"}
                                    value={dataFrom.nombre}
                                    handleOnChange={handleOnChange}
                                    error={error}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="nit">NIT / Identificación fiscal <span className="required">*</span></label>
                                    <InputForm
                                        type={"number"}
                                        name={"nit"}
                                        placeholder={"Número de identificación tributaria"}
                                        value={dataFrom.nit}
                                        handleOnChange={handleOnChange}
                                        error={error}
                                        minL={9}
                                        maxL={9}
                                    />
                                    <p className="error-text hidden" id="error-nit"></p>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="sectorEmpresa">Sector Empresa <span className="required">*</span></label>
                                    <select id="sectorEmpresa" value={dataFrom.sectorEmpresa} name="sectorEmpresa" className= {`form-control ${error?.sectorEmpresa ? "error-input" : ""}`} required onChange={handleOnChange}>
                                        <option value={""} disabled>Selecciona tu sector</option>
                                        {sectores.map((sector) => (
                                            <option value={sector} selected={dataFrom.sectorEmpresa == sector}>{sector}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="emailEmpresa">Correo electrónico corporativo <span className="required">*</span></label>
                                <InputForm
                                    type={"email"}
                                    name={"correo"}
                                    placeholder={"ejemplo@empresa.com"}
                                    value={dataFrom.correo}
                                    handleOnChange={handleOnChange}
                                    error={error}
                                />
                                <p className="form-hint">Usarás este correo para iniciar sesión</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="telefonoEmpresa">Teléfono corporativo <span className="required">*</span></label>
                                <InputForm
                                    type={"number"}
                                    name={"telefono"}
                                    placeholder={"Ej: +57 300 123 4567"}
                                    value={dataFrom.telefono}
                                    handleOnChange={handleOnChange}
                                    error={error}
                                    maxL={10}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="passwordEmpresa">Contraseña <span className="required">*</span></label>
                                    <div className="password-input">
                                        <InputForm
                                            type={visible ? "text" : "password"}
                                            name={"contrasena"}
                                            placeholder={"Crea una contraseña segura"}
                                            value={dataFrom.contrasena}
                                            handleOnChange={handleOnChange}
                                            error={error}
                                            autoComplete={"new-password"}
                                        >
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                id="passwordToggle"
                                                aria-label="Mostrar contraseña"
                                                onClick={handleOnClick}
                                            >
                                                {visible ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                                    </svg>
                                                )}
                                            </button>
                                        </InputForm>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPasswordEmpresa">Confirmar contraseña <span className="required">*</span></label>
                                    <div className="password-input">
                                        <InputForm
                                            type={visible2 ? "text" : "password"}
                                            name={"contraseñaVerificada"}
                                            placeholder={"Repite tu contraseña"}
                                            value={dataFrom.contraseñaVerificada}
                                            handleOnChange={handleOnChange}
                                            error={error}
                                            autoComplete={"new-password"}
                                        >
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                id="confirmPasswordToggle"
                                                aria-label="Mostrar contraseña"
                                                onClick={handleOnClick2}
                                            >
                                                {visible2 ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                                    </svg>
                                                )}
                                            </button>
                                        </InputForm>
                                    </div>
                                </div>
                            </div>

                            <div className="password-requirements">
                                <p className="requirements-title">
                                    La contraseña debe contener:
                                </p>
                                <ul>
                                    <li
                                        className={
                                            dataFrom.contrasena.length >= 8 && dataFrom.contrasena.length <= 15
                                                ? "valid"
                                                : ""
                                        }
                                    >
                                        Longitud de 8 a 15 caracteres
                                    </li>
                                    <li
                                        className={/[A-Z]/.test(dataFrom.contrasena) ? "valid" : ""}
                                    >
                                        Al menos una letra mayúscula
                                    </li>

                                    <li
                                        className={/[a-z]/.test(dataFrom.contrasena) ? "valid" : ""}
                                    >
                                        Al menos una letra minúscula
                                    </li>

                                    <li
                                        className={/[0-9]/.test(dataFrom.contrasena) ? "valid" : ""}
                                    >
                                        Al menos un número
                                    </li>

                                    <li
                                        className={
                                            dataFrom.contrasena &&
                                                dataFrom.contrasena === dataFrom.contraseñaVerificada
                                                ? "valid"
                                                : ""
                                        }
                                    >
                                        Las contraseñas deben coincidir
                                    </li>
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
                                <label htmlFor="aceptoTerminos">Acepto los términos y condiciones <span className="required">*</span></label>
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