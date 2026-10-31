import { useContext, useEffect, useState } from "react";
import "../../style/invitado/suscripcion.css"
import Layout from "../../layouts/layout.jsx";
import { Link } from "react-router-dom";
import { RoleContext } from "../../services/RoleContext.jsx";
import { ListSvg } from "../../components/icons.jsx";
/**
 * Página de suscripciones de SeedJobs.
 * El contenido se centraliza en los objetos `subscriptionContent` para facilitar
 * la edición de títulos, precios, beneficios, características y textos.
 *
 * Los enlaces de los botones son rutas de ejemplo: ajústalos a las rutas reales
 * de tu aplicación React.
 */

const subscriptionContent = {
  CANDIDATO: {
    label: "Para Candidatos",
    subtitle: "Busco empleo",
    icon: "person",
    free: {
      badge: "Comunidad",
      status: "Acceso ilimitado",
      title: "Plan Gratuito Candidato",
      description:
        "Todo lo fundamental para comenzar a postularte y conectar con oportunidades reales.",
      price: "$0",
      billing: "COP / mes",
      note: "Sin tarjeta de crédito.",
      cta: "Comenzar gratis",
      href: "/registro/candidato",
      footer: "Acceso inmediato tras verificar email",
      featuresTitle: "Beneficios incluidos:",
      features: [
        "Crear y editar el perfil personal completo.",
        "Subir y actualizar tu hoja de vida (CV en PDF).",
        "Buscar vacantes mediante filtros y postularte sin límites.",
        "Usar el chatbot de asistencia interactiva 24/7.",
        "Guardar y organizar vacantes favoritas.",
        "Administrar las postulaciones realizadas"
      ],
    },
    premium: {
      badge: "Recomendado para destacar",
      title: "Plan Premium candidato",
      description:
        "Herramientas de IA y visión de futuro para acelerar tu contratación y anticipar vacantes.",
      price: "$9.900",
      billing: "COP",
      note: "Facturación mensual simple",
      cta: "Obtener Premium",
      href: "/suscripciones",
      includedTitle: "Incluye todo lo del plan gratuito, más:",
      features: [
        {
          icon: "play_circle",
          title: "Reels de Vacantes",
          description:
            "Una forma diferente y dinámica de buscar empleo. Las empresas presentan la información de sus vacantes mediante videos cortos, para que conozcas las oportunidades laborales sin limitarte a leer sus descripciones y requisitos.",
        },
        {
          icon: "trending_up",
          title: "Predicción de Demanda",
          description:
            "Conoce las tendencias del mercado laboral mediante modelos predictivos que estiman, para el próximo año, la demanda de los cargos y sus requisitos. Consulta los resultados a través de gráficas que facilitan su análisis.",
        },
        {
          icon: "psychology",
          title: "Recomendación Inteligente de Vacantes",
          description:
            "Encuentra oportunidades laborales acordes con tu perfil. Nuestro sistema analiza la afinidad entre tus actitudes y las requeridas por cada vacante para recomendarte las opciones más compatibles y organizarlas de mayor a menor afinidad.",
        },
        {
          icon: "notifications",
          title: "Notificaciones de Postulaciones",
          description:
            "Mantente informado sobre el estado de tus postulaciones. Recibe notificaciones directamente en la plataforma cuando una empresa actualice el estado de tu solicitud.",
        },
      ],
    },
    // payment: {
    //   title: "Pagos 100% seguros y respaldados",
    //   description:
    //     "Transacciones cifradas de 256 bits a través de pasarelas certificadas para Colombia.",
    //   methods: [
    //     ["PSE", "Débito bancario"],
    //     ["Visa / Mastercard", "Tarjetas de crédito y débito"],
    //     ["Nequi", "Pago desde tu cuenta Nequi"],
    //     ["Daviplata", "Pago desde tu cuenta Daviplata"],
    //   ],
    // },
  },
  EMPRESA: {
    label: "Para Empresas",
    subtitle: "Quiero contratar",
    icon: "domain",
    free: {
      badge: "Comunidad empresarial",
      status: "Acceso ilimitado",
      title: "Plan Gratuito Empresa",
      description:
        "Todo lo esencial para publicar tus ofertas y conectar con talento calificado sin costos fijos.",
      price: "$0",
      billing: "COP / mes",
      note: "Sin tarjeta de crédito requerida.",
      cta: "Comenzar gratis como Empresa",
      href: "/registro/empresa",
      footer: "Activación inmediata tras verificar datos empresariales.",
      featuresTitle: "Beneficios incluidos:",
      features: [
        "Crear y editar el perfil de la empresa.",
        "Editar, activar y desactivar las vacantes publicadas.",
        "Recibir y gestionar postulaciones.",
        "Consultar los perfiles de los candidatos que se postulan.",
        "Consultar hojas de vida de candidatos postulados.",
        "Usar filtros básicos para buscar candidatos.",
        "Crear chats directos con candidatos y gestionarlos.",
      ],
    },
    premium: {
      badge: "Recomendado para empresas líderes",
      secondaryBadge: "El favorito de reclutadores",
      title: "Plan Premium Empresa",
      description:
        "Potencia tu atracción de talento con videos Reels, analítica avanzada y filtrado inteligente con IA.",
      price: "$19.900",
      previousPrice: null,
      billing: "COP / mes",
      note: "Facturación mensual simple · Cancela en cualquier momento",
      cta: "Obtener Plan Premium",
      href: "/suscripciones",
      includedTitle: "Incluye todo lo del plan gratuito, más:",
      features: [
        {
          icon: "video_library",
          title: "Video Reels de Empleo",
          description:
            "Publica videos dinámicos de tus vacantes en el feed principal para multiplicar las postulaciones de talento joven.",
        },
        {
          icon: "leaderboard",
          title: "Rankings de Afinidad",
          description:
            "Puntuación y ordenamiento automático de candidatos según su compatibilidad porcentual con cada vacante requerida.",
        },
        {
          icon: "analytics",
          title: "Métricas y Analítica en Tiempo Real",
          description:
            "Estadísticas de visualizaciones, clics y desempeño de cada oferta laboral publicada.",
        },
        {
          icon: "smart_toy",
          title: "Chatbot de Asistencia con IA para Empresas",
          description:
            "Asistente virtual con Inteligencia Artificial que responde dudas y brinda orientación a las empresas sobre el uso de la plataforma. Además, te ayuda a gestionar tus vacantes, permitiéndote crearlas, editarlas, activarlas y desactivarlas de forma sencilla.",
        },
      ],
      assurances: [
        ["bolt", "Acceso instantáneo a todas las herramientas premium al suscribirte."],
      ],
    },
  },
};

