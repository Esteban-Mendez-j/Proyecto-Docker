import Layout from "../layouts/Layout";
import "../style/invitado/loading.css"

export default function Loading({ message = "Cargando..." }) {
    return (
        <Layout>
            <div className="loading-wrapper">
                <div className="spinner"></div>
                <p className="loading-message">{message}</p>
            </div>
        </Layout>
    );
}
