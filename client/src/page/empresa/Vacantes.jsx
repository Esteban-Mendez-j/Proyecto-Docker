import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/Layout.jsx';
import { API_CLIENT_URL, URL_VIDEO } from '../../services/Api';
import { modal, modalResponse } from '../../services/Modal';
import '../../style/invitado/vacantes.css';
import { ciudadesColombia, departamentoColombia, listAptitudes } from '../../services/data';
import InputForm from '../../components/InputForm.jsx';
import { formRulesVacante, validateForm } from '../../services/validacionForm';

export default function CrearVacante() {

  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null)
  const maxMB = 4;
  const [eliminarVideo, setEliminarVideo] = useState(false)
  const [previewVideo, setPreviewVideo] = useState(null)
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
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
    aptitudes: []
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
        video: "Solo se permiten videos en formato MP4."
      }));
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        video: `El video no puede exceder los ${maxMB} MB.`
      }));
      e.target.value = "";
      return;
    }

    setErrors(prev => ({
      ...prev,
      video: undefined
    }));

    setEliminarVideo(false);
    const url = URL.createObjectURL(file);
    setPreviewVideo(url);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      let updated = { ...prev, [name]: value };
      if (name === "ciudad") {
        updated.departamento = departamentoColombia[value] || "";
      }

      return updated;
    });
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
    setFormData((prev) => ({
      ...prev,
      aptitudes: updated,
    }));
  };

  const handleEliminarVideo = () => {
    setPreviewVideo(null);
    setEliminarVideo(true)
    if (videoRef.current) {
      videoRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); 
    const newErrors = validateForm(formData, formRulesVacante);
   
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      const firstErrorField = Object.keys(newErrors)[0];
      const el = document.getElementById(firstErrorField);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
      return; // no enviar
    }

    if(selected.length > 5 || selected.length < 2){
      modal("Selecciona maximo 5 y minimo 2 aptitudes", "warning");
      return
    }

    setErrors({});
    const fd = new FormData();
    fd.append("vacante", new Blob([JSON.stringify(formData)], { type: "application/json" }));

    if (videoRef.current?.files[0]) {
      fd.append("video", videoRef.current.files[0]);
    }

    try {
      const res = await fetch(`${API_CLIENT_URL}/api/vacantes/add`, {
        method: 'POST',
        body: fd,
        credentials: 'include'
      });

      if (res.ok) {
        const redirect =  await modalResponse('Vacante creada con éxito', "success");
        if(redirect){
          navigate("/empresa/listado/vacantes");
        }
      } else {
        modal('Error al crear la vacante', "error");
      }
    } catch (error) {
      console.error(error);
      modal('Error de conexión con el servidor', "error");
    }
  };

  return (
    <Layout >
      <div className="registro-container">
        <h1 className="registroEmpresa-title">Crear Nueva Oferta</h1>
        <p className="subtitle">Complete todos los campos requeridos</p>

        <form className="form" onSubmit={handleSubmit} >

          {/* ------------------- Título ------------------- */}
          <div className="form-group">
            <label htmlFor="titulo">Título del Puesto</label>

            <InputForm
              type="text"
              name="titulo"
              placeholder="Ej: Desarrollador Frontend"
              value={formData.titulo}
              handleOnChange={handleChange}
              error={errors}
              rules={formRulesVacante}
              submitted={submitted} 
            />
          </div>

          {/* ------------------- Ciudad / Sueldo ------------------- */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ciudad">Ciudad</label>
              <InputForm
                as="select"
                name="ciudad"
                value={formData.ciudad}
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
                placeholder="Ej: 3000000"
                value={formData.sueldo}
                handleOnChange={handleChange}
                error={errors}
                rules={formRulesVacante}
                minL={0}
                submitted={submitted} 
              />
            </div>

            <input type="text" name="departamento" hidden value={formData.departamento} />
          </div>

          {/* ------------------- Tipo / Modalidad ------------------- */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipo">Vacante o Práctica</label>
              <InputForm
                as="select"
                name="tipo"
                value={formData.tipo}
                handleOnChange={handleChange}
                error={errors}
                rules={formRulesVacante}
                submitted={submitted}
              >
                <option value="" disabled>Seleccionar</option>
                <option value="Practica">Práctica</option>
                <option value="Vacante">Vacante</option>
              </InputForm>
            </div>

            <div className="form-group">
              <label htmlFor="modalidad">Modalidad</label>
              <InputForm
                as="select"
                name="modalidad"
                value={formData.modalidad}
                handleOnChange={handleChange}
                error={errors}
                rules={formRulesVacante}
                submitted={submitted}
              >
                <option value="" disabled>Seleccionar</option>
                <option value="Presencial">Presencial</option>
                <option value="Remoto">Remoto</option>
                <option value="Hibrido">Híbrido</option>
              </InputForm>
            </div>
          </div>

          {/* ------------------- Cargo / Experiencia ------------------- */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cargo">Cargo</label>

              <InputForm
                type="text"
                name="cargo"
                placeholder="Ej: Diseñador UI/UX"
                value={formData.cargo}
                handleOnChange={handleChange}
                error={errors}
                rules={formRulesVacante}
                submitted={submitted} 
              />
            </div>

            <div className="form-group">
              <label htmlFor="experiencia">Experiencia</label>

              <InputForm
                type="number"
                name="experiencia"
                placeholder="Ej: 2 años"
                value={formData.experiencia}
                handleOnChange={handleChange}
                error={errors}
                rules={formRulesVacante}
                minL={0}
                maxL={99}
                submitted={submitted} 
              />
            </div>
          </div>

          {/* ------------------- Descripción / Requerimientos ------------------- */}
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="descripcion">Descripción del Puesto</label>
              <InputForm
                as="textarea"
                name="descripcion"
                value={formData.descripcion}
                handleOnChange={handleChange}
                placeholder="Descripción del puesto"
                rules={formRulesVacante}
                submitted={submitted}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="requerimientos">Requerimientos del Puesto</label>
              <InputForm
                as="textarea"
                name="requerimientos"
                value={formData.requerimientos}
                handleOnChange={handleChange}
                placeholder="Requerimientos del puesto"
                rules={formRulesVacante}
                submitted={submitted}
              />
            </div>
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
                {(previewVideo && !eliminarVideo) &&(
                  <video
                    src={
                      previewVideo
                        ? previewVideo
                        : formData.videoLink
                          ? `${URL_VIDEO}${formData.videoLink}`
                          : null
                    }
                    className="w-64 h-40 rounded-xl shadow-md object-cover bg-gray-200"
                    controls
                  ></video>
                )}
              </div>

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

              {errors.video &&<p className="error-text">{errors.video}</p>}
            </div>
          </div>


          {/* ------------------- Aptitudes ------------------- */}
          <div className="form-group full-width">
            <h2 className="mb-2 text-lg font-semibold">Aptitudes Requeridas</h2>
              <p className="text-lg text-gray-700">Selecciona minimo 2 y maximo 5 aptitude.</p>
            <div className="flex flex-wrap gap-3 w-full">
              {Object.entries(listAptitudes).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleClick(key)}
                  className={`px-4 py-2 rounded-2xl border transition-all ${selected.includes(key)
                      ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ------------------- Botones ------------------- */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/empresa/listado/vacantes")}
            >
              Cancelar
            </button>

            <button type="submit" className="btn btn-submit">
              Guardar Vacante
            </button>
          </div>

        </form>
      </div>


    </Layout>
  );
}

