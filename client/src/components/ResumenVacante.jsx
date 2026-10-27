import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSendFormV2 } from "../hooks/useFetch.jsx";
import { modalTime } from "../services/Modal.js";
import { API_CLIENT_URL, URL_VIDEO } from "../services/Api.js";
import Prediccion from "./Prediccion.jsx";
import { ListSvg } from "./icons.jsx";
import { RoleContext } from "../services/RoleContext.jsx";
import exceptionControl from "../services/exceptionControl.js";

export default function ResumenVacante({job, rol, id}) {

  const navigate = useNavigate();
  const { userDataSession, logout } = useContext(RoleContext);
  const [curriculo, setCurriculo] = useState(null);
  const [prediccionActiva , setPrediccionActiva] = useState(false);
  const [jobResumen, setJobResumen] = useState(job);
  const { send , data } = useSendFormV2();
  const { send:request } = useSendFormV2();

  const handleVisita = async () => {
    try {
      await send(`/api/vacantes/visita/${jobResumen.nvacantes}`, "POST")
      
    } catch (error) {
      exceptionControl(error, logout, navigate, "Error al incrementar el numero de visitas")
    }
  }
  useEffect(() => {
    if (jobResumen?.nvacantes) {
      handleVisita()
    }
  }, [jobResumen?.nvacantes]);

  useEffect(() => {
    if (rol !== "CANDIDATO") return
    try{
      send("/api/candidatos/perfil", "GET");
    }catch(error){
      exceptionControl(error, logout, navigate, "Error al cargar los datos de la predicción" )
    }
  }, [rol]);

  useEffect(() => {
    if (data) {
      const { curriculo, nivelEducativo, experiencia, aptitudes } = data.candidato;
      setCurriculo(curriculo);

      // Activar predicción solo si existen valores y hay mínimo 2 aptitudes
      const tieneDatosCompletos =
        nivelEducativo &&
        experiencia &&
        Array.isArray(aptitudes) &&
        aptitudes.length >= 2;

      setPrediccionActiva(tieneDatosCompletos);
    }
  }, [data]);

  async function handleOnClick (){
    await request(`/api/postulados/add/${jobResumen.nvacantes}`, "POST");
    setJobResumen(prev => ({
      ...prev,
      estadoPostulacion: "Espera",
      candidatoPostulado: true
    }));
    modalTime("Postulacion realizada con exito");
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
          jobResumen.idUsuario == userDataSession.id ? (
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