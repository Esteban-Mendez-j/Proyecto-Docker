
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import '../../style/invitado/editarVacantes.css';
import { API_CLIENT_URL } from "../../services/Api";
import manejarRespuesta from "../../services/ManejarRespuesta";
import { modal, modalResponse } from "../../services/Modal";
import { ciudadesColombia, departamentoColombia, listAptitudes } from "../../services/data";
import Loading from "../../components/Loading"
import Layout from "../../layouts/Layout";
import InputForm from "../../components/InputForm";
import { formRulesVacante, validateForm } from "../../services/validacionForm";


const EditarVacantes= () => {
  const { nvacantes } = useParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState([]);
  const [errors, setErrors] = useState({});
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
    aptitudes: []
  });
  const [loading, setLoading] = useState(true);

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
        const res = await fetch(`${API_CLIENT_URL}/api/vacantes/seleccion/${nvacantes}`);
        const data = await manejarRespuesta(res);
        setVacante(data.vacanteSeleccionada);
        setSelected(data.vacanteSeleccionada.aptitudes || [])
      } catch (error) {
        console.error("Error cargando la vacante:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacante();
  }, [nvacantes]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true)
    // 1. Validar con tus reglas
    const newErrors = validateForm(vacante, formRulesVacante);

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

    // 3. Limpiar errores si todo está bien
    setErrors({});
    
    try {
      const res = await fetch(`${API_CLIENT_URL}/api/vacantes/edit/${vacante.nvacantes}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vacante),
      });

      if (!res.ok) throw new Error("Error al guardar los cambios");

      const ok = modalResponse("Vacante actualizada correctamente", "success");
      if (ok) {
        navigate("/empresa/listado/vacantes");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      modal("No se pudo guardar la vacante", "error");
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

            <input type="text" name="departamento" value={vacante.departamento} hidden />
          </div>

          {/* Tercera fila */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cargo">Cargo</label>
              <InputForm
                type="text"
                name="cargo"
                value={vacante.cargo}
                handleOnChange={handleChange}
                error={errors}
                rules={formRulesVacante}
                submitted={submitted} 
                maxL={40}
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

