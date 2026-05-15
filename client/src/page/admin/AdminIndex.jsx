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
                <iframe title="DataSet SearchJobs" 
                  className="absolute inset-0 w-full h-full rounded-xl" 
                  src="https://app.powerbi.com/view?r=eyJrIjoiY2M5MDI2MTktODA2NS00NjRiLWIzZjUtYjAxZmUyNTU5YTU2IiwidCI6IjlkMTJiZjNmLWU0ZjYtNDdhYi05MTJmLTFhMmYwZmM0OGFhNCIsImMiOjR9" 
                  frameborder="0" allowFullScreen="true"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
     
      
    </Layout>
  );
}
