import { useContext } from "react";
import FeatureCard from "../../components/FeatureCard";
import { useFetch } from "../../hooks/useFetch";
import Layout from "../../layouts/layout";
import "../../style/invitado/index.css"
import { RoleContext } from "../../services/RoleContext";
export default function Index (){

    const {rol, setRol} = useContext(RoleContext)
    const {data, loading, error} = useFetch("/api/vacantes/Top/listar","GET")
    const features = [
        {
            id: "1",
            iconName: "search",
            title: "Búsqueda Inteligente",
            description: "Encuentra el empleo perfecto con nuestros filtros avanzados y recomendaciones personalizadas.",
        },
        {
            id: "2",
            iconName: "briefcase",
            title: "Publicación Sencilla",
            description: "Empresas pueden publicar vacantes en minutos con nuestro proceso simplificado.",
        },
        {
            id: "3",
            iconName: "messageCircle",
            title: "Chat en Tiempo Real",
            description: "Comunícate directamente con empresas o candidatos a través de nuestro chat integrado.",
        },
        {
            id: "4",
            iconName: "user",
            title: "Perfiles Profesionales",
            description: "Crea un perfil atractivo para destacar tus habilidades y experiencia.",
        },
    ];

    return(
        <Layout>
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">Encuentra empleo o talento de forma fácil y profesional</h1>
                        <p className="hero-subtitle">
                            Conectamos empresas con los mejores talentos a través de una plataforma intuitiva y moderna
                        </p>
                        <div className="hero-cta">
                            <a href="/registro/candidato" className="btn btn-primary">
                                Buscar empleo
                            </a>
                            <a href="/registro/empresa" className="btn btn-outline">
                                Publicar vacante
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="section-title">Empleos Destacados</h2>
                    <p className="section-subtitle">Descubre las mejores oportunidades laborales seleccionadas para ti</p>

                    {/* <div className="jobs-grid">
                        {featuredJobs.map(job => (
                            <JobCard job={job} rol={rol} />
                        ))}
                    </div> */}

                    
                    {
                        data? (
                            <div className="jobs-grid">
                                {data.vacantes.map(job =>
                                    <h1>{job.titulo}</h1>
                                )}
                            </div>
                        ):(
                            <h1 className="section-subtitle">No hay vacantes Disponibles</h1>
                        )
                    }
                    

                    <div className="view-all-container">
                        <a href="/empleos" className="btn btn-secondary">
                            Ver todos los empleos
                        </a>
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
                rol === "ROLE_INVIDATO" &&

                <section className="cta-section section">
                    <div className="container">
                        <div className="cta-card">
                            <h2 className="cta-title">¿Listo para comenzar?</h2>
                            <p className="cta-description">
                                Únete a miles de profesionales y empresas que ya confían en SearchJobs
                            </p>
                            <div className="cta-buttons">
                                <a href="/registro/candidato" className="btn btn-primary">
                                    Registrarse como candidato
                                </a>
                                <a href="/registro/empresa" className="btn btn-outline cta-outline">
                                    Registrarse como empresa
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            }
        </Layout>
    )
}