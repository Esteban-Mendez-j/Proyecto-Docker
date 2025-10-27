import { useState } from 'react';
import Layout from '../../layouts/Layout';
import { API_CLIENT_URL } from '../../services/Api';
import { modal } from '../../services/Modal';
import '../../style/invitado/vacantes.css';

export default function CrearVacante() {

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

  const [selected, setSelected] = useState([]);
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
    } else if (selected.length < 5) {
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
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('Vacante creada con éxito');
        // redirigir
        window.location.href = '/empleos/listadoVacantes';
      } else {
        alert('Error al crear la vacante');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <Layout title="Crear Nueva Oferta">
      

      <div className="vacante-form-container">
        <h1 className="vacante-form-title">Crear Nueva Oferta</h1>
        <p className="vacante-form-subtitle">Complete todos los campos requeridos</p>

        <form className="vacante-form" onSubmit={handleSubmit}>
          {/* Primera fila */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="titulo">Título del Puesto</label>
              <input type="text" id="titulo" name="titulo" placeholder="Ej: Desarrollador Frontend"
                value={formData.titulo} onChange={handleChange} required />
            </div>
          </div>

          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ciudad">Ciudad</label>
              <input type="text" id="ciudad" name="ciudad" placeholder="Ciudad"
                value={formData.ciudad} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="departamento">Departamento</label>
              <input type="text" id="departamento" name="departamento" placeholder="Ej: Bolívar"
                value={formData.departamento} onChange={handleChange} required />
            </div>
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
            <div className="form-group">
              <label htmlFor="sueldo">Sueldo</label>
              <input type="number" id="sueldo" name="sueldo" placeholder="Ej: 3000000" step="0.01"
                value={formData.sueldo} onChange={handleChange} />
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
                      {/* ---------- Aptitudes ---------- */}
          <div>
            <h2 className="mb-2 text-lg font-semibold">Aptitudes Requeridas</h2>

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
            </div>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <a href="/empleos/listadoVacantes" className="btn btn-cancel">Cancelar</a>
            <button type="submit" className="btn btn-submit">guardar vacantes </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

