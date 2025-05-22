

/* HistorialYEstudios.jsx */
/* HistorialYEstudios.jsx */
import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import { API_CLIENT_URL } from "../javascripts/Api";
import { manejarFormulario } from "../javascripts/MensajeErrorFrom";

/* ------------ util ------------------------------ */
const tmpId = () => crypto.randomUUID();

export default function HistorialYEstudios() {
  /* ESTADO ---------------------------------------- */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [candidato, setCandidato] = useState({});
  const [estudios, setEstudios] = useState([]);
  const [historialLaboral, setHistorial] = useState([]);

  /* PREVIEW IMAGEN ------------------------------- */
  const [previewImg, setPreviewImg] = useState(null);

  /* refs archivos --------------------------------- */
  const fotoRef = useRef(null);
  const cvRef = useRef(null);

  /* CARGA PERFIL ---------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_CLIENT_URL}/api/candidatos/perfil`, {
          credentials: "include",
        });
        const data = await res.json();

        setCandidato(data.candidato || {});
        setEstudios((data.estudios || []).map((e) => ({ ...e, _tmpId: tmpId() })));
        setHistorial((data.historialLaboral || []).map((h) => ({ ...h, _tmpId: tmpId() })));
      } catch {
        setError("Error al obtener perfil");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* Manejar cambio de imagen para mostrar preview */
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Crear URL para preview
      const url = URL.createObjectURL(file);
      setPreviewImg(url);
    } else {
      // Si no hay archivo, eliminar preview
      setPreviewImg(null);
    }
  };

  /* ---- CRUD Estudios ---------------------------- */
  const agregarEstudio = () =>
    setEstudios([
      ...estudios,
      { _tmpId: tmpId(), idEstudio: null, titulo: "", academia: "", idUsuario:candidato.idUsuario },
    ]);

  const eliminarEstudio = (id) =>
    setEstudios(estudios.filter((e) => (e.idEstudio ?? e._tmpId) !== id));

  const actualizarEstudio = (id, campo, valor) =>
    setEstudios(
      estudios.map((e) =>
        (e.idEstudio ?? e._tmpId) === id ? { ...e, [campo]: valor } : e
      )
    );

  /* ---- CRUD Historial laboral ------------------- */
  const agregarHistorial = () =>
    setHistorial([
      ...historialLaboral,
      {
        _tmpId: tmpId(),
        idHistorial: null,
        titulo: "",
        empresa: "",
        idUsuario:candidato.idUsuario
      },
    ]);

  const eliminarHistorial = (id) =>
    setHistorial(
      historialLaboral.filter((h) => (h.idHistorial ?? h._tmpId) !== id)
    );

  const actualizarHistorial = (id, campo, valor) =>
    setHistorial(
      historialLaboral.map((h) =>
        (h.idHistorial ?? h._tmpId) === id ? { ...h, [campo]: valor } : h
      )
    );

  /* ------------ SUBMIT --------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    /* ----------- 2. Preparar payloads ------------ */
    const estudiosEnviar   = estudios.map(({ _tmpId, ...rest }) => rest);
    const historialEnviar  = historialLaboral.map(({ _tmpId, ...rest }) => rest);

    /* ----------- 3. Enviar estudios e historial en paralelo ------------ */
    try {
      const [respEst, respHist] = await Promise.all([
        fetch(`${API_CLIENT_URL}/api/estudios/replace/${candidato.idUsuario}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(estudiosEnviar),
          credentials: "include",
        }),
        fetch(`${API_CLIENT_URL}/api/historialLaborals/replace/${candidato.idUsuario}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(historialEnviar),
          credentials: "include",
        }),
      ]);

      /* ----------- 4. Comprobar respuestas ------------ */
      if (!respEst.ok || !respHist.ok) {
        // leer mensajes de error si existen
        const mensajeEst  = (!respEst.ok  ? (await respEst.json().catch(() => ({}))).mensaje  : "") || "";
        const mensajeHist = (!respHist.ok ? (await respHist.json().catch(() => ({}))).mensaje : "") || "";
        throw new Error(`${mensajeEst} ${mensajeHist}`.trim() || "Error al actualizar datos");
      }

      await manejarFormulario({
        form: e.target,
        validateForm: () =>
          !!candidato.nombre && !!candidato.apellido && !!candidato.correo && !!cvRef,
        buildData: (fd) => {
          fd.set(
            "candidato",
            new Blob(
              [
                JSON.stringify({
                  ...candidato,
                  idUsuario: candidato.idUsuario,
                }),
              ],
              { type: "application/json" }
            )
          );
          return fd;
        },
        endpointUrl: `${API_CLIENT_URL}/api/candidatos/edit/${candidato.idUsuario}`,
        redirectUrl: "/perfil/candidato",         // ya redirigiremos al final
        metodo: "PUT",
        tipo: "multipart/form-data",
      });


      /* ----------- 5. Éxito global ------------ */
      
      

    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        text: err.message || "Ocurrió un error actualizando tu perfil",
      });
    }
  };


  /* ---- RENDER ----------------------------------- */
  if (loading) return <p className="p-8 text-center">Cargando…</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

  return (
    <div className="mx-auto max-w-4xl p-4">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-8 rounded-2xl bg-white p-6 shadow-lg"
      >
        {/* ---------- HEADER ---------- */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {/* Foto */}
          <div className="flex flex-col items-center gap-3 md:w-1/3">
            <img
              src={
                previewImg
                  ? previewImg
                  : candidato.imagen
                  ? `${API_CLIENT_URL}/img/${candidato.imagen}`
                  : `${API_CLIENT_URL}/images/imgCandidato.png`
              }
              alt="avatar"
              className="h-32 w-32 rounded-full object-cover shadow"
            />
            <label className="cursor-pointer text-sm font-medium text-primary-600 hover:underline">
              Cambiar foto
              <input
                type="file"
                name="img"
                accept="image/*"
                ref={fotoRef}
                className="hidden"
                onChange={handleFotoChange}
              />
            </label>
            <p className="error-text hidden" id="error-imagen"></p>
          </div>

         {/* Datos principales */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col gap-4 md:flex-row">
              {/* --- Nombre --- */}
              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="nombre" className="mb-1 text-sm font-medium">
                  Nombre
                </label>
                <input
                  id="nombre"
                  placeholder="Nombre"
                  name="nombre"
                  value={candidato.nombre || ""}
                  onChange={(e) =>
                    setCandidato({ ...candidato, nombre: e.target.value })
                  }
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "
                />
                <p id="error-nombre" className="error-text hidden mt-1 text-xs text-red-500" />
              </div>

              {/* --- Apellido --- */}
              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="apellido" className="mb-1 text-sm font-medium">
                  Apellido
                </label>
                <input
                  id="apellido"
                  placeholder="Apellido"
                  name="apellido"
                  value={candidato.apellido || ""}
                  onChange={(e) =>
                    setCandidato({ ...candidato, apellido: e.target.value })
                  }
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "
                />
                <p id="error-apellido" className="error-text hidden mt-1 text-xs text-red-500" />
              </div>

            </div>


            {/* ---- CV uploader ------------------------------------------------ */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center text-sm">
              {/* Botón subir / cambiar */}
              <label className="inline-flex w-max cursor-pointer items-center gap-2 rounded-full bg-blue-500 px-4 py-2 font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                  <polyline points="7 11 12 6 17 11" />
                  <line x1="12" y1="6" x2="12" y2="18" />
                </svg>
                {candidato.curriculo ? 'Cambiar CV' : 'Subir CV'}
                <input
                  type="file"
                  name="pdf"
                  accept="application/pdf"
                  ref={cvRef}
                  className="hidden"
                />
              </label>

              {/* Link para ver CV existente */}
              {candidato.curriculo && (
                <a
                  href={`${API_CLIENT_URL}/pdf/${candidato.curriculo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-max cursor-pointer items-center gap-2 rounded-full bg-blue-500 px-4 py-2 font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 5v14m7-7H5" />
                  </svg>
                  Ver CV
                </a>
              )}

              {/* mensaje de error */}
              <p id="error-curriculo" className="error-text hidden text-xs text-red-500" />
            </div>

          </div>
        </div>

        {/* ---------- CONTACTO ---------- */}
       <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col w-full">
            <label htmlFor="correo" className="mb-1 text-sm font-medium">
              Correo electrónico
            </label>

            <input
              id="correo"
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={candidato.correo || ""}
              onChange={(e) =>
                setCandidato({ ...candidato, correo: e.target.value })
              }
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "
            />

            <p
              id="error-correo"
              className="error-text hidden mt-1 text-xs text-red-500"
            />
          </div>

          {/* --- Teléfono --- */}
          <div className="flex flex-col w-full">
            <label htmlFor="telefono" className="mb-1 text-sm font-medium">
              Teléfono
            </label>

            <input
              id="telefono"
              name="telefono"
              placeholder="Teléfono"
              value={candidato.telefono || ""}
              onChange={(e) =>
                setCandidato({ ...candidato, telefono: e.target.value })
              }
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "
            />

            <p
              id="error-telefono"
              className="error-text hidden mt-1 text-xs text-red-500"
            />
          </div>

        </div>

        <div className="flex flex-col gap-4 md:flex-row">

          {/* --- Identificación --- */}
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-1 text-sm font-medium">Identificación</label>

            <input
              type="number"
              name="identificacion"
              placeholder="Identificación"
              value={candidato.identificacion || ""}
              onChange={(e) =>
                setCandidato({ ...candidato, identificacion: e.target.value })
              }
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "
            />

            <p id="error-identificacion" className="error-text mt-1 text-red-500 text-xs hidden" />
          </div>

          {/* --- Experiencia --- */}
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-1 text-sm font-medium">Años de experiencia laboral</label>

            <input
              type="number"
              min="0"
              name="experiencia"
              placeholder="Años de experiencia"
              value={candidato.experiencia || ""}
              onChange={(e) =>
                setCandidato({ ...candidato, experiencia: e.target.value })
              }
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "
            />

            <p id="error-experiencia" className="error-text mt-1 text-red-500 text-xs hidden" />
          </div>

        </div>



        {/* ---------- DESCRIPCIÓN ---------- */}
        <div>
          <h2 className="mb-2 text-lg font-semibold">Descripción</h2>
          <textarea
            className="h-32 w-full resize-none rounded-2xl border border-gray-300 p-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            placeholder="Cuéntanos sobre ti, tus habilidades y experiencia…"
            value={candidato.descripcion || ""}
            name="descripcion"
            onChange={(e) =>
              setCandidato({ ...candidato, descripcion: e.target.value })
            }
            required
          />
          <p className="error-text hidden" id="error-descripcion"></p>
        </div>

        {/* ---------- ESTUDIOS ---------- */}
        <section>
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Estudios</h2>
            <button
              type="button"
              onClick={agregarEstudio}
              className="btn-primary inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm"
            >
              + Añadir
            </button>
          </header>

          <div className="space-y-4">
            {estudios.length === 0 && (
              <p className="text-sm text-gray-500">
                No tienes estudios registrados.
              </p>
            )}
            {estudios.map((est) => {
              const key = est.idEstudio ?? est._tmpId;
              return (
                <div
                  key={key}
                  className="relative pl-8 before:absolute before:left-3 before:top-2 before:h-3 before:w-3 before:-translate-x-1/2 before:rounded-full before:bg-primary-500"
                >
                  <div className="grid gap-4 md:grid-cols-2">

                    {/* --- Título --- */}
                    <div className="flex flex-col">
                      <label htmlFor={`titulo-${key}`} className="mb-1 text-sm font-medium">
                        Título
                      </label>
                      <input
                        id={`titulo-${key}`}
                        placeholder="Título"
                        name="titulo"
                        value={est.titulo}
                        onChange={(e) => actualizarEstudio(key, 'titulo', e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      />
                      <p id="error-titulo" className="error-text hidden mt-1 text-xs text-red-500" />
                    </div>

                    {/* --- Institución --- */}
                    <div className="flex flex-col">
                      <label htmlFor={`academia-${key}`} className="mb-1 text-sm font-medium">
                        Institución
                      </label>
                      <input
                        id={`academia-${key}`}
                        placeholder="Institución"
                        name="academia"
                        value={est.academia}
                        onChange={(e) => actualizarEstudio(key, 'academia', e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      />
                      <p id="error-academia" className="error-text hidden mt-1 text-xs text-red-500" />
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() => eliminarEstudio(key)}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>

              );
            })}
          </div>
        </section>

        {/* ---------- HISTORIAL LABORAL ---------- */}
        <section>
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Historial laboral</h2>
            <button
              type="button"
              onClick={agregarHistorial}
              className="btn-primary inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm"
            >
              + Añadir
            </button>
          </header>

          <div className="space-y-4">
            {historialLaboral.length === 0 && (
              <p className="text-sm text-gray-500">
                No tienes experiencia laboral registrada.
              </p>
            )}
            {historialLaboral.map((exp) => {
              const key = exp.idHistorial ?? exp._tmpId;
              return (
                <div
                  key={key}
                  className="relative pl-8 before:absolute before:left-3 before:top-2 before:h-3 before:w-3 before:-translate-x-1/2 before:rounded-full before:bg-primary-500"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* --- Cargo --- */}
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">Cargo</label>
                      <input
                        placeholder="Cargo"
                        value={exp.titulo}
                        name="titulo"
                        onChange={(e) => actualizarHistorial(key, 'titulo', e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      />
                    </div>

                    {/* --- Empresa --- */}
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">Empresa</label>
                      <input
                        placeholder="Empresa"
                        value={exp.empresa}
                        onChange={(e) => actualizarHistorial(key, 'empresa', e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => eliminarHistorial(key)}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>

              );
            })}
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="rounded-full bg-blue-500 px-8 py-3 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Guardar
          </button>

          <button
            type="reset"
            onClick={() => (window.location.href = "/perfil/candidato")}
            className="rounded-full bg-gray-400 px-8 py-3 text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}



