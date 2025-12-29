
/*
    PARAMETRO: listObjetos
    Es el objeto que obtienes del backend
*/
/*
    PARAMETRO: action
    Listado de objetos que representan los botones de la tabla 
    DATOS

*/
/*
    PARAMETRO: listEncabezados
    la key es el encabezado de la columna y el valor es un objeto que contienen
    DATOS
    nameAtributo: "nombre con el que accedes al valor del objeto de datos"
    clase: "la clase css que le quieras aplicar"
    modificador: "Para crear elemnetos distintos a un texto o quieras agregar alguna condicion"
    ejemplo
*/

const listEncabezados = {
    Vacante: { nameAtributo: "vacante.titulo" },
}

export default function Table({listEncabezados, listObjetos, action}) {
    const listEncabezadosText = Object.keys(listEncabezados).map((item)=>{
        return item.replace("_", " ");
    });

    const listValue = Object.values(listEncabezados).map((item)=>{
        return {...item, nameAtributo:item.nameAtributo? item.nameAtributo?.split(".") : undefined}
    });

    const extraccionDatosPorNiveles = ( item , list ) =>{
        let cadena = item;
        list.map(element => {cadena = cadena[element]});
        return cadena;
    }

    const extraccionStyle = (item , atributo) => {
        let defaultClass = "px-6 py-3 text-center ";
        if(!atributo || atributo == undefined) return defaultClass
        typeof(atributo) === "string" ?  defaultClass += atributo : defaultClass += atributo(item)
        return defaultClass;
    }

    return (
        <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
                <tr>
                    {
                        listEncabezadosText.map((item, index) => (
                            <th
                            key={index}
                            className={`px-4 py-3 text-center text-xs font-semibold text-blue-900 uppercase`}
                            >
                                {item}
                            </th>
                        ))
                    }
                    {(action && action.length != 0) && <th className="`px-4 py-3 text-center text-xs font-semibold text-blue-900 uppercase`">ACCIONES</th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {
                    listObjetos.map((item, index) => (
                        <tr key={index}>
                            {listValue.map((objetoItem, indice) => (
                                <td
                                    key={indice}
                                    className={ extraccionStyle(item, objetoItem["clase"] ) }
                                >
                                    {
                                        objetoItem.modificacion?
                                            objetoItem.modificacion(item)
                                            :
                                            extraccionDatosPorNiveles(item, objetoItem.nameAtributo)
                                    }
                                </td>
                            ))}
                            <td
                                className="px-6 py-4 flex flex-wrap gap-2"
                            >
                                {action?.map((actionItem, indice) => (

                                    <button
                                        key={indice}
                                        onClick={()=> actionItem.funcion(item)}
                                        className={actionItem.clase}
                                        hidden={actionItem.ocultar ? !actionItem.ocultar(item) : false}
                                    >
                                        {actionItem.text}
                                    </button>

                                ))}
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>

    )
}
