export default function FilterComponent({ filtersLocal, clearAllFilters, handleFilterChange, setFilters, rol,handleEstadoChange }) {
  
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
              onChange={handleFilterChange}
              checked={filtersLocal.tipo === "Vacante"}
            />
            <span>Vacantes</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="tipo"
              value="Practica"
              onChange={handleFilterChange}
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
          onChange={handleFilterChange}
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
          onChange={handleFilterChange}
          value={filtersLocal.sueldo || ""}
          className="search-input"
        />
      </div>
      
      <div className="filter-group">
        <h4 className="filter-group-title">Postulados</h4>
        <input
          type="number"
          min={0}
          name="totalpostulaciones"
          onChange={handleFilterChange}
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
              onChange={handleFilterChange}
              checked={filtersLocal.modalidad === "Remoto"}
            />
            <span>Remoto</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="modalidad"
              value="Presencial"
              onChange={handleFilterChange}
              checked={filtersLocal.modalidad === "Presencial"}
            />
            <span>Presencial</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="modalidad"
              value="Hibrido"
              onChange={handleFilterChange}
              checked={filtersLocal.modalidad === "Hibrido"}
            />
            <span>Híbrido</span>
          </label>
        </div>
      </div>

      {rol === "empresa" && (
        <div className="filter-group">
          <h4 className="filter-group-title">Estado</h4>
          <select name="estado" value={filtersLocal.estado} onChange={handleEstadoChange} className="search-input">
            <option value="todas" selected>Todas</option>
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
          onChange={handleFilterChange}
          value={filtersLocal.cargo || ""}
          className="search-input"
        />
      </div>

      {/* Botón para eliminar todos los filtros */}
        <button
          className="btn btn-primary filter-search-button"
          onClick={() => {
            clearAllFilters(); // resetea filtros locales
            setFilters({
              titulo: null,
              tipo: "todos",
              experiencia: null,
              modalidad: null,
              cargo: null,
              isActive: null,
              activaPorEmpresa: null,
              ciudad: null,
              sueldo: null,
              totalpostulaciones: null,
              favoritos: null
            }); // fuerza los filtros globales a reiniciarse
          }}
        >
          Eliminar filtros
        </button>
    </div>
    
  );
}
