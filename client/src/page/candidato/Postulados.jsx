import Layout from "../../layouts/Layout.jsx"; // en React ya no es .astro

import Postulaciones from "../../components/Postulaciones.jsx";
import "../../style/invitado/empleos.css";
import "../../style/invitado/postulados.css";

export default function PostuladosPage() {
  return (

    
    <Layout title="Postulaciones | SearchJobs">
      <section className="pagina">
        <h1>Postulaciones</h1>
        <p>Lista de Vacantes a las que aplicaste</p>

        <Postulaciones />
      </section>

  
    </Layout>
  );
}
