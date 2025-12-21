import { useNavigate, useParams } from "react-router-dom";
import { useSendForm } from "../../hooks/useFetch";
import { useEffect, useState } from "react";
import useDataChange from "../../hooks/useDataChange";
import { modalTime } from "../../services/Modal";
import InputForm from "../../components/InputForm";

export default function FormHistorial(){

    const initialDataExperiencia  = {
        cargo:"",
        empresa:"",
        descripcion:"",
        fechaInicio:"",
        fechaFin:"",
        trabajoActual:false
    } 
    
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { send , data } = useSendForm();
    const [submitted, setSubmitted] = useState(false);
    const url = id? `/api/historialLaborals/edit/${id}` : "/api/historialLaborals/add";
    const metodo = id? `PUT` : "POST";
    
    const getDataEdit = async () => {
        await send(url, "GET")
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

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setSubmitted(true);
        const response = await send(url, metodo, JSON.stringify(dataForm) );
        //TODO: como al crear no hay id entonces no sale el mensaje 
        if(response == dataForm.idEstudio){
            modalTime(id? "Edicion realizada con exito!" : "Se creó el nuevo historial laboral");
        }
        if(!id){clearDataForm();}
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
                            isDisabled={dataForm.trabajoActual}
                        />
                        <div >
                            <label htmlFor="trabajoActual">Trabajo Actual</label>
                            <input type="checkbox" name="trabajoActual" 
                                checked={dataForm.trabajoActual} 
                                value={dataForm.trabajoActual} 
                                onChange={(e) => {
                                    e.target = { name:"trabajoActual" , value:e.target.checked}
                                    handleOnChange(e)
                                }}
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