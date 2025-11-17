import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import { API_CLIENT_URL } from '../../services/Api';
import { modal, modalResponse } from '../../services/Modal';
import '../../style/invitado/vacantes.css';
import { ciudadesColombia, departamentoColombia, listAptitudes } from '../../services/data';

export default function CrearVacante() {

  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClick = (key) => {
    let updated;
    if (selected.includes(key)) {
      updated = selected.filter((item) => item !== key);
    } else if (selected.length <= 5) {
      updated = [...selected, key];
    } else {
      modal("Solo puedes seleccionar hasta 5 aptitudes", "error");
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
    <Layout title="Crear Nueva Oferta">
      

      <div className="registro-container">
        <h1 className="registroEmpresa-title">Crear Nueva Oferta</h1>
        <p className="subtitle">Complete todos los campos requeridos</p>

        <form className="form" onSubmit={handleSubmit}>
          {/* Primera fila */}
          
            <div className="form-group">
              <label htmlFor="titulo">Título del Puesto</label>
              <input type="text" id="titulo" name="titulo" placeholder="Ej: Desarrollador Frontend"
                value={formData.titulo} onChange={handleChange} required />
            </div>

          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ciudad">Ciudad</label>
              <select value={formData.ciudad} name="ciudad" className={"w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"} required onChange={handleChange}>
                <option value={""} disabled>Selecciona tu ciudad</option>
                {ciudadesColombia.map((ciudad, index) => (
                  <option key={index} value={ciudad} >{ciudad}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="sueldo">Sueldo</label>
              <input type="number" id="sueldo" name="sueldo" placeholder="Ej: 3000000" step="0.01"
                value={formData.sueldo} onChange={handleChange} />
            </div>
            <input type="text" name="departamento" value={departamentoColombia[formData.ciudad]} required hidden />
          </div>

          {/* Tercera fila */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipo">Vacante o Práctica</label>
              <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange} required>
                <option value="" disabled>Seleccionar</option>
                <option value="Practica">Práctica</option>
                <option value="Vacante">Vacante</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="modalidad">Modalidad</label>
              <select id="modalidad" name="modalidad" value={formData.modalidad} onChange={handleChange} required>
                <option value="" disabled>Seleccionar</option>
                <option value="Presencial">Presencial</option>
                <option value="Remoto">Remoto</option>
                <option value="Hibrido">Híbrido</option>
              </select>
            </div>
          </div>

          {/* Cuarta fila */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cargo">Cargo</label>
              <input type="text" id="cargo" name="cargo" placeholder="Ej: Diseñador UI/UX"
                value={formData.cargo} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="experiencia">Experiencia</label>
              <input type="text" id="experiencia" name="experiencia" placeholder="Ej: 2 años en desarrollo web"
                value={formData.experiencia} onChange={handleChange} />
            </div>
          </div>

          {/* Descripción */}
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="descripcion">Descripción del Puesto</label>
              <textarea id="descripcion" name="descripcion"
                value={formData.descripcion} onChange={handleChange} required />
            </div>
            <div className="form-group full-width">
              <label htmlFor="requerimientos">Requerimientos del Puesto</label>
              <textarea id="requerimientos" name="requerimientos"
                value={formData.requerimientos} onChange={handleChange} required />
            </div>
          </div>
        <div className="form-row">
        <div className="form-group full-width">
          <label htmlFor="videoLink">Link del video de presentación</label>
          <input
          type="text"
          id="videoLink"
          name="videoLink"
          placeholder="https://youtu.be/..."
          value={formData.videoLink || ""}
          onChange={handleChange}
        />
        </div>
      </div>


          {/* ---------- Aptitudes ---------- */}
          <div className='form-group full-width"'>
            <h2 className="mb-2 text-lg font-semibold">Aptitudes Requeridas</h2>

            <div className="flex flex-wrap gap-3 w-full">
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
            <button type="submit" className="btn btn-submit">guardar vacantes </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

