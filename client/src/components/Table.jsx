import "../style/usuarios/table.css"
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

export default function Table({
    listEncabezados,
    listObjetos,
    action,
    mobileCards = false
}) {
    const encabezados = Object.entries(listEncabezados).map(([nombre, config]) => ({
        nombre: nombre.replaceAll("_", " "),
        ...config,
        atributos: config.nameAtributo
            ? config.nameAtributo.split(".")
            : undefined
    }));

    // Obtener un atributo, incluso si está anidado.
    const obtenerValor = (item, atributos) => {
        if (!atributos) return "";

        return atributos.reduce(
            (actual, atributo) => actual?.[atributo],
            item
        ) ?? "";
    };

    // Obtener el valor que se mostrará en la celda.
    const obtenerContenido = (item, encabezado) => {
        if (encabezado.modificacion) {
            return encabezado.modificacion(item);
        }

        return obtenerValor(item, encabezado.atributos);
    };

    // Obtener las clases dinámicas de cada celda.
    const obtenerClase = (item, encabezado) => {
        const clase = encabezado.clase;

        if (!clase) return "";

        return typeof clase === "function"
            ? clase(item)
            : clase;
    };

    return (
        <div className={`tabla-contenedor ${mobileCards ? "tabla-con-tarjetas" : ""}`}>

            {/* TABLA PARA ESCRITORIO */}
            <div className="tabla-escritorio">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            {encabezados.map((encabezado, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-3 text-center text-xs font-semibold text-blue-900 uppercase"
                                >
                                    {encabezado.nombre}
                                </th>
                            ))}

                            {action?.length > 0 && (
                                <th className="px-4 py-3 text-center text-xs font-semibold text-blue-900 uppercase">
                                    ACCIONES
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {listObjetos.map((item, index) => (
                            <tr key={item.nPostulacion ?? item.id ?? index}>
                                {encabezados.map((encabezado, indice) => (
                                    <td
                                        key={indice}
                                        className={`px-6 py-3 text-center ${obtenerClase(item, encabezado)}`}
                                    >
                                        {obtenerContenido(item, encabezado)}
                                    </td>
                                ))}

                                {action?.length > 0 && (
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {action.map((actionItem, indice) => (
                                                <button
                                                    key={indice}
                                                    onClick={() => actionItem.funcion(item)}
                                                    className={actionItem.clase}
                                                    hidden={
                                                        actionItem.ocultar
                                                            ? !actionItem.ocultar(item)
                                                            : false
                                                    }
                                                >
                                                    {actionItem.text}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* TARJETAS PARA MÓVILES */}
            {mobileCards && (
                <div className="tabla-tarjetas">
                    {listObjetos.map((item, index) => (
                        <article
                            className="tabla-tarjeta"
                            key={item.nPostulacion ?? item.id ?? index}
                        >
                            <div className="tabla-tarjeta-contenido">
                                {encabezados.map((encabezado, indice) => (
                                    <div
                                        className="tabla-tarjeta-fila"
                                        key={indice}
                                    >
                                        <span className="tabla-tarjeta-label">
                                            {encabezado.nombre}
                                        </span>

                                        <span
                                            className={`tabla-tarjeta-valor ${obtenerClase(item, encabezado)}`}
                                        >
                                            {obtenerContenido(item, encabezado)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {action?.length > 0 && (
                                <div className="tabla-tarjeta-acciones">
                                    {action.map((actionItem, indice) => (
                                        <button
                                            key={indice}
                                            onClick={() => actionItem.funcion(item)}
                                            className={actionItem.clase}
                                            hidden={
                                                actionItem.ocultar
                                                    ? !actionItem.ocultar(item)
                                                    : false
                                            }
                                        >
                                            {actionItem.text}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}