
import VacantesActivas from "../../components/VacantesActivas";
import Layout from "../../layouts/Layout";

export default function AdminVacantes() {
  return (
    <Layout title="Gestión de Vacantes | SearchJobs">
  
      <br />
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1">
            <VacantesActivas />
          </div>
        </div>
      </div>
      <style jsx>{`
        .tab-button.active {
          border-bottom-width: 2px;
        }
      `}</style>
    </Layout>
  );
}
