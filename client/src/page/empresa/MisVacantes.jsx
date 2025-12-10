import Layout from "../../layouts/Layout";
import JobBoard from "../../components/JobBoard";
import "../../style/invitado/empleos.css";
import { API_CLIENT_URL } from "../../services/Api";

export default function ListadoVacantes() {
  return (
    <Layout >
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Encuentra tu próximo empleo</h1>
          <p className="page-description">
            Explora todas las oportunidades laborales disponibles
          </p>
        </div>

        <JobBoard fetchUrl={`${API_CLIENT_URL}/api/vacantes/listar`} />
      </div>
    </Layout>
  );
}
