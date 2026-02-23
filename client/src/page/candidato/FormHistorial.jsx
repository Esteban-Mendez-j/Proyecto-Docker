import { useNavigate, useParams } from "react-router-dom";
import { useSendFormV2 } from "../../hooks/useFetch";
import { useContext, useEffect, useState } from "react";
import useDataChange from "../../hooks/useDataChange";
import { modalTime } from "../../services/Modal";
import InputForm from "../../components/InputForm";
import { formRulesHistorialLaboral, validateForm } from "../../services/validacionForm";
import exceptionControl from "../../services/exceptionControl";
import { RoleContext } from "../../services/RoleContext";

export default function FormHistorial(){

    const initialDataExperiencia  = {
        iDHistorial:"",
        titulo:"",
        empresa:"",
        descripcion:"",
        fechaInicio:"",
        fechaFin:"",
        trabajoActual:false
    } 
    
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { logout } = useContext(RoleContext);
    const { send , data, error, setError } = useSendFormV2();
    const [submitted, setSubmitted] = useState(false);
    const url = id? `/api/historialLaborals/edit/${id}` : "/api/historialLaborals/add";
    const metodo = id? `PUT` : "POST";
    
    const getDataEdit = async () => {
        try {
            await send(url, "GET")
        } catch (error) {
            exceptionControl(error, logout, navigate, "Error al cargar el Historial")
        }
    }

    useEffect(() => {
        if (id) {
            getDataEdit();
        }
    }, [id]);

    const [ dataForm , handleOnChange, clearDataForm, setDataForm ] = useDataChange( initialDataExperiencia );
    
    useEffect(() => {
        if (data) {
            setDataForm(prev => ({
                ...prev,
                ...data
            }));
        }
    }, [data])

    const handleOnChangeTrabajoActual = (e) => {
        e.target = { name: "trabajoActual", value: e.target.checked }
        handleOnChange(e)
        e.target = { name: "fechaFin", value: "" }
        handleOnChange(e)
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setSubmitted(true);
            const newErrors = validateForm(dataForm, formRulesHistorialLaboral);

            if (Object.keys(newErrors).length > 0) {
                setError(newErrors);

                const firstErrorField = Object.keys(newErrors)[0];
                const el = document.getElementById(firstErrorField);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                    el.focus();
                }
                return; // no enviar
            }

            setError({});
            await send(url, metodo, JSON.stringify(dataForm));
            modalTime(id ? "Edicion realizada con exito!" : "Se creó el nuevo historial laboral");
            if (!id) { clearDataForm(); setSubmitted(false) }
        } catch (error) {
            exceptionControl(error, logout, navigate, `Error al ${id ? "editar" : "crear"} el Historial`)
        }
    }

    return (
        <div className="registro-container" >
                <h1 className="registroEmpresa-title">{id? "Editar Historial Laboral" : "Crear Historial Laboral" }</h1>
                <p className="subtitle">Modifica los campos necesarios</p>
            <form className="form" onSubmit={handleSubmit} >

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="titulo">Cargo o Puesto de trabajo</label>
                        <InputForm
                            type="text"
                            name="titulo"
                            value={dataForm.titulo}
                            placeholder="Ej: Ingeniero en sistemas"
                            handleOnChange={handleOnChange}
                            submitted={submitted}
                            rules={formRulesHistorialLaboral}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="empresa">Empresa en la que Trabajaste</label>
                        <InputForm
                            type="text"
                            name="empresa"
                            value={dataForm.empresa}
                            placeholder="Ej: Microsoft, Google"
                            handleOnChange={handleOnChange}
                            submitted={submitted}
                            rules={formRulesHistorialLaboral}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="fechaInicio">Fecha de Inicio</label>
                        <InputForm
                            type="date"
                            name="fechaInicio"
                            value={dataForm.fechaInicio}
                            handleOnChange={handleOnChange}
                            submitted={submitted}
                            rules={formRulesHistorialLaboral}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaFin">Fecha Final</label>
                        <InputForm
                            type="date"
                            name="fechaFin"
                            value={dataForm.trabajoActual? "" : dataForm.fechaFin}
                            handleOnChange={handleOnChange}
                            submitted={submitted}
                            error={dataForm.trabajoActual ? "" :
                                dataForm.fechaFin ? "" : { fieldErrors: [{ field: "fechaFin", message: "Campo obligatorio" }] }
                            }
                            isDisabled={dataForm.trabajoActual}
                        />
                        <div >
                            <label htmlFor="trabajoActual">Trabajo Actual</label>
                            <input type="checkbox" name="trabajoActual" 
                                checked={dataForm.trabajoActual} 
                                value={dataForm.trabajoActual} 
                                onChange={handleOnChangeTrabajoActual}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="descripcion">Descripcion</label>
                    <InputForm
                        placeholder="Ej: En este empleo me dedique a la parte de..."
                        value={dataForm.descripcion}
                        name="descripcion"
                        handleOnChange={handleOnChange}
                        submitted={submitted}
                        rules={formRulesHistorialLaboral}
                        as="textarea"
                    />
                </div>
                <div className="step-buttons">
                    <button onClick={(e)=>{ e.preventDefault(); navigate(-1)}} className="btn btn-outline">
                        Salir
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Guardar
                    </button>
                </div>
            </form>
    </div>
    )
}