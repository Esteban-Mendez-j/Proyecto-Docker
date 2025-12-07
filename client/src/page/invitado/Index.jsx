import { useContext } from "react";
import { Link } from "react-router-dom";
import FeatureCard from "../../components/FeatureCard";
import JobCard from "../../components/JobCard";
import { useFetch } from "../../hooks/useFetch";
import Layout from "../../layouts/Layout";
import { RoleContext } from "../../services/RoleContext";
import "../../style/invitado/index.css";
export default function Index (){

    const { rol } = useContext(RoleContext)
    const url = rol == "EMPRESA"? "/api/vacantes/popular/listar" : "/api/vacantes/Top/listar";
    const {data, loading, error} = useFetch(url,"GET")
    const features = [
        {
            id: "1",
            iconName: "lupa",
            title: "Búsqueda Inteligente",
            description: "Encuentra el empleo perfecto con nuestros filtros avanzados y recomendaciones personalizadas.",
        },
        {
            id: "2",
            iconName: "maleta",
            title: "Publicación Sencilla",
            description: "Empresas pueden publicar vacantes en minutos con nuestro proceso simplificado.",
        },
        {
            id: "3",
            iconName: "burbujaMensaje",
            title: "Chat en Tiempo Real",
            description: "Comunícate directamente con empresas o candidatos a través de nuestro chat integrado.",
        },
        {
            id: "4",
            iconName: "usuario",
            title: "Perfiles Profesionales",
            description: "Crea un perfil atractivo para destacar tus habilidades y experiencia.",
        },
    ];

    return(
        <Layout>
            <section className="hero">
                <div className="container">
                    
                    <div className="hero-content">
                        <img className="hero-isotipo" src="/isotipo.png" alt="Isotipo, lupa y una maleta" />
                        <h1 className="hero-title">Encuentra empleo o talento de forma fácil y profesional</h1>
                        <p className="hero-subtitle">
                            Conectamos empresas con los mejores talentos a través de una plataforma intuitiva y moderna
                        </p>
                        <div className="hero-cta">
                            <Link to={rol == "EMPRESA" ? "/empresa/listado/vacantes":"/empleos"} className="btn btn-primary">
                                {rol == "EMPRESA" ? "Mis Vacantes":"Buscar Empleo"}
                            </Link>
                            {
                                rol == "EMPRESA" ? (
                                    <Link to="/empresa/vacantes" className="btn btn-outline">
                                        Publicar vacante
                                    </Link>
                            ) : (
                                    <Link to={rol == "CANDIDATO" ? "/postulaciones" : "/registro/candidato"} className="btn btn-outline">
                                        Ver Postulaciones
                                    </Link>
                                )
                            }
                            
                            
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="section-title">Empleos Destacados</h2>
                    <p className="section-subtitle">{rol == "EMPRESA"? "Oberva tus mejores ofertas" : "Descubre las mejores oportunidades laborales seleccionadas para ti"}</p>
                    {/* TODO: no esta el metdodo para cambiar el estado de la vacante por parte de la empresa */}
                    {
                        data? (
                            <div className="jobs-grid">
                                {data.vacantes.map(job =>
                                    <JobCard job={job} key={job.nvacantes} verSeccionEdit={false} presentaion={1}/>
                                )}
                            </div>
                        ):(
                            <h1 className="section-subtitle">No hay vacantes Disponibles</h1>
                        )
                    }
                    

                    <div className="view-all-container">
                        <Link to={rol == "EMPRESA" ? "/empresa/listado/vacantes":"/empleos"} className="btn btn-secondary">
                            Ver todos los empleos
                        </Link>
                    </div>
                </div>
            </section>

            <section className="features-section section">
                <div className="container">
                    <h2 className="section-title">¿Por qué elegir SearchJobs?</h2>
                    <p className="section-subtitle">
                        Nuestra plataforma ofrece herramientas modernas para conectar talento y oportunidades
                    </p>

                    <div className="features-grid">
                        {
                            features.map(feature => <FeatureCard key={feature.id} feature={feature} />)
                        }
                    </div>
                </div>
            </section>

            {
                rol === "ROLE_INVITADO" &&

                <section className="cta-section section">
                    <div className="container">
                        <div className="cta-card">
                            <h2 className="cta-title">¿Listo para comenzar?</h2>
                            <p className="cta-description">
                                Únete a miles de profesionales y empresas que ya confían en SearchJobs
                            </p>
                            <div className="cta-buttons">
                                <Link to="/registro/candidato" className="btn btn-primary">
                                    Registrarse como candidato
                                </Link>
                                <Link to="/registro/empresa" className="btn btn-outline cta-outline">
                                    Registrarse como empresa
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            }
        </Layout>
    )
}