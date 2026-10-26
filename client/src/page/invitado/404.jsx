import { Link } from "react-router-dom";
import { useContext } from "react";
import "../../style/invitado/404.css"
import { RoleContext } from "../../services/RoleContext";

export default function NotFound() {

    const {rol} = useContext(RoleContext);

    return(
        <div className="container">
            <div className="error-container">
                <h1 className="error-code">404</h1>
                <h2 className="error-title">Página no encontrada</h2>
                <p className="error-message">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
                <div className="error-actions">
                    <Link to={(rol === "ADMIN" || rol === "SUPER_ADMIN")? "/admin/index":"/"} className="btn btn-primary">Volver al inicio</Link>
                    <Link to={rol == "EMPRESA" ? "/empresa/listado/vacantes":"/empleos"} className="btn btn-outline">
                        {rol == "EMPRESA" ? "Mis Vacantes":"Buscar Empleo"}
                    </Link>
                </div>
            </div>
        </div>
    )
}