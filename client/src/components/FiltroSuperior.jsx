import { useEffect, useState } from "react";
import {ciudadesColombia} from "../services/data"
import AutocompleteInput from "./AutocompleteInput";
import { API_CLIENT_URL } from "../services/Api";
export default function FiltroSuperior({ filtersLocal, handleFilterChange, setFilters }) {

    const [query, setQuery] = useState(filtersLocal.titulo || "");
    const [sugerencias, setSugerencias] = useState([]);
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500); // espera 300ms después de que el usuario deja de escribir

        return () => clearTimeout(handler);
    }, [query]);

    // Sincroniza query cuando filtros externos cambien
    useEffect(() => {
        setQuery(filtersLocal.titulo || "");
    }, [filtersLocal.titulo]);

    // Petición al backend cuando debouncedQuery cambia
    useEffect(() => {
        if (debouncedQuery.length < 2) {
            setSugerencias([]);
            return;
        }

        fetch(`${API_CLIENT_URL}/api/vacantes/sugerencias?query=${debouncedQuery}`)
            .then(res => res.json())
            .then(data => setSugerencias(data));
    }, [debouncedQuery]);

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

                    <AutocompleteInput
                        type="text"
                        placeholder="Titulo de la vacante"
                        name="titulo"
                        options={sugerencias}
                        value={query} 
                        onChange={(e) => {
                            handleFilterChange(e, query)
                            setQuery(e.target.value)
                        }}
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
                    
                    <AutocompleteInput 
                        placeholder="Ciudad"
                        name="ciudad"
                        options={ciudadesColombia}
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
