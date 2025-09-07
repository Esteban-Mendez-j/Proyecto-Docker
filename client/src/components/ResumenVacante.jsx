import Loading from "./Loading"

export default function ResumenVacante({job, rol}) {

    return (
        <div>
            <div
                className="sticky p-6 border rounded-lg shadow-lg bg-red backdrop-blur-xl border-white/20 top-24"
            >
                <h2 className="mb-6 text-xl font-semibold">Resumen de la oferta</h2>

                <div className="mb-8 space-y-4">
                    <div className="flex items-start">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="mt-1 mr-3 text-primary"
                        >
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        <div>
                            <p className="text-sm text-text-light">Empresa</p>
                            <a
                                href={`/perfil/empresa/${job.idUsuario}`}
                                className="font-medium text-blue-600 no-underline hover:text-blue-700 transition-colors"
                            >
                                {job.nameEmpresa}
                            </a>

                        </div>
                    </div>

                    <div className="flex items-start">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="mt-1 mr-3 text-primary"
                        >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <div>
                            <p className="text-sm text-text-light">Ubicación</p>
                            <p className="font-medium">{job.ciudad}, {job.departamento}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="mt-1 mr-3 text-primary"
                        >
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                            ></path>
                        </svg>
                        <div>
                            <p className="text-sm text-text-light">Salario</p>
                            <p className="font-medium">{job.sueldo}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="mt-1 mr-3 text-primary"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <div>
                            <p className="text-sm text-text-light">Fecha de publicación</p>
                            <p className="font-medium">{job.fechaPublicacion}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="mt-1 mr-3 text-primary"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <div>
                            <p className="text-sm text-text-light">Postulados</p>
                            <p className="font-medium">{job.totalpostulaciones}</p>
                        </div>
                    </div>
                </div>

                {rol === "CANDIDATO" ? (
                    <>
                        {job.candidatoPostulado && job.estadoPostulacion !== 'Cancelada' ? (
                            <span
                                className={`top-4 right-4 text-white text-xs font-semibold px-9 py-3 rounded-full shadow-md ${job.estadoPostulacion === 'Aceptada'
                                    ? 'bg-green-500'
                                    : job.estadoPostulacion === 'Rechazada'
                                        ? 'bg-red-500'
                                        : 'bg-blue-500'
                                    }`}
                            >
                                {job.estadoPostulacion}
                            </span>
                        ) : (
                            <>
                                {!job.active || !job.activaPorEmpresa ? (
                                    <p className="text-red-600 text-sm mt-2">
                                        Esta vacante está deshabilitada y no puedes postularte.
                                    </p>
                                ) : (
                                    <>
                                        <button
                                            id="applyButton"
                                            data-id={id}
                                            className="w-full bg-gradient-primary text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!curriculo}
                                        >
                                            Postularme ahora
                                        </button>
                                        {!curriculo && (
                                            <p className="text-red-600 text-sm mt-2">
                                                Debes subir tu currículum para poder postularte.
                                            </p>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </>
                ) : rol === "ROLE_INVITADO" ? (
                    <a
                        href="/login"
                        className="w-full bg-gradient-primary text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                    >
                        Inicia sesión para postularte
                    </a>
                ) : rol === "EMPRESA" ? (

                    job.idUsuario == idUsuarioLogueado ? (
                        <a
                            className="w-full bg-gradient-primary text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                            href={`/postulados/${id}`}
                        >
                            Ver Postulados
                        </a>

                    ) : null

                ) : null}


            </div>
        </div>
    )
}