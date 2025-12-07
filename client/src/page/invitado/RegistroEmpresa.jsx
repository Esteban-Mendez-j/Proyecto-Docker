import { useSendForm } from "../../hooks/useFetch";
import useValidation from "../../hooks/useValidation";
import Layout from "../../layouts/Layout";
import InputForm from "../../components/InputForm";
import "../../style/invitado/registroEmpresa.css"
import Loading from "../../components/Loading";
import useVisible from "../../hooks/useVisible";
import { modalResponse } from "../../services/Modal";
import { Link, useNavigate } from "react-router-dom";
import { sectores } from "../../services/data";
import { useState } from "react";
import { formRulesEmpresa, validateForm } from "../../services/validacionForm";
import { ListSvg } from "../../components/Icons";
export default function RegistroEmpresa (){
    
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
    const [submitted, setSubmitted] = useState(false);
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
        setSubmitted(true)
        const newErrors = validateForm(dataFrom, formRulesEmpresa);
        const combinedErrors = { ...newErrors };

        if (!validarPassword) {
            combinedErrors.contrasena = "Contraseña inválida";
        }

        if (Object.keys(combinedErrors).length > 0) {
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
                                    submitted={submitted}
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
                                        submitted={submitted}
                                        minL={9}
                                        maxL={9}
                                    />
                                    <p className="error-text hidden" id="error-nit"></p>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="sectorEmpresa">Sector Empresa <span className="required">*</span></label>
                                    <InputForm
                                        as="select"
                                        name="sectorEmpresa"
                                        value={dataFrom.sectorEmpresa}
                                        handleOnChange={handleOnChange}
                                        error={error}
                                        rules={formRulesEmpresa} // define las reglas de validación para este campo
                                        submitted={submitted}
                                        className={`form-control ${error?.sectorEmpresa ? "error-input" : ""}`}
                                    >
                                        <option value="" disabled>Selecciona tu sector</option>
                                        {sectores.map((sector, index) => (
                                            <option key={index} value={sector}>{sector}</option>
                                        ))}
                                    </InputForm>

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
                                    submitted={submitted}
                                    autoComplete={"email"}
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
                                    submitted={submitted}
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
                                                    <ListSvg name={"ojo"} height={20} width={20} />
                                                ) : (
                                                    <ListSvg name={"ojoTapado"} height={20} width={20} />
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
                                                    <ListSvg name={"ojo"} height={20} width={20} />
                                                ) : (
                                                    <ListSvg name={"ojoTapado"} height={20} width={20} />
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

                            <div className="checkbox-group">
                                <input type="checkbox" id="aceptoTerminos" required />
                               <label htmlFor="aceptoTerminos" className="flex items-center gap-1 text-sm">
                                        Acepto los{" "}
                                        <Link
                                            to="/terminos/condiciones"
                                            className="text-blue-600 hover:underline"
                                            target="_blank"
                                        >
                                            Términos y Condiciones 
                                        </Link>
                                        {" "} y la {" "}
                                        <Link
                                            to="/politicas/privacidad"
                                            className="text-blue-600 hover:underline"
                                            target="_blank"
                                        >
                                            Política de Privacidad
                                        </Link>

                                        <span className="required">*</span>
                                    </label>
                            </div>

                            <div className="step-buttons">
                                <Link to="/registro" className="btn btn-outline">
                                    Cancelar
                                </Link>
                                <button type="submit" className="btn btn-primary">Completar registro</button>
                            </div>
                        </div>
                    </form>

                    <div className="login-container">
                        <p>¿Ya tienes una cuenta? <Link to="/login" className="login-link">Iniciar sesión</Link></p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}