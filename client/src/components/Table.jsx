import "../style/usuarios/table.css"
import { useState } from "react";
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

/* =========================================
   TARJETA DESPLEGABLE PARA MÓVILES
========================================= */

function TarjetaAcordeon({
    item,
    index,
    encabezados,
    action,
    encabezadoPrincipal
}) {
    const [expandida, setExpandida] = useState(false);

    const obtenerValor = (objeto, atributos) => {
        if (!atributos) return "";

        return atributos.reduce(
            (actual, atributo) => actual?.[atributo],
            objeto
        ) ?? "";
    };

    const obtenerContenido = (objeto, encabezado) => {
        if (encabezado.modificacion) {
            return encabezado.modificacion(objeto);
        }

        return obtenerValor(objeto, encabezado.atributos);
    };

    const obtenerClase = (objeto, encabezado) => {
        const clase = encabezado.clase;

        if (!clase) return "";

        return typeof clase === "function"
            ? clase(objeto)
            : clase;
    };

    const otrosEncabezados = encabezados.filter(
        (encabezado) => encabezado !== encabezadoPrincipal
    );

    return (
        <article className={`tabla-tarjeta ${expandida ? "expandida" : ""}`}>

            {/* ENCABEZADO VISIBLE SIEMPRE */}
            <div className="tabla-tarjeta-resumen">

                <div className="tabla-tarjeta-vacante">
                    <span className="tabla-tarjeta-label">
                        {encabezadoPrincipal?.nombre ?? "Postulación"}
                    </span>

                    <span className="tabla-tarjeta-titulo">
                        {encabezadoPrincipal
                            ? obtenerContenido(item, encabezadoPrincipal)
                            : `Postulación ${index + 1}`}
                    </span>
                </div>

                <button
                    type="button"
                    className="tabla-tarjeta-toggle"
                    onClick={() => setExpandida((actual) => !actual)}
                    aria-expanded={expandida}
                >
                    {expandida ? "Ocultar" : "Ver detalles"}

                    <span className={`tabla-tarjeta-flecha ${expandida ? "abierta" : ""}`}>
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </span>
                </button>
            </div>

            {/* INFORMACIÓN DESPLEGABLE */}
            {expandida && (
                <div className="tabla-tarjeta-detalles">

                    <div className="tabla-tarjeta-contenido">
                        {otrosEncabezados.map((encabezado, indice) => (
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

                    {/* ACCIONES */}
                    {action?.length > 0 && (
                        <div className="tabla-tarjeta-acciones">
                            {action.map((actionItem, indice) => (
                                <button
                                    type="button"
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
                </div>
            )}
        </article>
    );
}


/* =========================================
   COMPONENTE TABLE
========================================= */

export default function Table({
    listEncabezados,
    listObjetos,
    action,
    mobileCards = false
}) {

    const encabezados = Object.entries(listEncabezados).map(
        ([nombre, config]) => ({
            nombre: nombre.replaceAll("_", " "),
            ...config,
            atributos: config.nameAtributo
                ? config.nameAtributo.split(".")
                : undefined
        })
    );

    const obtenerValor = (item, atributos) => {
        if (!atributos) return "";

        return atributos.reduce(
            (actual, atributo) => actual?.[atributo],
            item
        ) ?? "";
    };

    const obtenerContenido = (item, encabezado) => {
        if (encabezado.modificacion) {
            return encabezado.modificacion(item);
        }

        return obtenerValor(item, encabezado.atributos);
    };

    const obtenerClase = (item, encabezado) => {
        const clase = encabezado.clase;

        if (!clase) return "";

        return typeof clase === "function"
            ? clase(item)
            : clase;
    };

    // Identificar la columna que se mostrará como resumen.
    const encabezadoPrincipal =
        encabezados.find(
            (encabezado) => encabezado.atributos?.join(".") === "vacante.titulo"
        ) ??
        encabezados[0];

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
                                                    type="button"
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

            {/* LISTA DESPLEGABLE PARA MÓVILES */}
            {mobileCards && (
                <div className="tabla-tarjetas">
                    {listObjetos.map((item, index) => (
                        <TarjetaAcordeon
                            key={item.nPostulacion ?? item.id ?? index}
                            item={item}
                            index={index}
                            encabezados={encabezados}
                            action={action}
                            encabezadoPrincipal={encabezadoPrincipal}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}