import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputForm from "../../components/InputForm.jsx";
import Loading from "../../components/Loading.jsx";
import { useFetch, useSendForm } from "../../hooks/useFetch";
import Layout from "../../layouts/Layout.jsx";
import { API_CLIENT_URL } from "../../services/Api";
import { modal, modalResponse } from "../../services/Modal";
import "../../style/invitado/candidato.css";

const tmpId = () => crypto.randomUUID();

const PerfilCandidatoEditar = () => {

  //TODO: Implementar el resto de niveles de educacion 
  const listEducacion=[
    "Tecnico",
    "Doctorado",

  ]

  const listAptitudes = {
    PensamientoCritico: "Pensamiento Critico",
    Creatividad: "Creatividad" ,
    AtencionDetalle: "Atencion al detalle",
    AprendizajeContinuo: "Aprendizaje continuo",
    EticaProfesional: "Etica Profesional",
    Autonomia: "Autonomia", 
    Responsabilidad: "Responsabilidad", 
    Liderazgo: "Liderazgo", 
    ResolucionProblemas: "Resolucion de Problemas",
    ComunicacionAfectiva: "Comunicacion Afectiva",
    TrabajoEquipo: "Trabajo en Equipo",
  }

  const initialData = {
    apellido: "",
    comentarioAdmin: null,
    contrasena: "",
    correo: "",
    curriculo: "",
    descripcion: "",
    experiencia: "",
    fechaInicioSesion: "",
    fechaRegistro: "",
    idUsuario: null,
    identificacion: "",
    imagen: null,
    isActive: true,
    nombre: "",
    rolPrinciapl: "",
    roles: [],
    telefono: "",
    nivelEducativo:"",
    aptitudes: []
  }

  const initialDataEstudios = {
    academia: "",
    idEstudio: "",
    idUsuario: "",
    titulo: ""
  }
  const initialDataHistorial = {
    academia: "",
    idEstudio: "",
    idUsuario: "",
    titulo: ""
  }
  const navigate = useNavigate()
  const { data, loading } = useFetch("/api/candidatos/perfil", "GET");
  const { error, send } = useSendForm();
  const [selected, setSelected] = useState([]);
  const [candidato, setCandidato] = useState(initialData);
  const [estudios, setEstudios] = useState([]);
  const [historialLaboral, setHistorial] = useState([]);
  const [previewImg, setPreviewImg] = useState(null);

  const handleClick = (key) => {
    let updated;
    if (selected.includes(key)) {
      updated = selected.filter((item) => item !== key);
    } else if (selected.length < 5) {
      updated = [...selected, key];
    } else {
      modal("Solo puedes seleccionar hasta 5 aptitudes", "error");
      return;
    }

    setSelected(updated);

    // Aquí el hijo modifica directamente el estado del padre
    setCandidato((prev) => ({
      ...prev,
      aptitudes: updated,
    }));
  };

  /* refs archivos --------------------------------- */
  const fotoRef = useRef(null);
  const cvRef = useRef(null);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setCandidato(prev => ({
      ...prev,
      [name]: value
    }));
  };
  /* CARGA PERFIL ---------------------------------- */
  useEffect(() => {
    if (!data) { return }
    setCandidato(data.candidato);
    setEstudios((data.estudios).map((e) => ({ ...e, _tmpId: tmpId() })));
    setHistorial((data.historialLaboral).map((h) => ({ ...h, _tmpId: tmpId() })));
    setSelected(data.candidato.aptitudes)
  }, [data]);

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
      { _tmpId: tmpId(), idEstudio: null, titulo: "", academia: "", idUsuario: candidato.idUsuario },
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
        idUsuario: candidato.idUsuario
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
    const estudiosEnviar = estudios.map(({ _tmpId, ...rest }) => rest);
    const historialEnviar = historialLaboral.map(({ _tmpId, ...rest }) => rest);

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
        const mensajeEst = (!respEst.ok ? (await respEst.json().catch(() => ({}))).mensaje : "") || "";
        const mensajeHist = (!respHist.ok ? (await respHist.json().catch(() => ({}))).mensaje : "") || "";
        throw new Error(`${mensajeEst} ${mensajeHist}`.trim() || "Error al actualizar datos");
      }


      const formData = new FormData(e.target);
      formData.set(
        "candidato",
        new Blob([JSON.stringify(candidato)], { type: "application/json" })
      );
      if (cvRef.current?.files[0]) {
        formData.append("pdf", cvRef.current.files[0]);
      }

      if (fotoRef.current?.files[0]) {
        formData.append("img", fotoRef.current.files[0]);
      }

      const result = await send(`/api/candidatos/edit/${candidato.idUsuario}`, "PUT", formData, null)

      if (result.status === 201 || result.status == 200) {
        const isOk = await modalResponse(result.mensaje, "success");
        if (isOk) {
          navigate("/perfil/candidato");
          return
        }
      }

      modal("Error al actualizar tu perfil", "error")
      /* ----------- 5. Éxito global ------------ */
    } catch (err) {
      console.error(err);
      modal(err.message || "Ocurrió un error actualizando tu perfil", "error")
    }
  };


  /* ---- RENDER ----------------------------------- */
  if (loading) return <Loading />;




  return (
    <Layout >
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
                  <InputForm
                    type={"text"}
                    name={"nombre"}
                    placeholder={"Ingresa tu nombre completo"}
                    value={candidato.nombre}
                    handleOnChange={handleOnChange}
                    error={error}
                    className={"w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "}
                  />
                </div>

                {/* --- Apellido --- */}
                <div className="flex flex-col w-full md:w-1/2">
                  <label htmlFor="apellido" className="mb-1 text-sm font-medium">
                    Apellido
                  </label>
                  <InputForm
                    type={"text"}
                    name={"apellido"}
                    placeholder={"Ingresa tu apellido completo"}
                    value={candidato.apellido}
                    handleOnChange={handleOnChange}
                    error={error}
                    className={"w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "}
                  />
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-col gap-4 md:flex-row">
                  {/* --- Nivel Educativo --- */}
                  <div className="flex flex-col w-full md:w-1/2">
                    <label htmlFor="nivelEducativo" className="mb-1 text-sm font-medium">
                      Nivel Educativo
                    </label>
                    <select value={candidato.nivelEducativo} name="nivelEducativo" className={"w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"} required onChange={handleOnChange}>
                      <option value={""} disabled>Selecciona tu nivel educativo</option>
                      {listEducacion.map((nivel, index) => (
                        <option key={index} value={nivel} >{nivel}</option>
                      ))}
                    </select>
                  </div>
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
              <InputForm
                type={"email"}
                name={"correo"}
                placeholder={"Ingresa tu correo"}
                value={candidato.correo}
                handleOnChange={handleOnChange}
                error={error}
                className={"w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "}
              />
            </div>

            {/* --- Teléfono --- */}
            <div className="flex flex-col w-full">
              <label htmlFor="telefono" className="mb-1 text-sm font-medium">
                Teléfono
              </label>
              <InputForm
                type={"number"}
                name={"telefono"}
                placeholder={"Ingresa tu telefono completo"}
                value={candidato.telefono}
                handleOnChange={handleOnChange}
                error={error}
                className={"w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            {/* --- Identificación --- */}
            <div className="flex flex-col w-full md:w-1/2">
              <label className="mb-1 text-sm font-medium">Identificación</label>
              <InputForm
                type={"number"}
                name={"identificacion"}
                placeholder={"Ingresa tu identificacion completo"}
                value={candidato.identificacion}
                handleOnChange={handleOnChange}
                error={error}
                className={"w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "}
              />
            </div>

            {/* --- Experiencia --- */}
            <div className="flex flex-col w-full md:w-1/2">
              <label className="mb-1 text-sm font-medium">Años de experiencia laboral</label>
              <InputForm
                type={"number"}
                name={"experiencia"}
                placeholder={"Años de experiencia"}
                value={candidato.experiencia}
                handleOnChange={handleOnChange}
                error={error}
                className={"w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "}
              />
            </div>
          </div>

          {/* ---------- DESCRIPCIÓN ---------- */}
          <div>
            <h2 className="mb-2 text-lg font-semibold">Descripción</h2>
            <textarea
              className="h-32 w-full resize-none rounded-2xl border border-gray-300 p-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              placeholder="Cuéntanos sobre ti, tus habilidades y experiencia…"
              value={candidato.descripcion}
              name="descripcion"
              onChange={handleOnChange}
              required
            />
            {error?.descripcion && <p className="error-text" id="error-descripcion">{error.descripcion}</p>}
          </div>

          {/* ---------- Aptitudes ---------- */}

          <div>
            <h2 className="mb-2 text-lg font-semibold">Aptitudes</h2>

            <div className="flex flex-wrap gap-3">
              {Object.entries(listAptitudes).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleClick(key)}
                  className={`px-4 py-2 rounded-2xl border transition-all duration-200 ${selected.includes(key)
                      ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Si quieres mostrar errores de validación */}
            {/* {error?.aptitudes && (
        <p className="error-text hidden" id="error-descripcion">
          {error.aptitudes}
        </p>
      )} */}
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
              onClick={() => navigate(-1)}
              className="rounded-full bg-gray-400 px-8 py-3 text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default PerfilCandidatoEditar;
