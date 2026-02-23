import Layout from "../../layouts/Layout";

export default function AdminIndex() {
  return (
    <Layout >
   
      <br/>

      <div className="container px-4 py-6 mx-auto mt-12">
        <div className="flex flex-col gap-6 md:flex-row">

          <div className="flex-1">
            <h1 className="mb-6 text-2xl font-bold">Panel de Administrador</h1>

            <div className="p-6 mb-8 bg-white border border-gray-200 rounded-2xl shadow-md">
              <h2 className="mb-6 text-2xl font-bold text-gray-800">
                📊 Análisis de Datos
              </h2>

              <div className="relative w-full overflow-hidden rounded-xl shadow-inner aspect-video bg-gray-200 hover:shadow-lg transition-shadow">
                <iframe
                  className="absolute inset-0 w-full h-full rounded-xl"
                  title="DataSet SearchJobs"
                  src="https://app.powerbi.com/reportEmbed?reportId=d43e01c8-be69-4531-a446-7a93f4d7189e&autoAuth=true&ctid=9d12bf3f-e4f6-47ab-912f-1a2f0fc48aa4"
                 
                  allowFullScreen={true}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
     
      
    </Layout>
  );
}
