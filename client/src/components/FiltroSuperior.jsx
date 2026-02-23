import { useEffect, useState } from "react";
import {ciudadesColombia} from "../services/data"
import AutocompleteInput from "./AutocompleteInput";
import { API_CLIENT_URL } from "../services/Api";
import { ListSvg } from "./Icons";
export default function FiltroSuperior({ filtersLocal, handleOnFilters, searchFilters }) {

    const [query, setQuery] = useState(filtersLocal.titulo || "");
    const [sugerencias, setSugerencias] = useState([]);
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300); // espera 300ms después de que el usuario deja de escribir

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
                   
                    <ListSvg name={"lupa"} width={20} height={20} nameClass="search-icon" />

                    <AutocompleteInput
                        type="text"
                        placeholder="Titulo de la vacante"
                        name="titulo"
                        options={sugerencias}
                        value={query} 
                        onChange={(e) => {
                            handleOnFilters(e, query)
                            setQuery(e.target.value)
                        }}
                        className="search-input-sup"
                    />
                </div>

                <div className="search-input-group">
                    <ListSvg name={"ubicacion"} width={20} height={20} nameClass="search-icon" />
                    <AutocompleteInput 
                        placeholder="Ciudad"
                        name="ciudad"
                        options={ciudadesColombia}
                        onChange={handleOnFilters}
                        value={filtersLocal.ciudad || ""}
                        className="search-input-sup"
                    />
                </div>

                <button
                    className="btn btn-primary search-button"
                    onClick={searchFilters}
                >
                    Buscar
                </button>
            </div>

        </div >
    );
}
