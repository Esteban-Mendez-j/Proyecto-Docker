import { useContext } from "react";
import { RoleContext } from "../services/RoleContext";

export default function FilterComponent({ filtersLocal, clearAllFilters, handleOnFilters }) {
  
  const { rol } = useContext(RoleContext);

  const handleFavoritoChange = (e)=>{
    const valor = new Boolean(e.target.value);
    e.target = {name:"isFavorita" , value:valor };
    handleOnFilters(e)
  }

  const handleEstadoChange = (e)=>{
    const estadoSeleccionado = e.target.value;

    const nuevoFiltro = {
      estado: estadoSeleccionado,
      active: undefined,
      activaPorEmpresa: undefined
    };

    switch (estadoSeleccionado) {
      case "activas":
        nuevoFiltro.active = true;
        nuevoFiltro.activaPorEmpresa = true;
        break;
      case "desactivadasAdmin":
        nuevoFiltro.active = false;
        break;
      case "pausadasEmpresa":
        nuevoFiltro.activaPorEmpresa = false;
        break;
      case "todas":
        break;
    }
    e.target = {name:"estado" , value:nuevoFiltro.estado };
    handleOnFilters(e)
    e.target = {name:"active" , value:nuevoFiltro.active };
    handleOnFilters(e)
    e.target = {name:"activaPorEmpresa" , value:nuevoFiltro.activaPorEmpresa };
    handleOnFilters(e)
  }
  
  return (
    <div className="filters-container">
      <div className="filter-group">
        <h4 className="filter-group-title">Tipo de empleo</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="tipo"
              value="Vacante"
              onChange={handleOnFilters}
              checked={filtersLocal.tipo === "Vacante"}
            />
            <span>Vacantes</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="tipo"
              value="Practica"
              onChange={handleOnFilters}
              checked={filtersLocal.tipo === "Practica"}
            />
            <span>Practicas</span>
          </label>
        </div>
      </div>

      <div className="filter-group">
        <h4 className="filter-group-title">Experiencia Minima</h4>
        <input
          type="number"
          min={0}
          name="experiencia"
          onChange={handleOnFilters}
          value={filtersLocal.experiencia || ""}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <h4 className="filter-group-title">Sueldo Minimo</h4>
        <input
          type="number"
          name="sueldo"
          min={0}
          onChange={handleOnFilters}
          value={filtersLocal.sueldo || ""}
          className="search-input"
        />
      </div>
      
      <div className="filter-group">
        <h4 className="filter-group-title">Postulados Minimos</h4>
        <input
          type="number"
          min={0}
          name="totalpostulaciones"
          onChange={handleOnFilters}
          value={filtersLocal.totalpostulaciones || ""}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <h4 className="filter-group-title">Modalidad</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="modalidad"
              value="Remoto"
              onChange={handleOnFilters}
              checked={filtersLocal.modalidad === "Remoto"}
            />
            <span>Remoto</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="modalidad"
              value="Presencial"
              onChange={handleOnFilters}
              checked={filtersLocal.modalidad === "Presencial"}
            />
            <span>Presencial</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="modalidad"
              value="Hibrido"
              onChange={handleOnFilters}
              checked={filtersLocal.modalidad === "Hibrido"}
            />
            <span>Híbrido</span>
          </label>
        </div>
      </div>
      {rol === "CANDIDATO" && (
        <>
        <div className="filter-group">
          <h4 className="filter-group-title">Favoritas</h4>
          <select name="isFavorita" value={filtersLocal.isFavorita?.toString() || "false"} onChange={handleFavoritoChange} className="search-input">
            <option value="false">Todas</option>
            <option value="true">Favoritas</option>
          </select>
        </div>

        <div className="filter-group">
          <h4 className="filter-group-title">Estado Postulacion</h4>
          <select name="estadoPostulacion" value={filtersLocal.estadoPostulacion} onChange={handleOnFilters} className="search-input">
            <option value="">Todas</option>
            <option value="SinPostulacion">Sin postular</option>
            <option value="Aceptada">Aceptadas</option>
            <option value="Rechazada">Rechazadas</option>
            <option value="Espera">En Espera</option>
          </select>
        </div>
        </>
      )}

      {rol === "EMPRESA" && (
        <div className="filter-group">
          <h4 className="filter-group-title">Estado</h4>
          <select name="estado" value={filtersLocal.estado} onChange={handleEstadoChange} className="search-input">
            <option value="todas" >Todas</option>
            <option value="activas">Activas</option>
            <option value="desactivadasAdmin">Desactivadas por Admin</option>
            <option value="pausadasEmpresa">Pausadas por Empresa</option>
          </select>
        </div>
      )}

      
      <div className="filter-group">
        <h4 className="filter-group-title">Cargo</h4>
        <input
          type="text"
          name="cargo"
          onChange={handleOnFilters}
          value={filtersLocal.cargo || ""}
          className="search-input"
        />
      </div>

      {/* Botón para eliminar todos los filtros */}
        <button
          className="btn btn-primary filter-search-button"
          onClick={() => {
            clearAllFilters(); // resetea filtros 
          }}
        >
          Eliminar filtros
        </button>
    </div>
    
  );
}
