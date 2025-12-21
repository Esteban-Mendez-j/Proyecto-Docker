
// lista de valores del Objeto
// La Key no se cambia, repesenta como se va a mostrar 
// el value de la Key es el nombre del atributo del objeto (Ej: objeto.nombre) en este aso es nombre 
const listValue = {
    id:"",
    titulo: "",
    subtitulo: "",
    parrafo: "",
    fechaInicio: "",
    fechaFin: "",
    fechaActual:"",
    estado:"",
    texto: []
}

// Funciones y texto de los dos botones 
const action = {
    boton1: { funcion: "", texto: "" },
    boton2: { funcion: "", texto: "" }
}

export default function TimeLineList({ objeto, listValue, action }) {

    if(objeto.length === 0 ){
       return <p className="italic text-gray-500">No hay Estudios registrados.</p>
    }

    return (
        <div className="space-y-6 mt-4">
            {
                objeto.map((elemento, index) => (
                    <div
                        key={index}
                        className="relative pl-6 border-l-2 border-[var(--border)] pb-4"
                    >
                        <div className="absolute -left-[0.4rem] top-0 w-3 h-3 bg-[var(--primary)] rounded-full border-2 border-white" />
                        <h3 className="text-base font-semibold text-[var(--text)]">
                            {elemento[listValue.titulo]}
                        </h3>
                        <p className="text-sm text-[var(--primary)]">
                            {elemento[listValue.subtitulo]}
                        </p>
                        <p className="text-sm text-[var(--text)]">
                            {elemento[listValue.fechaInicio]} - {[true, "En curso"].includes(elemento[listValue?.fechaActual]) ? "Actualidad" : elemento[listValue.fechaFin]}
                        </p>
                        <p className="text-sm text-[var(--text)]">
                            {elemento[listValue.parrafo]}
                        </p>
                        <p className="text-sm text-[var(--text)]">
                            { elemento[listValue?.estado]}
                        </p>

                        {listValue.texto &&
                            listValue.texto.map((elem, indice) => (
                                <p key={indice} className="text-sm text-[var(--text)]">
                                    {elemento[elem]}
                                </p>
                            ))
                        }

                        {action &&
                            <>
                                {action.boton1 && <button
                                    type="button"
                                    onClick={()=> action.boton1.funcion(
                                        elemento[listValue.id]
                                    ) }
                                    className="mt-2 text-sm text-red-600 hover:underline p-2"
                                >
                                    {action.boton1.texto}
                                </button>
                                }
                                {action.boton2 && <button
                                    type="button"
                                    onClick={()=> action.boton2.funcion(
                                        elemento[listValue.id]
                                    ) }
                                    className="mt-2 text-sm text-blue-600 hover:underline"
                                >
                                    {action.boton2.texto}
                                </button>
                                }
                            </>
                        }

                        
                    </div>
                ))
            }

        </div>
    )
}

