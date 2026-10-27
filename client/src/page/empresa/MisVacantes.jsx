import Layout from "../../layouts/layout.jsx";
import JobBoard from "../../components/JobBoard.jsx";
import "../../style/invitado/empleos.css";

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

        <JobBoard fetchUrl={`/api/vacantes/listar`} />
      </div>
    </Layout>
  );
}
