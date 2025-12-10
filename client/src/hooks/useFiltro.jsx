import {useEffect, useState } from "react";
import { deleteLocalStore, readLocalStore, saveLocalStore } from "../services/localStore";

export default function useFiltro( initialFiltros, setCurrentPage, nameFiltros ){
    const [filtrosAplicados, setFiltrosAplicados] = useState(readLocalStore(nameFiltros, initialFiltros));
    const [filtrosLocal, setFiltrosLocal] = useState(readLocalStore(nameFiltros, initialFiltros));

    useEffect(()=>{
        saveLocalStore( nameFiltros ,filtrosAplicados)
        setCurrentPage(1);
    }, [filtrosAplicados])

    const handleOnFilters = (e) => {
        const { name, value } = e.target;

        setFiltrosLocal((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleOnFilterAplicados = (e) => {
        const { name, value } = e.target;

        setFiltrosAplicados((prev) => ({
            ...prev,
            [name]: value,
        }));
        setFiltrosLocal((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    const searchFilters = () => {
        setFiltrosAplicados(filtrosLocal);
    }
    const clearFilters = () => {
        deleteLocalStore(nameFiltros)
        setFiltrosAplicados(initialFiltros);
        setFiltrosLocal(initialFiltros);
    }

    return [filtrosLocal, filtrosAplicados, handleOnFilters, clearFilters, searchFilters, handleOnFilterAplicados ]
}