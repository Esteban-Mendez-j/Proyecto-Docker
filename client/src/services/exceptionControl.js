import { modal } from "./Modal";

export default function exceptionControl( error, logout, navigate, defaulMessage="Error inesperado" ) {
    if (!error) return;

    switch (error.code) {
        case "EXPIRED_TOKEN":
            logout("Sesión expirada, inicia nuevamente");
            break;

        case "FORBIDDEN":
            modal("No tienes permisos para esta acción", "warning");
            navigate("/");
            break;

        case "VALIDATION_ERROR":
            modal("Hay errores en los datos enviados", "warning");
            break;

        case "NOT_FOUND":
            modal("Recurso no encontrado", "warning");
            break;

        default:
            modal(error.message || defaulMessage, "error");
    }

}