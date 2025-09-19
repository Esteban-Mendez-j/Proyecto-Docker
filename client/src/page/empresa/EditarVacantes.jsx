
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../style/invitado/editarVacantes.css';
import { API_URL, API_CLIENT_URL } from "../../services/Api";

const EditarVacantes= () => {
  const { nvacantes } = useParams();
  const navigate = useNavigate();

  const [vacante, setVacante] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVacante = async () => {
      try {
        const res = await fetch(`${API_URL}/Api/vacantes/seleccion/${nvacantes}`);
        const data = await manejarRespuesta(res);
        setVacante(data.vacanteSeleccionada);
      } catch (error) {
        console.error("Error cargando la vacante:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacante();
  }, [nvacantes]);

  const handleChange = (e) => {
    setVacante({
      ...vacante,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_CLIENT_URL}/Api/vacantes/edit/${vacante.nvacantes}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vacante),
      });

      if (!res.ok) throw new Error("Error al guardar los cambios");

      alert("Vacante actualizada correctamente");
      navigate("/empresa/listado/vacantes");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("No se pudo guardar la vacante");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      
      <div className="vacante-form-container">
        <h1 className="vacante-form-title">Editar Oferta</h1>
        <p className="vacante-form-subtitle">Modifica los campos necesarios</p>

        {vacante ? (
          <form id="vacanteForm" className="vacante-form" onSubmit={handleSubmit}>
            <input type="hidden" name="nvacantes" value={vacante.nvacantes} />

            {/* Primera fila */}
            <div className="form-row">
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
            </div>

            {/* Segunda fila */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ciudad">Ciudad</label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  value={vacante.ciudad || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="departamento">Departamento</label>
                <input
                  type="text"
                  id="departamento"
                  name="departamento"
                  value={vacante.departamento || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Fecha de publicación */}
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="fechaPublicacion">Fecha de Publicación</label>
                <input
                  type="date"
                  id="fechaPublicacion"
                  name="fechaPublicacion"
                  value={vacante.fechaPublicacion?.split("T")[0] || ""}
                  readOnly
                />
              </div>
            </div>

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

              <div className="form-group">
                <label htmlFor="sueldo">Sueldo</label>
                <input
                  type="number"
                  id="sueldo"
                  name="sueldo"
                  value={vacante.sueldo || ""}
                  onChange={handleChange}
                />
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
                  type="text"
                  id="experiencia"
                  name="experiencia"
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

            {/* Botones */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => navigate("/empresa/listado/vacantes")}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-submit">
                Guardar Cambios
              </button>
            </div>
          </form>
        ) : (
          <p>No se pudo cargar la vacante.</p>
        )}
      </div>
      
    </>
  );
};
export default EditarVacantes;
