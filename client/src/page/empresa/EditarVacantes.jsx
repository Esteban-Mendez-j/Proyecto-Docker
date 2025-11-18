
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import '../../style/invitado/editarVacantes.css';
import { API_CLIENT_URL } from "../../services/Api";
import manejarRespuesta from "../../services/ManejarRespuesta";
import { modal, modalResponse } from "../../services/Modal";
import { ciudadesColombia, departamentoColombia, listAptitudes } from "../../services/data";
import Loading from "../../components/Loading"
import Layout from "../../layouts/Layout";


const EditarVacantes= () => {
  const { nvacantes } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
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
    if(selected.length > 5 || selected.length < 2){
      modal("Selecciona maximo 5 y minimo 2 aptitudes", "warning");
      return
    }
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
          <form  className="form" onSubmit={handleSubmit}>
            <input type="hidden" name="nvacantes" value={vacante.nvacantes} />

            {/* Primera fila */}
              <div className="form-group">
                <label htmlFor="titulo">Título del Puesto</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={vacante.titulo || ""}
                  onChange={handleChange}
                  required
                />
              </div>

            {/* Segunda fila */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ciudad">Ciudad</label>
                <select value={vacante.ciudad} name="ciudad" className={"w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"} required onChange={handleChange}>
                  <option value={""} disabled>Selecciona tu ciudad</option>
                  {ciudadesColombia.map((ciudad, index) => (
                    <option key={index} value={ciudad} >{ciudad}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="sueldo">Sueldo</label>
                <input
                  type="number"
                  id="sueldo"
                  min={0} 
                  name="sueldo"
                  value={vacante.sueldo || ""}
                  onChange={handleChange}
                />
              </div>
              <input type="text" name="departamento" value={vacante.departamento} hidden />
            </div>

            {/* Fecha de publicación */}
            <input
              type="date"
              name="fechaPublicacion"
              value={vacante.fechaPublicacion?.split("T")[0] || ""}
              readOnly
              hidden
            />

            {/* Tercera fila */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tipo">Vacante o Práctica</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={vacante.tipo || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Seleccionar
                  </option>
                  <option value="Practica">Práctica</option>
                  <option value="Vacante">Vacante</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="modalidad">Modalidad</label>
                <select
                  id="modalidad"
                  name="modalidad"
                  value={vacante.modalidad || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Seleccionar
                  </option>
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
                <input
                  type="text"
                  id="cargo"
                  name="cargo"
                  value={vacante.cargo || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="experiencia">Experiencia</label>
                <input
                  type="number"
                  id="experiencia"
                  name="experiencia"
                  min={0} 
                  max={99}
                  value={vacante.experiencia || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="descripcion">Descripción del Puesto</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={vacante.descripcion || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="requerimientos">Requerimientos del Puesto</label>
                <textarea
                  id="requerimientos"
                  name="requerimientos"
                  value={vacante.requerimientos || ""}
                  onChange={handleChange}
                  required
                />
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
                value={vacante.videoLink || ""}
                onChange={handleChange}
              />
            </div>
          </div>


            <div>
              <h2 className="mb-2 text-lg font-semibold">Aptitudes Requeridas</h2>
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
