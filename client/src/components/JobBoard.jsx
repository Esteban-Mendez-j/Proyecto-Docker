import { useContext, useEffect, useState } from 'react';
import { manejarRespuesta } from "../services/ManejarRespuesta";
import FilterComponent from './FilterComponent';
import FiltroSuperior from './FiltroSuperior';
import JobList from './JobList';
import { ListSvg } from './Icons';
import { readLocalStore, saveLocalStore } from '../services/localStore';
import { RoleContext } from '../services/RoleContext';
import useFiltro from '../hooks/useFiltro';
import exceptionControl from '../services/exceptionControl';
import { useNavigate } from 'react-router-dom';
import { useSendFormV2 } from '../hooks/useFetch';

const JobBoard = ({ fetchUrl }) => {
    const {rol:rolAuth, logout} = useContext(RoleContext);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(readLocalStore("PaginaActual", 1));
    const [presentacion, setPresentacion] = useState(readLocalStore("presentacion", 1)); // 1:CARD, 2:HORIZONTAL, 3:TABLA
    const [totalElement, setTotalElement] = useState(0) 
    const [totalPages, setTotalPages] = useState(1);
    const [verPrediccion, setVerPrediccion] = useState(false);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const {data, error, meta, loading, send} = useSendFormV2();
    const itemsPerPage = 20;
    const initialFiltros = {
        titulo: null,
        tipo: "todos",
        experiencia: null,
        modalidad: null,
        active: rolAuth === "EMPRESA"? null : true,
        activaPorEmpresa: rolAuth === "EMPRESA"? null : true,
        cargo: null,
        ciudad: null,
        sueldo: null,
        totalpostulaciones: null,
        isFavorita: false,
        estado: rolAuth === "EMPRESA"? "todos" : undefined,
        estadoPostulacion: rolAuth === "EMPRESA"? null : "SinPostulacion"
    }
    const [filtrosLocal, filtrosAplicados, handleOnFilters, clearFilters, searchFilters, handleOnFilterAplicados] = useFiltro(initialFiltros, setCurrentPage, "filtrosEmpleos")

    useEffect(()=>{
        saveLocalStore("presentacion", presentacion) 
    },[presentacion])
    
    useEffect(()=>{
        saveLocalStore("PaginaActual", currentPage) 
    },[currentPage])

    const fetchAllJobs = async () => {
        try {
            await send(
                `${fetchUrl}?page=${currentPage - 1}&size=${itemsPerPage}`,"POST",
                JSON.stringify(filtrosAplicados) 
            );
        } catch (error) {
            console.error('Error cargando vacantes:', error);
            exceptionControl(error, logout, navigate, "Error al cargar vacantes" )
        } 
    };

    useEffect(() => {
        if (!data ) return;
        setFilteredJobs(data);
    }, [data])

    useEffect(() => {
        if (!meta ) return;
        setTotalElement(meta.pagination.totalElements)
        setTotalPages(meta.pagination.totalPage)
    }, [meta])

    useEffect(() => {
        fetchAllJobs();
    }, [filtrosAplicados ,currentPage ]); 

    return (
        <>  
            { (rolAuth === "CANDIDATO" && !verPrediccion ) && <h1 className='title text-center'>Completa tu perfil para obtener mejores recomendaciones</h1>}
            <div className="page-header">
                <FiltroSuperior 
                    filtersLocal={filtrosLocal} 
                    handleOnFilters={handleOnFilters}
                    searchFilters={searchFilters}
                />
            </div>
            <div className="content-container">
                <FilterComponent  
                    filtersLocal={filtrosLocal} 
                    clearAllFilters={clearFilters}
                    handleOnFilters={handleOnFilters}
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
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                        fetchAllJobs={fetchAllJobs}
                        presentacion = {presentacion}
                        loading={loading}
                        verPrediccion={verPrediccion}
                        setVerPrediccion={setVerPrediccion}
                        setFilteredJobs={setFilteredJobs}
                    />
                </div>
            </div>
        </>
    );
};

export default JobBoard;