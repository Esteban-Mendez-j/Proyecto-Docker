import { Link } from "react-router-dom";
import Layout from "../../layouts/layout";
import "../../style/invitado/404.css"

export default function NotFound() {

    return(
        <div className="container">
            <div className="error-container">
                <h1 className="error-code">404</h1>
                <h2 className="error-title">Página no encontrada</h2>
                <p className="error-message">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
                <div className="error-actions">
                    <Link to="/" className="btn btn-primary">Volver al inicio</Link>
                    <Link to="/empleos" className="btn btn-outline">Ver empleos</Link>
                </div>
            </div>
        </div>
    )
}