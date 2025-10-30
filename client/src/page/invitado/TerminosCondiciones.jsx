
export default function TerminosCondiciones() {
  return (

    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] px-6 md:px-20 py-16">
      <div className="max-w-4xl mx-auto bg-[var(--background-alt)] p-8 rounded-[var(--radius)] shadow-md">
        <h1 className="text-3xl font-bold text-[var(--primary-dark)] mb-6">
          Términos y Condiciones de Uso
        </h1>
        <p className="text-[var(--text-light)] mb-8">
          Última actualización: Octubre 2025
        </p>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-2">
              1. Aceptación de los términos
            </h2>
            <p>
              Al acceder y utilizar este sitio web, el usuario acepta los presentes Términos y Condiciones. 
              Si no está de acuerdo con alguno de los puntos aquí descritos, se recomienda no utilizar nuestros servicios.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-2">
              2. Objeto del sitio
            </h2>
            <p>
              Este portal tiene como finalidad ofrecer una plataforma digital que conecta empresas con candidatos para facilitar procesos de selección y búsqueda de empleo. 
              Los servicios están dirigidos a usuarios mayores de 18 años y se deben utilizar conforme a la legislación colombiana.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-2">
              3. Responsabilidad del usuario
            </h2>
            <p>
              El usuario se compromete a proporcionar información veraz y actualizada, y a hacer uso adecuado del sitio sin afectar los derechos de terceros ni realizar actividades ilícitas.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-2">
              4. Propiedad intelectual
            </h2>
            <p>
              Todo el contenido de este sitio, incluyendo textos, gráficos, logotipos, iconos, y software, es propiedad exclusiva del desarrollador o de sus respectivos autores, y está protegido por la legislación colombiana e internacional sobre derechos de autor.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-2">
              5. Modificaciones
            </h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones serán publicadas en esta misma página y entrarán en vigor de inmediato.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-2">
              6. Legislación aplicable
            </h2>
            <p>
              Este documento se rige por las leyes de la República de Colombia, especialmente por las disposiciones del Código de Comercio y la Ley 527 de 1999 sobre mensajes de datos y comercio electrónico.
            </p>
          </div>
        </section>

        <div className="mt-10 text-sm text-[var(--text-light)]">
          <p>
            Si tienes preguntas sobre estos Términos y Condiciones, puedes escribirnos al correo:{" "}
            <a
              href="mailto:soporte@searchjobs.co"
              className="text-[var(--primary)] underline"
            >
              soporte@searchjobs.co
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
