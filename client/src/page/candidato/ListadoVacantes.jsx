import JobBoard from "../../components/JobBoard.jsx";
import Layout from "../../layouts/Layout.jsx";
import { API_CLIENT_URL } from "../../services/Api.js";
import "../../style/invitado/empleos.css";

function Empleos() {
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

        {/* JobBoard recibe props */}
        <JobBoard
          fetchUrl={`${API_CLIENT_URL}/api/vacantes/listar/filtradas`}
          rol="candidato"
        />
      </div>
    </Layout>

  );
}

export default Empleos;

