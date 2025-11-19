import Layout from "../../layouts/Layout";
import "../../style/invitado/registroCandidato.css"
import { useSendForm } from "../../hooks/useFetch"
import InputFrom from "../../components/InputForm";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { modalResponse } from "../../services/Modal";
import Loading from "../../components/Loading";
import useValidation from "../../hooks/useValidation";
import useVisible from "../../hooks/useVisible";
import { formRulesCandidato, validateForm } from "../../services/validacionForm";

export default function RegistroCandidato() {

    // const initialValidate = {
    //     numero:false,
    //     uppercase:false,
    //     lowcase:false,
    //     equals:false,
    //     lengh: false
    // }
    const initialData = {
        nombre: "",
        apellido: "",
        correo: "",
        contrasena: "",
        telefono: "",
        identificacion: "",
        contraseñaVerificada: ""
    }

    const { send , data, error, setError, loading } = useSendForm();
    const { validarPassword, dataFrom, setDataFrom } = useValidation(initialData);
    const [handleOnClick, visible] = useVisible();
    const [submitted, setSubmitted] = useState(false);
    const [handleOnClick2, visible2] = useVisible();
    const navigate = useNavigate();

    //Actualiza el estado global de los inputs
    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setDataFrom(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true)
        const newErrors = validateForm(dataFrom, formRulesCandidato);
        const combinedErrors = { ...newErrors };

        if (!validarPassword) {
            combinedErrors.contrasena = "Contraseña inválida";
        }

        if (Object.keys(combinedErrors).length > 0) {
            console.log(combinedErrors)
            setError(combinedErrors);

            // Foco en el primer campo con error
            const firstErrorField = Object.keys(combinedErrors)[0];
            const el = document.getElementById(firstErrorField);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.focus();
            }

            return; // detener envío o acción
        }
        setError(null);

        const result = await send("/api/candidatos/add", "POST", JSON.stringify(dataFrom));
        if(result.status === 201){
            const isOk = await modalResponse(result.mensaje, "success");
            if(isOk){
                navigate("/login");
            }
        }
    }

    if(loading){
        return(
            <Loading/>
        )
    }

    return (
        <Layout>
            <div className="container">
                <div className="registro-container">
                    <h1 className="registroCandidato-title">
                        Crea tu cuenta de candidato
                    </h1>
                    <p className="subtitle">
                        Completa el formulario para acceder a todas las oportunidades
                        laborales
                    </p>

                    <form id="registroForm" className="form" onSubmit={handleSubmit}>
                        <div className="step-content active" id="step1">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="nombre">
                                        Nombre completo <span className="required">*</span>
                                    </label>
                                    <InputFrom
                                        type={"text"}
                                        name={"nombre"}
                                        placeholder={"Ingresa tu nombre completo"}
                                        value={dataFrom.nombre}
                                        handleOnChange={handleOnChange}
                                        error={error}
                                        submitted={submitted}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="apellido">
                                        Apellido completo <span className="required">*</span>
                                    </label>
                                    <InputFrom
                                        type={"text"}
                                        name={"apellido"}
                                        placeholder={"Ingresa tu Apellido completo"}
                                        value={dataFrom.apellido}
                                        handleOnChange={handleOnChange}
                                        error={error}
                                        submitted={submitted}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    Correo electrónico <span className="required">*</span>
                                </label>
                                <InputFrom
                                    type={"email"}
                                    name={"correo"}
                                    placeholder={"ejemplo@correo.com"}
                                    value={dataFrom.correo}
                                    handleOnChange={handleOnChange}
                                    error={error}
                                    submitted={submitted}
                                    autoComplete={"email"}
                                />
                                <p className="form-hint">
                                    Usarás este correo para iniciar sesión
                                </p>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="telefono">Teléfono</label>
                                    <InputFrom
                                        type={"number"}
                                        name={"telefono"}
                                        placeholder={"Ej: +57 300 123 4567"}
                                        value={dataFrom.telefono}
                                        handleOnChange={handleOnChange}
                                        error={error}
                                        submitted={submitted}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="identificacion">
                                        Identificacion<span className="required">*</span>
                                    </label>
                                    <InputFrom
                                        type={"number"}
                                        name={"identificacion"}
                                        placeholder={"Ingresa su numero de identificacion"}
                                        value={dataFrom.identificacion}
                                        handleOnChange={handleOnChange}
                                        error={error}
                                        submitted={submitted}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password">
                                        Contraseña <span className="required">*</span>
                                    </label>
                                    <div className="password-input">
                                        <InputFrom
                                            type={visible ? "text" : "password"}
                                            name={"contrasena"}
                                            placeholder={"Crea una contraseña segura"}
                                            value={dataFrom.contrasena}
                                            handleOnChange={handleOnChange}
                                            error={error}
                                            submitted={submitted}
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
                                        </InputFrom>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">
                                        Confirmar contraseña <span className="required">*</span>
                                    </label>
                                    <div className="password-input">
                                        <InputFrom
                                            type={visible2 ? "text" : "password"}
                                            name={"contraseñaVerificada"}
                                            placeholder={"Repite tu contraseña"}
                                            value={dataFrom.contraseñaVerificada}
                                            handleOnChange={handleOnChange}
                                            error={error}
                                            submitted={submitted}
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
                                        </InputFrom>
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

                            <div className="form-group">
                                <div className="terms-container">
                                    <h3>Términos y condiciones</h3>
                                    <div className="terms-content">
                                        <p>
                                            Al registrarte en SearchJobs, aceptas los siguientes
                                            términos y condiciones:
                                        </p>
                                        <ol>
                                            <li>
                                                1. SearchJobs actúa como una plataforma de conexión
                                                entre candidatos y empresas, pero no es responsable de
                                                las ofertas laborales publicadas por terceros.
                                            </li>
                                            <li>
                                                2. La información proporcionada en tu perfil debe ser
                                                veraz y actualizada.
                                            </li>
                                            <li>
                                                3. Eres responsable de mantener la confidencialidad de
                                                tu contraseña y cuenta.
                                            </li>
                                            <li>
                                                4. SearchJobs puede enviar notificaciones relacionadas
                                                con ofertas de empleo y actualizaciones de la
                                                plataforma.
                                            </li>
                                            <li>
                                                5. Tu información personal será tratada de acuerdo con
                                                nuestra Política de Privacidad.
                                            </li>
                                        </ol>
                                    </div>
                                </div>

                                <div className="checkbox-group">
                                    <input type="checkbox" id="aceptoTerminos" required />
                                    <label htmlFor="aceptoTerminos">Acepto los términos y condiciones <span className="required">*</span></label>
                                </div>
                            </div>

                            <div className="step-buttons">
                                <Link to="/registro" className="btn btn-outline">
                                    Cancelar
                                </Link>
                                <button type="submit" className="btn btn-primary">
                                    Completar registro
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="login-container">
                        <p>
                            ¿Ya tienes una cuenta?{" "}
                            <Link to="/login" className="login-link">
                                Iniciar sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}