import VacantesFavoritas from "../../components/VacantesFavoritas.jsx";
import Layout from "../../layouts/Layout.jsx";
import "../../style/invitado/empleos.css";

function VacantesFav() {
  return (
    <Layout>

      {/* Contenido principal */}
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Encuentra tu próximo empleo</h1>
          <p className="page-description">
            Explora todas las oportunidades laborales disponibles
          </p>
        </div>

        
        <VacantesFavoritas
         
        />
      </div>
    </Layout>

  );
}
export default VacantesFav;