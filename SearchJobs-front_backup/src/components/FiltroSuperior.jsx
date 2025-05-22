
export default function FiltroSuperior({ filtersLocal, handleFilterChange, setFilters }) {

    return (
        <div className="search-container" >
            <div className="search-form">
                <div className="search-input-group">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="search-icon"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>

                    <input
                        type="text"
                        placeholder="Titulo de la vacante"
                        name="titulo"
                        onChange={handleFilterChange}
                        value={filtersLocal.titulo || ""}
                        className="search-input-sup"
                    />
                </div>

                <div className="search-input-group">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="search-icon"
                    >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>

                    <input
                        type="text"
                        placeholder="Ciudad"
                        name="ciudad"
                        onChange={handleFilterChange}
                        value={filtersLocal.ciudad || ""}
                        className="search-input-sup"
                    />
                </div>

                <button
                    className="btn btn-primary search-button"
                    onClick={() => setFilters(filtersLocal)}
                >
                    Buscar
                </button>
            </div>

        </div >
    );
}

