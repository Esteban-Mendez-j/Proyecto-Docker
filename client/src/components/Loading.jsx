import "../style/invitado/loading.css"

export default function Loading({ message = "Cargando..." }) {
    return (
        
        <div className="loading-wrapper">
            <div className="spinner"></div>
            <p className="loading-message">{message}</p>
        </div>
        
    );
}
