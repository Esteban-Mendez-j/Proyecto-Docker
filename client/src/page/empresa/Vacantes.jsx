import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import { API_CLIENT_URL } from '../../services/Api';
import { modal, modalResponse } from '../../services/Modal';
import '../../style/invitado/vacantes.css';
import { ciudadesColombia, departamentoColombia, listAptitudes } from '../../services/data';
import InputForm from '../../components/InputForm';
import { formRulesVacante, validateForm } from '../../services/validacionForm';

export default function CrearVacante() {

  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
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
    try {
      const res = await fetch(`${API_CLIENT_URL}/api/vacantes/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
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
              <label htmlFor="videoLink">Link del video de presentación</label>

              <InputForm
                type="url"
                name="videoLink"
                placeholder="https://youtu.be/..."
                value={formData.videoLink || ""}
                handleOnChange={handleChange}
                error={errors}
                rules={formRulesVacante}
                submitted={submitted}
              />
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