function MaterialIcon({ children, className = "" }) {
  return (
    <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>
      {children}
    </span>
  );
}

function CheckList({ items }) {
  return (
    <ul className="subscription-check-list">
      {items.map((feature, index) => (
        <li key={`${feature}-${index}`}>
          <span className="subscription-check"><MaterialIcon>check</MaterialIcon></span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

function PlanCard({ plan, premium = false, role }) {
  return (
    <article className={`subscription-plan ${premium ? "subscription-plan-premium" : "subscription-plan-free"}`}>
      {premium && <div className="subscription-plan-accent" />}
      <div className="subscription-plan-content">
        <div className="subscription-plan-badges">
          <span className={`subscription-badge ${premium ? "subscription-badge-primary" : ""}`}>
            {premium && <MaterialIcon>{role === "EMPRESA" ? "stars" : "auto_awesome"}</MaterialIcon>}
            {plan.badge}
          </span>
          {!premium && <span className="subscription-muted-small">{plan.status}</span>}
          {premium && role === "EMPRESA" && (
            <span className="subscription-badge subscription-badge-soft">{plan.secondaryBadge}</span>
          )}
        </div>

        <div className="subscription-plan-heading">
          <div>
            <h2>{plan.title}</h2>
            <p className="subscription-plan-description">{plan.description}</p>
          </div>
          <div className={`subscription-price-box ${premium ? "subscription-price-box-premium" : ""}`}>
            {plan.previousPrice && <span className="subscription-old-price">{plan.previousPrice}</span>}
            <div className="subscription-price-line">
              <span className="subscription-price">{plan.price}</span>
              <span className="subscription-price-currency">{plan.billing}</span>
            </div>
            <p>{plan.note}</p>
          </div>
        </div>
        
        <Link className={`subscription-cta ${premium ? "subscription-cta-primary" : ""}`} to={plan.href}>
          {plan.cta}
          <MaterialIcon>{premium ? (role === "EMPRESA" ? "rocket_launch" : "arrow_forward") : "arrow_forward"}</MaterialIcon>
        </Link>

        {!premium ? (
          <>
            <div className="subscription-divider" />
            <h3 className="subscription-feature-heading">{plan.featuresTitle}</h3>
            <CheckList items={plan.features} />
          </>
        ) : (
          <>
            <div className="subscription-divider" />
            <div className="subscription-included">
              <MaterialIcon>add_circle</MaterialIcon>
              <span>{plan.includedTitle}</span>
            </div>
            <div className="subscription-feature-grid">
              {plan.features.map((feature, index) => (
                <div className={`subscription-feature-card ${feature.icon === "smart_toy" ? "subscription-feature-wide" : ""}`} key={`${feature.title}-${index}`}>
                  <div className="subscription-feature-title-row">
                    <span className="subscription-feature-icon"><MaterialIcon>{feature.icon}</MaterialIcon></span>
                    <h3>{feature.title}</h3>
                    {feature.tag && <span className="subscription-feature-tag">{feature.tag}</span>}
                  </div>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
            {plan.assurances && (
              <div className="subscription-assurances">
                {plan.assurances.map(([icon, text]) => (
                  <span key={text}><MaterialIcon>{icon}</MaterialIcon>{text}</span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {!premium && (
        <div className="subscription-plan-footer">
          <MaterialIcon>{role === "EMPRESA" ? "verified" : "check_circle"}</MaterialIcon>
          <span>{plan.footer}</span>
        </div>
      )}
    </article>
  );
}

export default function SubscriptionPage() {
  const { rol } = useContext(RoleContext);
  const [activeRole, setActiveRole] = useState("CANDIDATO");
  const content = subscriptionContent[activeRole];

  useEffect(()=>{
    if(rol === null || !["CANDIDATO", "EMPRESA"].includes(rol)) return

    setActiveRole(rol)
  },[rol])

  return (
    <Layout>
      <div className="subscription-page">
        <main className="subscription-main">
          <div className="subscription-glow" />
          <section className="subscription-hero">
            <div className="subscription-eyebrow"><MaterialIcon>workspace_premium</MaterialIcon> PLANES DE SUSCRIPCIÓN</div>
            <h1>Elige el plan ideal para impulsar tu futuro o <span>encontrar el mejor talento</span></h1>
            <p>Descubre las herramientas que SeedJobs tiene para ayudarte a encontrar oportunidades laborales o conectar con el talento que tu empresa necesita.</p>

            {!["EMPRESA","CANDIDATO"].includes(rol) && 
              <div className="subscription-switch" role="tablist" aria-label="Tipo de suscripción">
                {["CANDIDATO", "EMPRESA"].map((role) => {
                  const item = subscriptionContent[role];
                  const selected = activeRole === role;
                  return (
                    <button
                      key={role}
                      id={`subscription-tab-${role}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="subscription-plans"
                      onClick={() => setActiveRole(role)}
                    >
                      <div className="subscription-feature-title-row">
                        <span>{role === "CANDIDATO" ?
                          <ListSvg name={"usuario"} width={20} height={20} /> : <ListSvg name={"empresa"} width={20} height={20} />
                        }
                        </span>
                        {item.label}
                        <span className="subscription-tab-subtitle">({item.subtitle})</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            }
          </section>

          <section className="subscription-deck" id="subscription-plans" role="tabpanel" aria-labelledby={`subscription-tab-${activeRole}`}>
            <PlanCard plan={content.free} role={activeRole} />
            <PlanCard plan={content.premium} premium role={activeRole} />
          </section>

          {(content.payment) &&
            <section className="subscription-payment" aria-label="Seguridad y métodos de pago">
              <div className="subscription-payment-copy">
                <div className="subscription-payment-icon"><MaterialIcon>verified_user</MaterialIcon></div>
                <div>
                  <h2>{content.payment.title}</h2>
                  <p>{content.payment.description}</p>
                </div>
              </div>
              <div className="subscription-payment-methods">
                {content.payment.methods.map(([name, description]) => (
                  <div className="subscription-payment-method" key={name}>
                    <strong>{name}</strong>
                    <span>{description}</span>
                  </div>
                ))}
              </div>
            </section>
          }
        </main>
        
      </div>
    </Layout>
  );
}
