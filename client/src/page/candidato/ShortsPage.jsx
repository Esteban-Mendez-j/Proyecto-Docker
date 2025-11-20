import React, { useState, useRef, useEffect, useContext } from "react";
import { useSendForm } from "../../hooks/useFetch";
import { Link, useNavigate } from "react-router-dom";
import { API_CLIENT_URL, URL_VIDEO } from "../../services/Api";
import { RoleContext } from "../../services/RoleContext";
import "../../style/invitado/short.css";
import Loading from "../../components/Loading";
import Header from "../../layouts/Header";
import { toggleFavoritoRequest } from "../../services/ToggleFavoritosRequest";
import { modal } from "../../services/Modal";
import { readLocalStore, saveLocalStore } from "../../services/localStore";

const ShortsPage = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState();
  const [shortsData, setShortsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(readLocalStore("PaginaActualVideos", 0));
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedShorts, setLikedShorts] = useState({});
  const [currentShort, setCurrentShort] = useState(null);
  const {send:sendCandidato, data:dataCandidato } = useSendForm();
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { data, send, loading } = useSendForm();
  const { rol } = useContext(RoleContext);
  const itemsPerPage = 20;

  const filtrosIniciales = {
    titulo: null,
    tipo: "todos",
    experiencia: null,
    modalidad: null,
    active: rol === "EMPRESA" ? null : true,
    activaPorEmpresa: rol === "EMPRESA" ? null : true,
    cargo: null,
    ciudad: null,
    sueldo: null,
    totalpostulaciones: null,
    isFavorita: false,
    estado: rol === "EMPRESA" ? "todos" : undefined,
    video: true,
    estadoPostulacion: rol === "empresa"? null : "SinPostulacion"
  };

  useEffect(() => {
    saveLocalStore("PaginaActualVideos", currentPage)
    setCurrentVideoIndex(0)
    send(`/api/vacantes/listar/filtradas?page=${currentPage}&size=${itemsPerPage}`, "POST", JSON.stringify(filtrosIniciales));
  }, [currentPage]);

  useEffect(() => {
    if (currentVideoIndex === shortsData.length - 1) {
      setCurrentPage(prev => prev + 1);
    }

  }, [currentVideoIndex])

  useEffect(() => {
    if (data && data.vacantes){ 
      setShortsData(data.vacantes)
      setCurrentPage(data.pageActual.pageNumber)
    };
  }, [data]);

  useEffect(() => {
    if (rol === "CANDIDATO") {
      sendCandidato("/api/candidatos/perfil", "GET");
    }
  }, [rol]);
  
  useEffect(() => {
    setCurrentShort(shortsData[currentVideoIndex]);
  }, [shortsData, currentVideoIndex]);

  async function handleOnClick(i) {
    const id = currentShort.nvacantes;
    const result = await send(`/api/postulados/add/${id}`, "POST");
    modal(result.message, result.status);
    if (result.status === "success") {
      setCurrentShort(prev => ({
        ...prev,
        estadoPostulacion: "Espera",
        candidatoPostulado: true
      }));
    }
  }

  const handleLike = async () => {
    try {
      const id = currentShort.nvacantes;

      // Llamar al backend
      await toggleFavoritoRequest(id);

      // Cambiar estado local
      setCurrentShort(prev => ({
        ...prev,
        vacanteGuardada: !prev.vacanteGuardada
      }));

    } catch (error) {
      console.error("Error al guardar favorito:", error);
    }
  };


  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const nextVideo = () => {
    if (currentVideoIndex < shortsData.length - 1)
      setCurrentVideoIndex(currentVideoIndex + 1);
  };

  const prevVideo = () => {
    if (currentVideoIndex > 0)
      setCurrentVideoIndex(currentVideoIndex - 1);
  };

  // if (loading) return <Loading/>;

  if (!currentShort) {
    return (
      <div className="no-shorts-container">
        <div className="no-shorts-card">
          {/* <img
            src="/images/no-data.svg" // Cambia a tu ilustración
            alt="No hay videos"
            className="no-shorts-img"
          /> */}
          <h2 className="no-shorts-title">¡Ups! No hay videos disponibles</h2>
          <p className="no-shorts-text">
            Aún no se han publicado shorts. Vuelve más tarde o explora otras vacantes.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="no-shorts-btn"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }


  const isLiked = likedShorts[currentShort.nvacantes];

  return (
    <>
    <div className="shorts-container">
      
      {/* Botón atrás */}
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>

      {/* Panel principal */}
      <div className="shorts-wrapper">

        {/* VIDEO PANEL */}
        <div className="video-panel">
          <div className="video-container">
            <video
              ref={videoRef}
              src={`${URL_VIDEO}${currentShort.videoLink}`}
              autoPlay
              muted={isMuted}
              playsInline
              loop
            />

            <button className="mute-btn" onClick={toggleMute}>
              {isMuted ? "🔇" : "🔊"}
            </button>

            <div className="arrows">
              <button disabled={currentVideoIndex === 0} onClick={prevVideo}>▲</button>
              <button disabled={currentVideoIndex === shortsData.length - 1} onClick={nextVideo}>▼</button>
            </div>
          </div>
        </div>

        {/* INFO PANEL */}
        <div className="info-panel">
            <div>
              <Link to={`/perfil/empresa/${currentShort.idUsuario}`} className="profile-header">
                <img
                  src={
                    currentShort.imagenEmpresa
                      ? `${URL_IMAGEN}${currentShort.imagenEmpresa}`
                      : `${API_CLIENT_URL}/images/imgEmpresa.png`
                  }
                  className="profile-icon"
                />
                <div>
                  <h1>{currentShort.nameEmpresa}</h1>
                  <h1>{currentShort.nvacantes}</h1>
                </div>
              </Link>

              <h2 className="title">{currentShort.titulo}</h2>
              <p className="description">{currentShort.descripcion}</p>

              <button className="more-btn"
                onClick={() => navigate(`/empleos/${currentShort.nvacantes}`)}
              >
                Ver más información →
              </button>
            </div>

            <div className="actions">
              <button
                className={`like-btn ${currentShort.vacanteGuardada ? "liked" : ""}`}
                onClick={handleLike}
                title="Favorita"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill={currentShort.vacanteGuardada ? "yellow" : "none"}
                  className={`w-10 h-10 transition-colors duration-200 ${currentShort.vacanteGuardada ? "text-yellow-400" : "text-gray-400"
                    }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 4.308a.563.563 0 00.424.308l4.756.691a.562.562 0 01.312.959l-3.44 3.352a.563.563 0 00-.162.498l.811 4.733a.562.562 0 01-.815.592L12 17.347l-4.26 2.24a.562.562 0 01-.815-.592l.811-4.733a.563.563 0 00-.162-.498L4.134 9.765a.562.562 0 01.312-.959l4.756-.691a.563.563 0 00.424-.308l2.125-4.308z"
                  />
                </svg>
              </button>
              <div>
                {/* boton Postulados */}
                {rol === "CANDIDATO" ? (
                  <>
                    {currentShort.candidatoPostulado &&
                      currentShort.estadoPostulacion !== "Cancelada" ? (
                      <span
                        className={`top-4 right-4 text-white text-xs font-semibold px-9 py-3 rounded-full shadow-md ${currentShort.estadoPostulacion === "Aceptada"
                          ? "bg-green-500"
                          : currentShort.estadoPostulacion === "Rechazada"
                            ? "bg-red-500"
                            : "bg-blue-500"
                          }`}
                      >
                        {currentShort.estadoPostulacion}
                      </span>
                    ) : (
                      <>
                        {!currentShort.active || !currentShort.activaPorEmpresa ? (
                          <p className="text-red-600 text-sm mt-2">
                            Esta vacante está deshabilitada y no puedes postularte.
                          </p>
                        ) : (
                          <>
                            <button
                              onClick={handleOnClick}
                              className="w-full bg-gradient-primary text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={!dataCandidato?.candidato.curriculo}
                            >
                              Postularme ahora
                            </button>
                            {!dataCandidato?.candidato.curriculo && (
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
                ) : null}
              </div>

            </div>

        </div>
      </div>
    </div>
    </>
  );
};

export default ShortsPage;
