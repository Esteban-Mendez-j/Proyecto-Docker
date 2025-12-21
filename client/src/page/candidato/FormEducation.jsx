import { useState, useEffect } from "react"
import { useSendForm } from "../../hooks/useFetch"
import { modalTime } from "../../services/Modal";
import useDataChange from "../../hooks/useDataChange";
import { listEducacion } from "../../services/data";
import InputForm from "../../components/InputForm";
import { useNavigate, useParams } from "react-router-dom";

export default function FormEducation(){

    const initialDataEducation = {
        titulo:"",
        academia:"",
        descripcion:"",
        fechaInicio:"",
        fechaFin:"",
        nivelEducativo: "",
        estado: "",
        visible:true,
        urlCertificado:""
    } 
    
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { send , data } = useSendForm();
    const [submitted, setSubmitted] = useState(false);
    const url = id? `/api/estudios/edit/${id}` : "/api/estudios/add";
    const metodo = id? `PUT` : "POST";
    
    const getDataEdit = async () => {
        await send(url, "GET")
        console.log(url)
    }
    useEffect(() => {
        if (id) {
            getDataEdit();
        }
    }, [id]);

    const [ dataForm , handleOnChange, clearDataForm, setDataForm ] = useDataChange( initialDataEducation );
    
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
            modalTime(id? "Edicion realizada con exito!" : "Se creó el nuevo estudio");
        }
        if(!id){clearDataForm();}
    }

    return (
        <div className="registro-container" >
                <h1 className="registroEmpresa-title">{id? "Editar Estudio" : "Crear Estudio" }</h1>
                <p className="subtitle">Modifica los campos necesarios</p>
            <form className="form" onSubmit={handleSubmit} >

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="titulo">Título Universitario</label>
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
                        <label htmlFor="academia">Academia en la que estudiaste</label>
                        <InputForm
                            type="text"
                            name="academia"
                            value={dataForm.academia}
                            placeholder="Ej: Plazi, Tecnologico comfenalco "
                            handleOnChange={handleOnChange}
                            submitted={submitted}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="estado" > Estado del Estudio </label>
                        <InputForm
                            as="select"
                            name="estado"
                            value={dataForm.estado}
                            handleOnChange={handleOnChange}
                            submitted={submitted}
                        >
                            <option value="" disabled>Selecciona el estado</option>
                            <option value="En curso"> En curso </option>
                            <option value="finalizada"> Finalizada </option>
                        </InputForm>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nivelEducativo" > Nivel Educativo </label>
                        <InputForm
                            as="select"
                            name="nivelEducativo"
                            value={dataForm.nivelEducativo}
                            handleOnChange={handleOnChange}
                            submitted={submitted}
                        >
                            <option value="" disabled>Selecciona tu nivel educativo</option>
                            {listEducacion.map((nivel, index) => (
                                <option key={index} value={nivel}>{nivel}</option>
                            ))}
                        </InputForm>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="fechaInicio">Fecha de inicio del Curso</label>
                        <InputForm
                            type="date"
                            name="fechaInicio"
                            value={dataForm.fechaInicio}
                            handleOnChange={handleOnChange}
                            submitted={submitted}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaFin">Fecha final del Curso</label>
                        <InputForm
                            type="date"
                            name="fechaFin"
                            value={dataForm.estado === "En curso"? "":dataForm.fechaFin}
                            handleOnChange={handleOnChange}
                            submitted={submitted}
                            isDisabled={dataForm.estado === "En curso"}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="descripcion">Descripcion</label>
                    <InputForm
                        placeholder="Ej: El curso se enfocó en el area de..."
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