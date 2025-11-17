// src/components/ShortsPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useSendForm } from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const ShortsPage = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [shortsData, setShortsData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedShorts, setLikedShorts] = useState({}); // Estado para controlar los likes
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { data, send } = useSendForm();

  const styles = {
    container: {
      width: '100%',
      minHeight: '100vh',
      background: '#f8f9fa',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '20px',
    },
    contentWrapper: {
      display: 'flex',
      gap: '20px',
      maxWidth: '800px',
      width: '100%',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      position: 'relative',
    },
    
    backButton: {
      position: 'absolute',
      top: '15px',
      left: '15px',
      background: 'rgba(255,255,255,0.9)',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      fontSize: '1.2em',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: 10,
    },
    
    videoPanel: {
      flex: '0 0 500px',
      position: 'relative',
      background: '#000',
      height: '700px',
    },
    videoContainer: {
      width: '100%',
      height: '500px', 
      position: 'relative',
    },
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    
    infoPanel: {
      flex: 1,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      minHeight: '500px', 
    },
    
    profileHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: '1px solid #f0f0f0',
    },
    profileImage: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: 'linear-gradient(45deg, #007bff, #0056b3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.3em',
      color: 'white',
      fontWeight: 'bold',
    },
    profileInfo: {
      flex: 1,
    },
    companyName: {
      fontSize: '1.2em',
      fontWeight: 'bold',
      margin: '0 0 4px 0',
      color: '#333',
    },
    jobInfo: {
      fontSize: '0.9em',
      color: '#666',
      margin: 0,
    },
   
    vacancyInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    vacancyTitle: {
      fontSize: '1.1em',
      fontWeight: 'bold',
      margin: '0 0 16px 0',
      color: '#333',
    },
    description: {
      fontSize: '0.95em',
      margin: '0 0 25px 0', 
      color: '#555',
      lineHeight: '1.5',
    },
    hashtags: {
      fontSize: '0.8em',
      color: '#007bff',
      margin: 'auto 0 20px 0', 
    },
    moreInfoButton: {
      background: 'transparent',
      color: '#007bff',
      border: '1px solid #007bff',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '0.85em',
      cursor: 'pointer',
      margin: '10px 0 20px 0',
      alignSelf: 'flex-start',
    },
    // Acciones
    actionsSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      paddingTop: '16px',
      borderTop: '1px solid #f0f0f0',
      marginTop: 'auto', 
    },
    likeButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'transparent',
      border: 'none',
      color: '#666',
      cursor: 'pointer',
      fontSize: '0.9em',
      fontWeight: 'bold',
      transition: 'all 0.2s ease',
    },
    likeIcon: {
      fontSize: '1.3em',
      transition: 'all 0.2s ease',
    },
    liked: {
      color: '#ff4444',
      transform: 'scale(1.1)',
    },
    applyButton: {
      background: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 24px',
      fontSize: '0.9em',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginLeft: 'auto',
    },

    muteButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.6)',
      border: 'none',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      color: 'white',
      fontSize: '1em',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(10px)',
    },
    
    navigationArrows: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    arrowButton: {
      background: 'rgba(0,0,0,0.6)',
      border: 'none',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      color: 'white',
      fontSize: '1.2em',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(10px)',
    },
    arrowButtonDisabled: {
      background: 'rgba(0,0,0,0.3)',
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  };

  // Función para manejar el like
  const handleLike = (shortId) => {
    setLikedShorts(prev => ({
      ...prev,
      [shortId]: !prev[shortId] // Alternar entre like y unlike
    }));
  };

  // Función para obtener el número de likes actualizado
  const getCurrentLikes = (short) => {
    const baseLikes = parseInt(short.likes.replace('K', '000').replace('.', '')) || parseInt(short.likes);
    const isLiked = likedShorts[short.id];
    
    if (isLiked === undefined) {
      return short.likes; // Devuelve el valor original si no hay interacción
    }
    
    const newLikes = isLiked ? baseLikes + 1 : baseLikes - 1;
    
    // Formatear el número (convertir a K si es grande)
    if (newLikes >= 1000) {
      return (newLikes / 1000).toFixed(1) + 'K';
    }
    return newLikes.toString();
  };

  // Función para regresar a la página principal
  const handleBack = () => {
    navigate(-1);
  };

  // Cargar shorts desde la API
  useEffect(() => {
    send("/api/shorts", "GET");
  }, []);

  useEffect(() => {
    if (data) {
      setShortsData(data);
    }
  }, [data]);

  // Datos de ejemplo con DESCRIPCIÓN BREVE
  const exampleShorts = [
    {
      id: 1,
      company: "TechSolutions",
      title: "Ingeniero DevOps",
      videoUrl: "/videos/short1.mp4",
      description: "Buscamos talento apasionado por la tecnología para unirse a nuestro equipo de DevOps.",
      hashtags: "#devops #cloud #tecnologia #empleoTI",
      jobCount: "8 posiciones abiertas",
      logo: "🚀",
      companyId: 2,
      likes: "856",
      isVerified: true
    },
    {
      id: 2,
      company: "Ecosys",
      title: "Desarrollador Full Stack",
      videoUrl: "/videos/short2.mp4",
      description: "Únete a nuestro equipo de desarrollo innovador y crea soluciones impactantes.",
      hashtags: "#fullstack #react #nodejs #desarrollador",
      jobCount: "15 vacantes disponibles",
      logo: "👨‍💻",
      companyId: 1,
      likes: "1.2K",
      isVerified: true
    },
    {
      id: 3,
      company: "DataCorp", 
      title: "Científico de Datos",
      videoUrl: "/videos/short3.mp4",
      description: "Analiza datos complejos y genera insights valiosos para nuestro equipo.",
      hashtags: "#datascience #ai #analytics",
      jobCount: "5 posiciones",
      logo: "📊",
      companyId: 3,
      likes: "923",
      isVerified: false
    },
    {
      id: 4,
      company: "sobrino", 
      title: "Científico de Datos",
      videoUrl: "/videos/short4.mp4",
      description: "Analiza datos complejos y genera insights valiosos para nuestro equipo.",
      hashtags: "#datascience #ai #analytics",
      jobCount: "5 posiciones",
      logo: "📊",
      companyId: 4,
      likes: "923",
      isVerified: false
    },
    {
      id: 5,
      company: "alberto", 
      title: "Científico de Datos",
      videoUrl: "/videos/short5.mp4",
      description: "Analiza datos complejos y genera insights valiosos para nuestro equipo.",
      hashtags: "#datascience #ai #analytics",
      jobCount: "5 posiciones",
      logo: "📊",
      companyId: 5,
      likes: "923",
      isVerified: false
    }
  ];

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnd = () => {
    if (currentVideoIndex < (shortsData.length || exampleShorts.length) - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const nextVideo = () => {
    if (currentVideoIndex < (shortsData.length || exampleShorts.length) - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setIsPlaying(true);
    }
  };

  const prevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setIsPlaying(true);
    }
  };

  const currentShort = shortsData[currentVideoIndex] || exampleShorts[currentVideoIndex];

  if (!currentShort) return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      background: '#f8f9fa', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#333' 
    }}>
      Cargando shorts...
    </div>
  );

  const isLiked = likedShorts[currentShort.id];
  const currentLikes = getCurrentLikes(currentShort);

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* Botón Atrás */}
        <button style={styles.backButton} onClick={handleBack} title="Volver atrás">
          ←
        </button>

        {/* Panel del video */}
        <div style={styles.videoPanel}>
          <div style={styles.videoContainer} onClick={handleVideoClick}>
            <video
              ref={videoRef}
              src={currentShort.videoUrl}
              style={styles.video}
              autoPlay={isPlaying}
              muted={isMuted}
              loop={false}
              onEnded={handleVideoEnd}
            />
            
            {/* Botón silenciar */}
            <button style={styles.muteButton} onClick={toggleMute}>
              {isMuted ? "🔇" : "🔊"}
            </button>

            {/* Flechas de navegación */}
            <div style={styles.navigationArrows}>
              <button 
                style={{
                  ...styles.arrowButton,
                  ...(currentVideoIndex === 0 ? styles.arrowButtonDisabled : {})
                }}
                onClick={prevVideo}
                disabled={currentVideoIndex === 0}
              >
                ↑
              </button>
              <button 
                style={{
                  ...styles.arrowButton,
                  ...(currentVideoIndex === (shortsData.length || exampleShorts.length) - 1 ? styles.arrowButtonDisabled : {})
                }}
                onClick={nextVideo}
                disabled={currentVideoIndex === (shortsData.length || exampleShorts.length) - 1}
              >
                ↓
              </button>
            </div>
          </div>
        </div>

        {/* Panel de información */}
        <div style={styles.infoPanel}>
          {/* Header con perfil */}
          <div style={styles.profileHeader}>
            <div style={styles.profileImage}>
              {currentShort.logo}
            </div>
            <div style={styles.profileInfo}>
              <h3 style={styles.companyName}>
                {currentShort.company} {currentShort.isVerified && "✅"}
              </h3>
              <p style={styles.jobInfo}>{currentShort.jobCount}</p>
            </div>
          </div>

          {/* Información de la vacante */}
          <div style={styles.vacancyInfo}>
            <h4 style={styles.vacancyTitle}>{currentShort.title}</h4>
            
            <p style={styles.description}>{currentShort.description}</p>

            {/* Botón Ver más información */}
            <button style={styles.moreInfoButton}>
              Ver más información
            </button>

            {/* Hashtags */}
            <div style={styles.hashtags}>
              {currentShort.hashtags}
            </div>
          </div>

          {/* Acciones */}
          <div style={styles.actionsSection}>
            <button 
              style={styles.likeButton}
              onClick={() => handleLike(currentShort.id)}
            >
              <span 
                style={{
                  ...styles.likeIcon,
                  ...(isLiked ? styles.liked : {})
                }}
              >
                {isLiked ? "❤️" : "🤍"}
              </span>
              <span>{currentLikes}</span>
            </button>
            <button style={styles.applyButton}>
              Postularme ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortsPage;