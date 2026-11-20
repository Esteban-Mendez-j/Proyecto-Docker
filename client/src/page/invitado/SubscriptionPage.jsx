import { useContext, useEffect, useState } from "react";
import "../../style/invitado/suscripcion.css";
import Layout from "../../layouts/layout.jsx";
import { Link } from "react-router-dom";
import { RoleContext } from "../../services/RoleContext.jsx";
import { ListSvg } from "../../components/icons.jsx";

/**
 * Página de suscripciones de SeedJobs.
 * Todos los precios mostrados incluyen IVA. Se detalla además el valor antes de IVA.
 * Para Candidato se manejan los planes Gratuito y Premium.
 * Para Empresa se manejan 4 planes: Gratuito, Básico, Profesional y Empresarial.
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
      taxIncludedText: false,
      billing: "COP / mes",
      note: "Sin tarjeta de crédito.",
      cta: "Comenzar gratis",
      href: "/registro/candidato",
      footer: "Acceso inmediato tras verificar email",
      featuresTitle: "Beneficios incluidos:",
      features: [
        "Hasta 5 postulaciones para aplicar a vacantes.",
        "Crear y editar el perfil personal completo.",
        "Subir y actualizar tu hoja de vida (CV en PDF).",
        "Buscar vacantes mediante filtros y explorar empresas.",
        "Usar el chatbot de asistencia interactiva 24/7.",
        "Guardar y organizar vacantes favoritas.",
        "Administrar las postulaciones realizadas.",
      ],
    },
    premium: {
      badge: "Recomendado para destacar",
      title: "Plan Premium Candidato",
      description:
        "Herramientas de IA y visión de futuro para acelerar tu contratación y anticipar vacantes.",
      price: "$17.900",
      taxIncludedText: "IVA incluido",
      billing: "COP / mes",
      note: "Facturación mensual simple · Cancela cuando quieras",
      cta: "Obtener Plan Premium",
      href: "/suscripciones",
      includedTitle: "Incluye todo lo del plan gratuito, más:",
      features: [
        {
          icon: "trending_up",
          title: "Predicción de Demanda Laboral",
          tag: "IA",
          description:
          "Conoce las tendencias del mercado laboral mediante modelos predictivos que estiman, para el próximo año, la demanda de los cargos y sus requisitos con gráficas interactivas.",
        },
        {
          icon: "play_circle",
          title: "Reels de Vacantes",
          description:
          "Una forma diferente y dinámica de buscar empleo. Las empresas presentan sus vacantes mediante videos cortos interactivos.",
        },
        {
          icon: "notifications",
          title: "Notificaciones de Postulaciones",
          description:
          "Mantente informado en tiempo real. Recibe alertas en la plataforma cuando una empresa actualice el estado de tu postulación.",
        },
        {
          icon: "send",
          title: "Hasta 10 Postulaciones",
          description:
            "Mayor capacidad para postularte a ofertas activas en el mes y aumentar tus oportunidades de contratación.",
        },
        {
          icon: "psychology",
          title: "Recomendación Inteligente y Afinidad",
          description:
            "Encuentra ofertas acordes a tu perfil. El sistema analiza la afinidad entre tus competencias y las requeridas por cada vacante, ordenándolas de mayor a menor afinidad.",
        },
      ],
      assurances: [
        ["bolt", "Acceso instantáneo a predicción y afinidad al suscribirte."],
        ["verified", "Cancela o reactiva tu suscripción en cualquier momento."],
      ],
    },
  },
  EMPRESA: {
    label: "Para Empresas",
    subtitle: "Quiero contratar",
    icon: "domain",
    plans: [
      {
        id: "empresa-gratis",
        badge: "Comunidad empresarial",
        status: "Inicial",
        title: "Plan Gratuito",
        description:
          "Publica tu oferta y conecta con talento calificado sin costos fijos.",
        price: "$0",
        taxIncludedText: false,
        billing: "COP / mes",
        note: "Sin tarjeta de crédito requerida.",
        cta: "Comenzar gratis como Empresa",
        href: "/registro/empresa",
        footer: "Activación inmediata tras verificar datos empresariales.",
        featuresTitle: "Características principales:",
        features: [
          "Una vacante activa durante 30 días.",
          "Filtros básicos para buscar candidatos.",
          "Crear y editar el perfil empresarial.",
          "Recibir y gestionar postulaciones.",
          "Consultar perfiles y hojas de vida de candidatos postulados.",
          "Crear chats directos con candidatos.",
        ],
      },
      {
        id: "empresa-basico",
        badge: "Emprendedores",
        status: "Suscripción activa",
        title: "Plan Básico",
        description:
          "Diseñado para pequeños equipos y negocios en crecimiento continuo.",
        price: "$99.900",
        taxIncludedText: "IVA incluido",
        billing: "COP / mes",
        note: "Facturación mensual simple · Cancela cuando quieras",
        cta: "Obtener Plan Básico",
        href: "/suscripciones",
        footer: "Flexibilidad mensual sin permanencia obligatoria.",
        featuresTitle: "Características principales:",
        features: [
          "Hasta 3 vacantes activas simultáneas.",
          "Filtros básicos para buscar y gestionar candidatos.",
          "Vacantes activas continuas sin límite de 30 días.",
          "Publicación de Video Reels de empleo en el feed.",
          "Métricas y estadísticas de visualización de tus vacantes.",
          "Chatbot de asistencia para empresas y orientación 24/7.",
          "Chats directos y gestión ilimitada de postulaciones.",
        ],
      },
      {
        id: "empresa-profesional",
        badge: "Recomendado",
        secondaryBadge: "El más popular",
        status: "Alta demanda",
        highlighted: true,
        title: "Plan Profesional",
        description:
          "Potencia tu atracción y selección con afinidad predictiva IA y seguimiento.",
        price: "$179.900",
        taxIncludedText: "IVA incluido",
        billing: "COP / mes",
        note: "Facturación mensual simple · Cancela cuando quieras",
        cta: "Obtener Plan Profesional",
        href: "/suscripciones",
        footer: "Acceso inmediato a herramientas de IA y seguimiento.",
        featuresTitle: "Características principales:",
        features: [
          "Hasta 10 vacantes activas simultáneas.",
          "Filtros avanzados de búsqueda y selección de talento.",
          "Afinidad predictiva con IA (ranking y compatibilidad porcentual).",
          "Pruebas técnicas y seguimiento de candidatos en el proceso.",
          "Video Reels de empleo dinámicos en el feed principal.",
          "Métricas y analítica en tiempo real (clics, vistas y rendimiento).",
          "Chatbot de asistencia con IA para gestión y creación de vacantes.",
        ],
      },
      {
        id: "empresa-empresarial",
        badge: "Corporativo",
        secondaryBadge: "Máxima potencia",
        status: "Capacidad total",
        title: "Plan Empresarial",
        description:
          "Solución completa y de alto volumen para reclutamiento masivo y continuo.",
        price: "$299.900",
        taxIncludedText: "IVA incluido",
        billing: "COP / mes",
        note: "Facturación mensual simple · Cancela cuando quieras",
        cta: "Obtener Plan Empresarial",
        href: "/suscripciones",
        footer: "Atención corporativa y soporte preferencial.",
        featuresTitle: "Características principales:",
        features: [
          "Hasta 15 vacantes activas simultáneas.",
          "Filtros avanzados sin restricciones",
          "Afinidad predictiva avanzada con algoritmos de IA profunda.",
          "Pruebas técnicas personalizadas y módulo de seguimiento integral.",
          "Video Reels de empleo con máxima visibilidad en el feed.",
          "Analítica avanzada corporativa y reportes de rendimiento.",
          "Chatbot con IA empresarial",
        ],
      },
    ],
    featuresOverview: [
      {
        icon: "psychology",
        title: "Afinidad Predictiva con IA",
        description:
          "Puntuación y ordenamiento automático de candidatos según su compatibilidad porcentual con cada vacante, identificando el talento con mayor probabilidad de éxito.",
      },
      {
        icon: "fact_check",
        title: "Pruebas Técnicas y Seguimiento",
        description:
          "Mide habilidades específicas y realiza un seguimiento detallado del avance de los candidatos a lo largo de cada etapa del pipeline de selección.",
      },
      {
        icon: "video_library",
        title: "Video Reels de Empleo",
        description:
          "Publica videos dinámicos de tus vacantes en el feed interactivo para multiplicar el alcance y captar la atención de profesionales cualificados.",
      },
      {
        icon: "analytics",
        title: "Métricas y Analítica en Tiempo Real",
        description:
          "Estadísticas precisas de visualizaciones, clics y conversión de postulaciones para optimizar constantemente tus ofertas de empleo.",
      },
      {
        icon: "smart_toy",
        title: "Chatbot de Asistencia con IA para Empresas",
        description:
          "Asistente virtual que te orienta en el uso de la plataforma y te ayuda a redactar, publicar, activar o desactivar vacantes de forma ágil.",
      },
    ],
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
          <span className="subscription-check">
            <MaterialIcon>check</MaterialIcon>
          </span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

function PlanCardCandidate({ plan, premium = false }) {
  return (
    <article
      className={`subscription-plan ${
        premium ? "subscription-plan-premium" : "subscription-plan-free"
      }`}
    >
      {premium && <div className="subscription-plan-accent" />}
      <div className="subscription-plan-content">
        <div className="subscription-plan-badges">
          <span className={`subscription-badge ${premium ? "subscription-badge-primary" : ""}`}>
            {premium && <MaterialIcon>auto_awesome</MaterialIcon>}
            {plan.badge}
          </span>
          {!premium && <span className="subscription-muted-small">{plan.status}</span>}
          {premium && (
            <span className="subscription-badge subscription-badge-soft">
              {plan.secondaryBadge || "Impulsa tu carrera"}
            </span>
          )}
        </div>

        <div className="subscription-plan-heading">
          <div>
            <h2>{plan.title}</h2>
            <p className="subscription-plan-description">{plan.description}</p>
          </div>
          <div className={`subscription-price-box ${premium ? "subscription-price-box-premium" : ""}`}>
            <div className="subscription-price-line">
              <span className="subscription-price">{plan.price}</span>
              <span className="subscription-price-currency">{plan.billing}</span>
            </div>
            { plan.taxIncludedText &&
              <div className="subscription-tax-badge">
                <MaterialIcon>verified</MaterialIcon> {plan.taxIncludedText}
              </div>
            }
            <p>{plan.note}</p>
          </div>
        </div>

        <Link
          className={`subscription-cta ${premium ? "subscription-cta-primary" : ""}`}
          to={plan.href}
        >
          {plan.cta}
          <MaterialIcon>arrow_forward</MaterialIcon>
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
                <div
                  className={"subscription-feature-card"}
                  key={`${feature.title}-${index}`}
                >
                  <div className="subscription-feature-title-row">
                    <span className="subscription-feature-icon">
                      <MaterialIcon>{feature.icon}</MaterialIcon>
                    </span>
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
                  <span key={text}>
                    <MaterialIcon>{icon}</MaterialIcon>
                    {text}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {!premium && (
        <div className="subscription-plan-footer">
          <MaterialIcon>check_circle</MaterialIcon>
          <span>{plan.footer}</span>
        </div>
      )}
    </article>
  );
}

function PlanCardCompany({ plan }) {
  const isHighlighted = !!plan.highlighted;
  const isPaid = plan.price !== "$0";

  return (
    <article
      className={`subscription-plan subscription-plan-card-company ${
        isHighlighted ? "featured" : ""
      }`}
    >
      {(isHighlighted || isPaid) && <div className="subscription-plan-accent" />}
      <div className="subscription-plan-content">
        <div className="subscription-plan-badges">
          <span
            className={`subscription-badge ${
              isHighlighted ? "subscription-badge-primary" : ""
            }`}
          >
            {isHighlighted && <MaterialIcon>stars</MaterialIcon>}
            {plan.badge}
          </span>
          {plan.secondaryBadge && (
            <span className="subscription-badge subscription-badge-soft">
              {plan.secondaryBadge}
            </span>
          )}
          {!isHighlighted && !plan.secondaryBadge && (
            <span className="subscription-muted-small">{plan.status}</span>
          )}
        </div>

        <div className="subscription-plan-heading">
          <h2>{plan.title}</h2>
          <p className="subscription-plan-description">{plan.description}</p>

          <div
            className={`subscription-price-box ${
              isHighlighted ? "subscription-price-box-premium" : ""
            }`}
          >
            <div className="subscription-price-line">
              <span className="subscription-price">{plan.price}</span>
              <span className="subscription-price-currency">{plan.billing}</span>
            </div>
            { plan.taxIncludedText &&
              <div className="subscription-tax-badge">
                <MaterialIcon>verified</MaterialIcon> {plan.taxIncludedText}
              </div>
            }
            <p>{plan.note}</p>
          </div>
        </div>

        <Link
          className={`subscription-cta ${isHighlighted ? "subscription-cta-primary" : ""}`}
          to={plan.href}
        >
          {plan.cta}
          <MaterialIcon>
            {isHighlighted ? "rocket_launch" : "arrow_forward"}
          </MaterialIcon>
        </Link>

        <div className="subscription-divider" />
        <h3 className="subscription-feature-heading">{plan.featuresTitle}</h3>
        <CheckList items={plan.features} />
      </div>

      <div className="subscription-plan-footer">
        <MaterialIcon>verified</MaterialIcon>
        <span>{plan.footer}</span>
      </div>
    </article>
  );
}

export default function SubscriptionPage() {
  const { rol } = useContext(RoleContext);
  const [activeRole, setActiveRole] = useState("CANDIDATO");

  useEffect(() => {
    if (rol === null || !["CANDIDATO", "EMPRESA"].includes(rol)) return;
    setActiveRole(rol);
  }, [rol]);

  const candidateContent = subscriptionContent.CANDIDATO;
  const companyContent = subscriptionContent.EMPRESA;

  return (
    <Layout>
      <div className="subscription-page">
        <main className="subscription-main">
          <div className="subscription-glow" />
          <section className="subscription-hero">
            <div className="subscription-eyebrow">
              <MaterialIcon>workspace_premium</MaterialIcon> PLANES DE SUSCRIPCIÓN
            </div>
            <h1>
              Elige el plan ideal para impulsar tu futuro o{" "}
              <span>encontrar el mejor talento</span>
            </h1>
            <p>
              Todos nuestros planes tienen IVA incluido. Descubre las herramientas que SeedJobs
              tiene para ayudarte a encontrar oportunidades laborales o conectar con el talento
              adecuado.
            </p>

            {!["EMPRESA", "CANDIDATO"].includes(rol) && (
              <div
                className="subscription-switch"
                role="tablist"
                aria-label="Tipo de suscripción"
              >
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
                        <span>
                          {role === "CANDIDATO" ? (
                            <ListSvg name={"usuario"} width={20} height={20} />
                          ) : (
                            <ListSvg name={"empresa"} width={20} height={20} />
                          )}
                        </span>
                        {item.label}
                        <span className="subscription-tab-subtitle">
                          ({item.subtitle})
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Sección de planes según el rol seleccionado */}
          {activeRole === "CANDIDATO" ? (
            <section
              className="subscription-deck"
              id="subscription-plans"
              role="tabpanel"
              aria-labelledby="subscription-tab-CANDIDATO"
            >
              <PlanCardCandidate plan={candidateContent.free} />
              <PlanCardCandidate plan={candidateContent.premium} premium />
            </section>
          ) : (
            <>
              <section
                className="subscription-deck--grid-4"
                id="subscription-plans"
                role="tabpanel"
                aria-labelledby="subscription-tab-EMPRESA"
              >
                {companyContent.plans.map((plan) => (
                  <PlanCardCompany key={plan.id} plan={plan} />
                ))}
              </section>

              {/* Detalle visual de herramientas para empresas */}
              <section
                className="subscription-company-features-section"
                aria-label="Herramientas empresariales"
              >
                <div className="subscription-company-features-header">
                  <div className="subscription-eyebrow">
                    <MaterialIcon>smart_toy</MaterialIcon> HERRAMIENTAS INTELIGENTES
                  </div>
                  <h2>Funcionalidades avanzadas para tu empresa</h2>
                  <p>
                    Diseñadas para acelerar tus procesos de contratación y optimizar la
                    selección de personal con inteligencia artificial.
                  </p>
                </div>
                <div className="subscription-company-features-grid">
                  {companyContent.featuresOverview.map((feature, index) => (
                    <div
                      className="subscription-feature-card"
                      key={`${feature.title}-${index}`}
                    >
                      <div className="subscription-feature-title-row">
                        <span className="subscription-feature-icon">
                          <MaterialIcon>{feature.icon}</MaterialIcon>
                        </span>
                        <h3>{feature.title}</h3>
                      </div>
                      <p>{feature.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </Layout>
  );
}
