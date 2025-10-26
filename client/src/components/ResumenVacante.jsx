import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFetch, useSendForm } from "../hooks/useFetch";
import { modal } from "../services/Modal";
import { API_CLIENT_URL } from "../services/Api";

export default function ResumenVacante({job, rol}) {

    const[IdUserSesion ,setIdUserSesion] = useState(null);
    const [curriculo, setCurriculo] = useState(null);
    const [jobResumen, setJobResumen] = useState(job);
    const { send } = useSendForm();
    const {send:sendCandidato, data:dataCandidato } = useSendForm();
    const { data } = useFetch("/api/usuarios/rol", "GET");

    useEffect(() => {
    if (jobResumen?.nvacantes) {
        console.log("ID a enviar:", jobResumen.nvacantes);

        fetch(`${API_CLIENT_URL}/api/vacantes/visita/${jobResumen.nvacantes}`, {
            method: "POST",
            credentials: 'include'
        })
        .then(response => {
            console.log("Status visita:", response.status);
            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }
            return response.text();
        })
        .then(data => console.log("Visita registrada"))
        .catch(error => console.error("Error visita:", error));
    }
}, [jobResumen?.nvacantes]);

    useEffect(() => {
  if (rol === "CANDIDATO") {
    sendCandidato("/api/candidatos/perfil", "GET");
  }
}, [rol]);

useEffect(() => {
  if (dataCandidato) {
    setCurriculo(dataCandidato.candidato.curriculo);
  }
}, [dataCandidato]);


    useEffect(()=>{
      if(!data){return}
      setIdUserSesion(data.id);
    }, [ data ])

    async function handleOnClick (){
      const result = await send(`/api/postulados/add/${jobResumen.nvacantes}`, "POST");
      modal(result.message , result.status);
      if (result.status === "success") {
        setJobResumen(prev => ({
          ...prev,
          estadoPostulacion: "Espera",
          candidatoPostulado: true
        }));
      }
    }
    
    useEffect(()=>{
      if(!job){return}
      setJobResumen(job);
    }, [ job ])

    
    return (
      <div>
        <div className="sticky p-6 border rounded-lg shadow-lg bg-red backdrop-blur-xl border-white/20 top-24">
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1 mr-3 text-primary"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <div>
                <p className="text-sm text-text-light">Empresa</p>
                <Link
                  to={`/perfil/empresa/${jobResumen.idUsuario}`}
                  className="font-medium text-blue-600 no-underline hover:text-blue-700 transition-colors"
                >
                  {jobResumen.nameEmpresa}
                </Link>
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1 mr-3 text-primary"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div>
                <p className="text-sm text-text-light">Ubicación</p>
                <p className="font-medium">
                  {jobResumen.ciudad}, {jobResumen.departamento}
                </p>
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1 mr-3 text-primary"
              >
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <div>
                <p className="text-sm text-text-light">Salario</p>
                <p className="font-medium">{jobResumen.sueldo}</p>
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1 mr-3 text-primary"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <div>
                <p className="text-sm text-text-light">Fecha de publicación</p>
                <p className="font-medium">{jobResumen.fechaPublicacion}</p>
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1 mr-3 text-primary"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <div>
                <p className="text-sm text-text-light">Postulados</p>
                <p className="font-medium">{jobResumen.totalpostulaciones}</p>
              </div>
            </div>

            <div className="flex items-start">
                <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    width="20"
                    height="20"
                    className="mt-1 mr-3 text-primary"
                >
                    <path d="M442.9 144C415.6 144 389.9 157.1 373.9 179.2L339.5 226.8C335 233 327.8 236.7 320.1 236.7C312.4 236.7 305.2 233 300.7 226.8L266.3 179.2C250.3 157.1 224.6 144 197.3 144C150.3 144 112.2 182.1 112.2 229.1C112.2 279 144.2 327.5 180.3 371.4C221.4 421.4 271.7 465.4 306.2 491.7C309.4 494.1 314.1 495.9 320.2 495.9C326.3 495.9 331 494.1 334.2 491.7C368.7 465.4 419 421.3 460.1 371.4C496.3 327.5 528.2 279 528.2 229.1C528.2 182.1 490.1 144 443.1 144zM335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1C576 297.7 533.1 358 496.9 401.9C452.8 455.5 399.6 502 363.1 529.8C350.8 539.2 335.6 543.9 320 543.9C304.4 543.9 289.2 539.2 276.9 529.8C240.4 502 187.2 455.5 143.1 402C106.9 358.1 64 297.7 64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1L320 171.8L335 151.1z"/>
                </svg>
                <div>
                    <p className="text-sm text-text-light">Numero De Guardados</p>
                    <p className="font-medium">{jobResumen.numeroGuardadosFavoritos}</p>
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1 mr-3 text-primary"
              >
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              <div>
                <p className="text-sm text-text-light">numero de compartidos</p>
                <p className="font-medium">{jobResumen.numCompartidos}</p>
              </div>
            </div>

            {/* 🔥 NUEVO: Campo de visitas */}
            <div className="flex items-start">
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
                className="mt-1 mr-3 text-primary"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <div>
                <p className="text-sm text-text-light">Número de Visitas</p>
                <p className="font-medium">{jobResumen.visitas }</p>
              </div>
            </div>
          </div>

          {rol === "CANDIDATO" ? (
            <>
              {jobResumen.candidatoPostulado &&
                jobResumen.estadoPostulacion !== "Cancelada" ? (
                  <span
                    className={`top-4 right-4 text-white text-xs font-semibold px-9 py-3 rounded-full shadow-md ${
                      jobResumen.estadoPostulacion === "Aceptada"
                        ? "bg-green-500"
                        : jobResumen.estadoPostulacion === "Rechazada"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {jobResumen.estadoPostulacion }
                  </span>
              ) : (
                <>
                  {!jobResumen.active || !jobResumen.activaPorEmpresa ? (
                    <p className="text-red-600 text-sm mt-2">
                      Esta vacante está deshabilitada y no puedes postularte.
                    </p>
                  ) : (
                    <>
                      <button
                        onClick={handleOnClick}
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
            <Link
              to="/login"
              className="w-full bg-gradient-primary text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Inicia sesión para postularte
            </Link>
          ) : rol === "EMPRESA" ? (
            jobResumen.idUsuario == IdUserSesion ? (
              <Link
                className="w-full bg-gradient-primary text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                to={`/empresa/postulados/${jobResumen.nvacantes}`}
              >
                Ver Postulados
              </Link>
            ) : null
          ) : null}
        </div>
      </div>
    );
}