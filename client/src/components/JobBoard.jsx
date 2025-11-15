import { useEffect, useState } from 'react';
import { manejarRespuesta } from "../services/ManejarRespuesta";
import FilterComponent from './FilterComponent';
import FiltroSuperior from './FiltroSuperior';
import JobList from './JobList';
import { ListSvg } from './Icons';
import { readLocalStore, saveLocalStore } from '../services/localStore';


const JobBoard = ({ fetchUrl, rol }) => {
    const [currentPage, setCurrentPage] = useState(readLocalStore("PaginaActual", 1));
    const [presentacion, setPresentacion] = useState(readLocalStore("presentacion", 1)); // 1:CARD, 2:HORIZONTAL, 3:TABLA
    const [totalElement, setTotalElement] = useState(0) 
    const [totalPages, setTotalPages] = useState(1);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const itemsPerPage = 20;
    const initialFiltros = {
        titulo: null,
        tipo: "todos",
        experiencia: null,
        modalidad: null,
        active: rol === "empresa"? null : true,
        activaPorEmpresa: rol === "empresa"? null : true,
        cargo: null,
        ciudad: null,
        sueldo: null,
        totalpostulaciones: null,
        isFavorita: false
    }

    const [filters, setFilters] = useState(readLocalStore("filtro", initialFiltros));
    const [filtersLocal, setFiltersLocal] = useState(readLocalStore("filtro", initialFiltros));

    useEffect(()=>{
        saveLocalStore("presentacion", presentacion) 
    },[presentacion])
    
    useEffect(()=>{
        saveLocalStore("PaginaActual", currentPage) 
    },[currentPage])

    useEffect(()=>{
        saveLocalStore("filtro", filters) 
    },[filters])

    const fetchAllJobs = async () => {
        try {
            const res = await fetch(`${fetchUrl}?page=${currentPage - 1}&size=${itemsPerPage}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(filters), 
            });

            const data = await manejarRespuesta(res);
            if(!data){return;}
            setFilteredJobs(data.vacantes || []);
            setTotalElement(data.totalElements)
            setTotalPages(data.totalPage)
            
        } catch (error) {
            console.error('Error cargando vacantes:', error);
        }
    };

    useEffect(() => {
        fetchAllJobs();
    }, [filters,currentPage, ]); 

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFiltersLocal(prev => ({
            ...prev,
            [name]: value,
            [name]: name === "isFavorita" ? value === "true" : value
        }));
    };

    const handleEstadoChange = (event) => {
        const estadoSeleccionado = event.target.value;
        setFiltersLocal(prev => ({
            ...prev,
            estado: estadoSeleccionado
        }));

        const nuevoFiltro = {
            ...filtersLocal,
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

        setFiltersLocal(nuevoFiltro);
        setCurrentPage(1);
    };


    const clearAllFilters = () => {
        setFiltersLocal( initialFiltros);
        setFilters(initialFiltros)
    };

    return (
        <>  
            <div className="page-header">
                <FiltroSuperior 
                    filtersLocal={filtersLocal} 
                    handleFilterChange={handleFilterChange}
                    setFilters={setFilters}
                />
            </div>
            <div className="content-container">
                <FilterComponent  
                    filtersLocal={filtersLocal} 
                    clearAllFilters={clearAllFilters}
                    handleFilterChange={handleFilterChange}
                    setFilters={setFilters} 
                    rol={rol}
                    handleEstadoChange={handleEstadoChange}
                />    
                <div className="jobs-container">
                    <div className="jobs-header">
                        <h2 className="jobs-title">Empleos disponibles</h2>
                        <div className='container-flex-row'>
                            <div className="jobs-count">{totalElement} empleos encontrados</div>
                            <div className='container-flex-row'>
                                <button className='btn-presentacion' onClick={()=>{setPresentacion(1)}}>
                                   <ListSvg name={"tarjeta"} width={40} height={40} nameClass={presentacion == 1 ? "icon-active" : "icon"}/>
                                </button>
                                <button className='btn-presentacion' onClick={()=>{setPresentacion(2)}}>
                                   <ListSvg name={"menu"} width={40} height={40} nameClass={presentacion == 2 ? "icon-active": "icon"}/>
                                </button>
                                <button className='btn-presentacion' onClick={()=>{setPresentacion(3)}}>
                                   <ListSvg name={"tabla"} width={40} height={40} nameClass={presentacion == 3 ? "icon-active": "icon"}/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <JobList
                        jobs={filteredJobs}
                        rol={rol}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                        fetchAllJobs={fetchAllJobs}
                        presentacion = {presentacion}
                    />
                </div>
            </div>
        </>
    );
};

export default JobBoard;