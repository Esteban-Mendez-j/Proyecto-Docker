import { API_CLIENT_URL } from '../services/Api';

export default function JobCard({job}) {

    return (
        <a href={`/empleos/${job.nvacantes}`} className="card" key={job.id}>
            <div className="header">
                <div className="logo">
                    <img src={job.imagenEmpresa ? `${API_CLIENT_URL}` + "/img/" + job.imagenEmpresa : `${API_CLIENT_URL}/images/imgEmpresa.png`} alt={`${job.nameEmpresa} logo`} width="60" height="60" />
                </div>
                <div className="info">
                    {!job.active && (
                        <span className="top-4 left-4 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                            {rol === "EMPRESA" ? "Desactivada por Admin" : "Desactivada"}
                        </span>
                    )}

                    {!job.activaPorEmpresa && job.isActive && (
                        <span className="top-4 left-4 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                            {rol === "EMPRESA" ? "Desactivada por ti" : "Desactivada"}
                        </span>
                    )}

                    {job.candidatoPostulado && job.estadoPostulacion !== 'Cancelada' && (
                        <span
                            className={`top-4 right-4 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md ${job.estadoPostulacion === 'Aceptada'
                                    ? 'bg-green-500'
                                    : job.estadoPostulacion === 'Rechazada'
                                        ? 'bg-red-500'
                                        : 'bg-blue-500'
                                }`}
                        >
                            {job.estadoPostulacion}
                        </span>
                    )}

                    <h3 className="title">{job.titulo}</h3>
                    <p className="company">{job.nameEmpresa}</p>
                </div>
            </div>

            <div className="details">
                <div className="detail">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{job.ciudad}</span>
                </div>
                <div className="detail">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{job.tipo}</span>
                </div>
                <div className="detail">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <span>{job.experiencia}</span>
                </div>
                <div className="detail">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="icon"
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>

                    <span>{job.totalpostulaciones} postulados</span>
                </div>
            </div>

            <div className="apply">
                <span className="apply-text">Ver detalles</span>
            </div>
        </a>

    );
}