import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFetch, useSendForm } from "../hooks/useFetch";
import { modal } from "../services/Modal";
import { API_CLIENT_URL, URL_VIDEO } from "../services/Api";
import Prediccion from "./Prediccion";
import { ListSvg } from "./Icons";

export default function ResumenVacante({job, rol, id}) {

    const[IdUserSesion ,setIdUserSesion] = useState(null);
    const [curriculo, setCurriculo] = useState(null);
    const [prediccionActiva , setPrediccionActiva] = useState(false);
    const [jobResumen, setJobResumen] = useState(job);
    const { send } = useSendForm();
    const {send:sendCandidato, data:dataCandidato } = useSendForm();
    const { data } = useFetch("/api/usuarios/rol", "GET");

    useEffect(() => {
    if (jobResumen?.nvacantes) {

        fetch(`${API_CLIENT_URL}/api/vacantes/visita/${jobResumen.nvacantes}`, {
            method: "POST",
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }
            return response.text();
        })
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
      const { curriculo, nivelEducativo, experiencia, aptitudes } = dataCandidato.candidato;
      setCurriculo(curriculo);

      // Activar predicción solo si existen valores y hay mínimo 2 aptitudes
      const tieneDatosCompletos =
        nivelEducativo &&
        experiencia &&
        Array.isArray(aptitudes) &&
        aptitudes.length >= 2;

      setPrediccionActiva(tieneDatosCompletos);
    }
  }, [dataCandidato]);



  useEffect(() => {
    if (!data) { return }
    setIdUserSesion(data.id);
  }, [data])

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
              <ListSvg name={"maleta"} height={20} width={20} nameClass="mt-1 mr-3 text-primary"/>
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
              <ListSvg name={"ubicacion"} height={20} width={20} nameClass="mt-1 mr-3 text-primary"/>
              <div>
                <p className="text-sm text-text-light">Ubicación</p>
                <p className="font-medium">
                  {jobResumen.ciudad}, {jobResumen.departamento}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <ListSvg name={"dolar"} height={20} width={20} nameClass="mt-1 mr-3 text-primary"/>
              <div>
                <p className="text-sm text-text-light">Salario</p>
                <p className="font-medium">{jobResumen.sueldo.toLocaleString('es-CO')} COP</p>
              </div>
            </div>

            <div className="flex items-start">
              <ListSvg name={"reloj"} height={20} width={20} nameClass="mt-1 mr-3 text-primary"/>
              <div>
                <p className="text-sm text-text-light">Fecha de publicación</p>
                <p className="font-medium">{new Date(jobResumen.fechaPublicacion).toLocaleDateString("es-CO",{
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit"
                })}</p>
              </div>
            </div>

            <div className="flex items-start">
              <ListSvg name={"usuario"} height={20} width={20} nameClass="mt-1 mr-3 text-primary"/>
              <div>
                <p className="text-sm text-text-light">Postulados</p>
                <p className="font-medium">{jobResumen.totalpostulaciones}</p>
              </div>
            </div>

            <div className="flex items-start">
                <ListSvg name={"estrella"} height={20} width={20} nameClass="mt-1 mr-3 text-primary fill-none"/>
                <div>
                    <p className="text-sm text-text-light">Numero De Guardados</p>
                    <p className="font-medium">{jobResumen.numeroGuardadosFavoritos}</p>
                </div>
            </div>

            <div className="flex items-start">
              <ListSvg name={"compartir"} height={20} width={20} nameClass="mt-1 mr-3 text-primary"/>
              <div>
                <p className="text-sm text-text-light">numero de compartidos</p>
                <p className="font-medium">{jobResumen.numCompartidos}</p>
              </div>
            </div>

            <div className="flex items-start">
              <ListSvg name={"ojo"} height={20} width={20} nameClass="mt-1 mr-3 text-primary"/>
              <div>
                <p className="text-sm text-text-light">Número de Visitas</p>
                <p className="font-medium">{jobResumen.visitas }</p>
              </div>
            </div>
          </div>
          {/* 🔹 Video de presentación de la empresa */}
          {(jobResumen.videoLink && rol != "ROLE_INVITADO") && (
            <div className="flex items-center mb-9"> {/* subido un poco arriba */}
              <ListSvg name={"play"} height={20} width={20} nameClass="mt-1 mr-3 text-primary" />
              <div className="flex flex-col">
                <p className="text-sm text-text-light mb-1">Video de presentación</p>
                <a
                  href={URL_VIDEO + jobResumen.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white bg-gradient-primary py-1 px-3 rounded-lg shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 no-underline inline-block"
                >
                  Ver video
                </a>
              </div>
            </div>
          )}

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
        <br />
        <br />

        {rol === "CANDIDATO" && (
          prediccionActiva ? (
            <Prediccion id={id} />
          ) : (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-lg">
              Completa tu perfil para activar tu predicción de afinidad y recibir mejores oportunidades.
            </div>
          )
        )
        }
      </div>
    );
}