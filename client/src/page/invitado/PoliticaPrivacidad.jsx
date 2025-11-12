export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] px-6 md:px-20 py-16">
      <div className="max-w-4xl mx-auto bg-[var(--background-alt)] p-8 rounded-[var(--radius)] shadow-md">
        <h1 className="text-3xl font-bold text-[var(--primary-dark)] mb-6">
          Política de Privacidad
        </h1>
        <p className="text-[var(--text-light)] mb-8">
          Última actualización: Octubre 2025
        </p>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-2">
              1. Introducción
            </h2>
            <p>
              En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, 
              esta Política de Privacidad explica cómo recopilamos, usamos, almacenamos y protegemos los datos personales de nuestros usuarios.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-2">
              2. Datos que recopilamos
            </h2>
            <p>
              Podemos recopilar información personal como nombres, correos electrónicos, documentos de identidad, información laboral y de contacto, necesaria para la prestación de nuestros servicios.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-2">
              3. Finalidad del tratamiento
            </h2>
            <p>
              Los datos personales serán tratados con el propósito de facilitar procesos de empleo, comunicación entre empresas y candidatos, y mejorar la experiencia dentro de la plataforma.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-2">
              4. Derechos del titular
            </h2>
            <p>
              Los titulares de los datos tienen derecho a conocer, actualizar, rectificar y eliminar su información, así como a revocar la autorización otorgada para su tratamiento, de acuerdo con la Ley 1581 de 2012.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-2">
              5. Medidas de seguridad
            </h2>
            <p>
              Implementamos medidas técnicas, administrativas y físicas razonables para proteger la información personal contra pérdida, acceso no autorizado o uso indebido.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-2">
              6. Contacto
            </h2>
            <p>
              Para ejercer sus derechos o realizar consultas sobre el tratamiento de datos personales, puede comunicarse al correo:{" "}
              <a
                href="mailto:privacidad@searchjobs.co"
                className="text-[var(--primary)] underline"
              >
                privacidad@searchjobs.co
              </a>
            </p>
          </div>
        </section>

        <div className="mt-10 text-sm text-[var(--text-light)]">
          <p>
            Esta política puede ser actualizada periódicamente. Se recomienda revisarla de forma regular para mantenerse informado sobre cómo protegemos su información.
          </p>
        </div>
      </div>
    </div>
  );
}
