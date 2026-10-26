
import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_CLIENT_URL, URL_VIDEO } from "../../services/Api";
import manejarRespuesta from "../../services/ManejarRespuesta";
import { modal, modalRedirect, modalResponse } from "../../services/Modal";
import { ciudadesColombia, departamentoColombia, listAptitudes } from "../../services/data";
import Loading from "../../components/Loading.jsx"
import Layout from "../../layouts/Layout.jsx";
import InputForm from "../../components/InputForm.jsx";
import { formRulesVacante, validateForm } from "../../services/validacionForm";
import { RoleContext } from "../../services/RoleContext";
import { useSendFormV2 } from "../../hooks/useFetch";
import exceptionControl from "../../services/exceptionControl";
import AutocompleteInput from "../../components/AutocompleteInput";


const EditarVacantes= () => {
  const { nvacantes } = useParams();
  const navigate = useNavigate();
  const { logout } = useContext(RoleContext);
  const { data, send, loading } = useSendFormV2();
  const { send:sendEdit } = useSendFormV2();
  const [submitted, setSubmitted] = useState(false);
  const videoRef = useRef(null)
  const maxMB = 7;
  const [eliminarVideo, setEliminarVideo] = useState(false)
  const [previewVideo, setPreviewVideo] = useState(null)
  const [selected, setSelected] = useState([]);
  const [errors, setErrors] = useState({});
  const [cargos, setCargos] = useState([]);
  const [requisitos, setRequisitos] = useState([]);
  const [queryCargo, setQueryCargo] = useState("");
  const [queryRequisito, setQueryRequisito] = useState("");
  const [vacante, setVacante] = useState({
    titulo: '',
    ciudad: '',
    departamento: '',
    tipo: '',
    modalidad: '',
    sueldo: '',
    cargo: '',
    experiencia: '',
    descripcion: '',
    requerimientos: '',
    videoLink: '', 
    aptitudes: [],
    requisitos: []
  });

  const handleVideoChange = (e) => {
  const file = e.target.files[0];

  // Si no seleccionó archivo
  if (!file) {
    setPreviewVideo(null);
    return;
  }

  // Validaciones
  const maxSize = maxMB * 1024 * 1024; // 7MB

  if (file.type !== "video/mp4") {
    setErrors(prev => ({
      ...prev,
      fieldErrorsFrontend: {
        ...prev.fieldErrorsFrontend,
        video: "Solo se permiten videos en formato MP4."
      }
    }));
    e.target.value = "";
    return;
  }

  if (file.size > maxSize) {
    setErrors(prev => ({
      ...prev,
      fieldErrorsFrontend: {
        ...prev.fieldErrorsFrontend,
        video: `El video no puede exceder los ${maxMB} MB.`
      }
    }));
    e.target.value = "";
    return;
  }

  setErrors(prev => ({
    ...prev,
    fieldErrorsFrontend: {
      ...prev.fieldErrorsFrontend,
      video: undefined
    }
  }));

  setEliminarVideo(false);
  const url = URL.createObjectURL(file);
  setPreviewVideo(url);
};


  const handleEliminarVideo = () => {
    setPreviewVideo(null);
    setEliminarVideo(true)
    if (videoRef.current) {
      videoRef.current.value = "";
    }
  };

  const handleClick = (key) => {
    let updated;
    if (selected.includes(key)) {
      updated = selected.filter((item) => item !== key);
    } else if (selected.length < 5) {
      updated = [...selected, key];
    } else {
      modal("Selecciona maximo 5 y minimo 2 aptitudes", "warning");
      return;
    }

    setSelected(updated);

    // Aquí el hijo modifica directamente el estado del padre
    setVacante((prev) => ({
      ...prev,
      aptitudes: updated,
    }));
  };


  useEffect(() => {
    const fetchVacante = async () => {
      try {
        await send(`/api/vacantes/seleccion/${nvacantes}`);
      } catch (error) {
        exceptionControl(error, logout, navigate, "Error al cargar los datos de la vacante")
      } 
    };

    fetchVacante();
  }, [nvacantes]);

  useEffect(() => {
    if(!data) return
    setVacante(data);
    setSelected(data.aptitudes)
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVacante(prev => {
      let updated = { ...prev, [name]: value };
      if (name === "ciudad") {
        updated.departamento = departamentoColombia[value] || "";
      }

      return updated;
    });
  };

  const seleccionaRequisito = (valor) => {
    if (!requisitos.includes(valor) || valor == "" || vacante.requisitos.length >= 5
      || vacante.requisitos.includes(valor)) return;

    setVacante((prev) => ({
      ...prev,
      requisitos: [...prev.requisitos, valor]
    }));

    setQueryRequisito("")
    setRequisitos([])
  }

  const eliminaRequisito = (valor) => {
    if (valor == "" || !vacante.requisitos.includes(valor)) return;

    setVacante((prev) => ({
      ...prev,
      requisitos: prev.requisitos.filter(
        (r) => r !== valor
      )
    }));
  }

  useEffect(() => {
    if (queryCargo.length < 2) {
      setCargos([]);
      return;
    }

    const handler = setTimeout(() => {
      fetch(`${API_CLIENT_URL}/api/cargo/search?nombre=${queryCargo}`)
        .then(res => res.json())
        .then(data => setCargos(data));
    }, 700); 

    return () => clearTimeout(handler);
  }, [queryCargo]);
  
  useEffect(() => {
    if (queryRequisito.length < 2) {
      setCargos([]);
      return;
    }

    const handler = setTimeout(() => {
      fetch(`${API_CLIENT_URL}/api/requisito/search?nombre=${queryRequisito}`)
        .then(res => res.json())
        .then(data => setRequisitos(data));
    }, 700); 

    return () => clearTimeout(handler);
  }, [queryRequisito]);


  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setSubmitted(true)
      // 1. Validar con tus reglas
      let newErrors = validateForm(vacante, formRulesVacante);
      if (vacante.cargo != "" && !cargos.includes(vacante.cargo) && cargos.length > 0) {
        newErrors = { ...newErrors, cargo: "Selecciona una opcion disponible" }
      }
      if (vacante.requisitos.length > 5 || vacante.requisitos.length < 1) {
        newErrors = { ...newErrors, requisitos: "Selecciona maximo 5 y minimo 1 requisito" }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors((prev) => ({ ...prev, fieldErrorsFrontend: newErrors }));

        const firstErrorField = Object.keys(newErrors)[0];
        const el = document.getElementById(firstErrorField);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
        return; // no enviar
      }

      if (selected.length > 5 || selected.length < 2) {
        modal("Selecciona maximo 5 y minimo 2 aptitudes", "warning");
        return
      }

      // 3. Limpiar errores si todo está bien
      setErrors({});
      const fd = new FormData();
      fd.append("vacante", new Blob([JSON.stringify(vacante)], { type: "application/json" }));
      fd.append("eliminarVideo", new Blob([JSON.stringify(eliminarVideo)], { type: "application/json" }));
      if (videoRef.current?.files[0]) {
        fd.append("video", videoRef.current.files[0]);
      }
      
      await sendEdit(`/api/vacantes/edit/${vacante.nvacantes}`, "PUT", fd, null);
      modalRedirect("Vacante actualizada correctamente", "success", "/empresa/listado/vacantes", navigate);
    } catch (error) {
      exceptionControl(error, logout, navigate, "Error al guardar los datos de la vacante")
    }
  };

  if (loading || !vacante) return <Loading/>;

  return (
    <Layout>
      <div className="registro-container">
        <h1 className="registroEmpresa-title">Editar Oferta</h1>
        <p className="subtitle">Modifica los campos necesarios</p>

        <form className="form" onSubmit={handleSubmit}>
          <input type="hidden" name="nvacantes" value={vacante.nvacantes} />

          {/* Primera fila */}
          <div className="form-group">
            <label htmlFor="titulo">Título del Puesto</label>

            <InputForm
              type="text"
              name="titulo"
              value={vacante.titulo}
              placeholder="Título del puesto"
              handleOnChange={handleChange}
              error={errors}           
              rules={formRulesVacante}
              submitted={submitted}  
              maxL={60}
            />
          </div>

          {/* Segunda fila */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ciudad">Ciudad</label>
              <InputForm
                as="select"
                name="ciudad"
                value={vacante.ciudad}
                handleOnChange={handleChange}
                error={errors}
                rules={formRulesVacante}
                submitted={submitted}
              >
                <option value="" disabled>Selecciona tu ciudad</option>
                {ciudadesColombia.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </InputForm>
            </div>

            <div className="form-group">
              <label htmlFor="sueldo">Sueldo</label>
              <InputForm
                type="number"
                name="sueldo"
                value={vacante.sueldo}
                handleOnChange={handleChange}
                error={errors}
                rules={formRulesVacante}
                submitted={submitted} 
                minL={0}
              />
            </div>

            <input type="text" name="departamento" defaultValue={vacante.departamento} hidden />
          </div>

          {/* Tercera fila */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cargo">Cargo</label>
              <AutocompleteInput
                type="text"
                placeholder="Ej: Diseñador UI/UX"
                name="cargo"
                options={cargos}
                value={vacante.cargo}
                error={errors}
                rules={formRulesVacante}
                submitted={submitted}
                compara={true}
                onChange={(e) => {
                  setVacante((prev) => ({ ...prev, cargo: e.target.value }))
                  setQueryCargo(e.target.value)
                }}
                className="search-input-sup"
              />
            </div>

            <div className="form-group">
              <label htmlFor="experiencia">Experiencia</label>
              <InputForm
                type="number"
                name="experiencia"
                value={vacante.experiencia}
                handleOnChange={handleChange}
                error={errors}
                rules={formRulesVacante}
                submitted={submitted} 
                minL={0}
                maxL={2}
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="form-group full-width">
            <label htmlFor="descripcion">Descripción del Puesto</label>

            <InputForm
              as="textarea"
              name="descripcion"
              value={vacante.descripcion}
              handleOnChange={handleChange}
              placeholder="Descripción del puesto"
              rules={formRulesVacante}
              submitted={submitted}
            />
          </div>

          {/* Requisitos */}
          <div className="form-group full-width">
            <label htmlFor="requerimientos">Requisitos del Puesto</label>
            <p className="text-gray-600 text-sm mb-3">
              maximo 5 requistos y minimo 1
            </p>

            <AutocompleteInput
              type="text"
              placeholder="Ej: Java, Python..."
              name="requisitos"
              options={requisitos}
              value={queryRequisito}
              error={errors}
              rules={vacante.requisitos.length > 0 ? null : formRulesVacante}
              submitted={submitted}
              onChange={(e) => {
                setQueryRequisito(e.target.value)
                seleccionaRequisito(e.target.value)
              }}
              className="search-input-sup"
            />

            <div className="flex flex-wrap gap-2 mt-4">
              {vacante.requisitos.map((requisito) => (
                <div
                  key={requisito}
                  className="inline-flex items-center gap-2 px-3 py-2
                   rounded-full border border-blue-200
                   bg-blue-50 text-blue-800"
                >
                  <span className="text-sm font-medium">
                    {requisito}
                  </span>

                  <button
                    type="button"
                    onClick={() => eliminaRequisito(requisito)}
                    aria-label={`Eliminar requisito ${requisito}`}
                    title="Eliminar requisito"
                    className="flex items-center justify-center
                     w-5 h-5 rounded-full
                     text-blue-700 hover:bg-blue-200
                     hover:text-red-600 transition-colors"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <p className="text-gray-500 text-xs mt-2">
              {vacante.requisitos.length} de 5 requisitos seleccionados.
            </p>
          </div>
          
          {/* Requerimientos */}
          <div className="form-group full-width">
            <label htmlFor="requerimientos">Requerimientos del Puesto</label>

            <InputForm
              as="textarea"
              name="requerimientos"
              value={vacante.requerimientos}
              handleOnChange={handleChange}
              placeholder="Requerimientos del puesto"
              rules={formRulesVacante}
              submitted={submitted}
            />
          </div>

          {/* ------------------- Video ------------------- */}
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="videoLink" className="block text-lg font-semibold text-gray-800 mb-1">
                Video de presentación
              </label>

              <p className="text-gray-600 text-sm mb-3">
                Sube un video corto para mejorar la visibilidad de tu vacante.
              </p>

              {/* Caja elegante de recomendaciones */}
              <div className=" border border-blue-200 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-blue-700">Recomendaciones</h3>
                <ol className="list-decimal list-inside mt-2 text-sm text-blue-700 space-y-1">
                  <li>Menos de 1 minuto</li>
                  <li>Presenta los puntos más importantes</li>
                  <li>Se creativo</li>
                </ol>
              </div>

              {/* Vista previa del video */}
              <div className="flex flex-col items-center mb-3">
                {(previewVideo || (!eliminarVideo && vacante?.videoLink)) &&(
                  <video
                    src={
                      previewVideo
                        ? previewVideo
                        : vacante.videoLink
                          ? `${URL_VIDEO}${vacante.videoLink}`
                          : null
                    }
                    className="w-64 h-40 rounded-xl shadow-md object-cover bg-gray-200"
                    controls
                  ></video>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-4 mt-4">

                <label
                  className="cursor-pointer inline-flex flex-row items-center justify-center 
                  gap-2 px-5 py-2.5 rounded-xl 
                  border border-blue-600 text-blue-600 
                  font-semibold text-sm
                  hover:bg-blue-100 active:scale-[0.98]
                  transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 stroke-blue-600 inline-block"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                  </svg>

                  <span className="inline-block leading-none">
                    Subir video
                  </span>

                  <input
                    type="file"
                    name="video"
                    accept="video/mp4"
                    ref={videoRef}
                    className="hidden"
                    onChange={handleVideoChange}
                  />
                </label>

                {/* Botón eliminar */}
                <button
                  type="button"
                  onClick={handleEliminarVideo}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl 
                  bg-gray-200 text-gray-800 text-sm font-medium 
                  shadow hover:bg-gray-300 active:scale-[0.98] 
                  transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Eliminar video
                </button>

              </div>


              <p className="text-sm text-gray-600 mt-2">
                Formato permitido: <strong>MP4</strong> — Máximo <strong>{maxMB}MB</strong>.
              </p>

              {errors?.fieldErrorsFrontend?.video &&<p className="error-text">{errors.fieldErrorsFrontend.video}</p>}
            </div>
          </div>

          {/* Aptitudes */}
          <h2 className="mb-2 text-lg font-semibold">Aptitudes Requeridas</h2>
          <p className="text-lg text-gray-700">Selecciona minimo 2 y maximo 5 aptitude.</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(listAptitudes).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleClick(key)}
                className={`z-[30] px-4 py-2 rounded-2xl border transition-all duration-200 ${selected.includes(key)
                    ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/empresa/listado/vacantes")}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-submit">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

    </Layout>
  );
}
export default EditarVacantes;

