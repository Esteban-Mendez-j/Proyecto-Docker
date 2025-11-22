export const ciudadesColombia = [
  "Leticia", // Amazonas
  "Medellín", // Antioquia
  "Arauca", // Arauca
  "Barranquilla", // Atlántico
  "Bogotá", // Cundinamarca / Capital
  "Cartagena", // Bolívar
  "Tunja", // Boyacá
  "Manizales", // Caldas
  "Florencia", // Caquetá
  "Yopal", // Casanare
  "Popayán", // Cauca
  "Valledupar", // Cesar
  "Quibdó", // Chocó
  "Montería", // Córdoba
  "Neiva", // Huila
  "Riohacha", // La Guajira
  "Santa Marta", // Magdalena
  "Villavicencio", // Meta
  "Pasto", // Nariño
  "Cúcuta", // Norte de Santander
  "Mocoa", // Putumayo
  "Armenia", // Quindío
  "Pereira", // Risaralda
  "San Andrés", // San Andrés y Providencia
  "Bucaramanga", // Santander
  "Sincelejo", // Sucre
  "Ibagué", // Tolima
  "Cali", // Valle del Cauca
  "Mitú", // Vaupés
  "Puerto Carreño" // Vichada
];


export const departamentoColombia = {
  "Leticia": "Amazonas",
  "Medellín": "Antioquia",
  "Arauca": "Arauca",
  "Barranquilla": "Atlántico",
  "Bogotá": "Cundinamarca",
  "Cartagena": "Bolívar",
  "Tunja": "Boyacá",
  "Manizales": "Caldas",
  "Florencia": "Caquetá",
  "Yopal": "Casanare",
  "Popayán": "Cauca",
  "Valledupar": "Cesar",
  "Quibdó": "Chocó",
  "Montería": "Córdoba",
  "Neiva": "Huila",
  "Riohacha": "La Guajira",
  "Santa Marta": "Magdalena",
  "Villavicencio": "Meta",
  "Pasto": "Nariño",
  "Cúcuta": "Norte de Santander",
  "Mocoa": "Putumayo",
  "Armenia": "Quindío",
  "Pereira": "Risaralda",
  "San Andrés": "San Andrés y Providencia",
  "Bucaramanga": "Santander",
  "Sincelejo": "Sucre",
  "Ibagué": "Tolima",
  "Cali": "Valle del Cauca",
  "Mitú": "Vaupés",
  "Puerto Carreño": "Vichada"
};



export const listEducacion = [
    "Técnico",
    "Doctorado",
    "PostGrado",
    "Bachiller",
]


export const listAptitudes = {
    PensamientoCritico: "Pensamiento Critico",
    Creatividad: "Creatividad",
    AtencionDetalle: "Atencion al detalle",
    AprendizajeContinuo: "Aprendizaje continuo",
    EticaProfesional: "Etica Profesional",
    Autonomia: "Autonomia",
    Responsabilidad: "Responsabilidad",
    Liderazgo: "Liderazgo",
    ResolucionProblemas: "Resolucion de Problemas",
    ComunicacionAfectiva: "Comunicacion Afectiva",
    TrabajoEquipo: "Trabajo en Equipo",
    Adaptabilidad: "Adaptabilidad"
}


export const sectores = [
    "Tecnologia de la Informacion (TI) / Software",
    "Salud y Medicina",
    "Educacion y Formacion",
    "Construccion e Infraestructura",
    "Manufactura e Industria",
    "Comercio y Ventas",
    "Logistica y Transporte",
    "Banca, Finanzas y Seguros",
    "Agroindustria y Agricultura",
    "Legal y Juridico",
    "Turismo, Hoteleria y Gastronomia",
    "Medios, Comunicacion y Publicidad",
    "Energia y Mineria",
    "Servicios Profesionales y Consultoria",
    "Arte, Cultura y Entretenimiento",
    "Bienes Raices e Inmobiliaria",
    "Ciencia e Investigacion",
    "Organizaciones sin Fines de Lucro y ONG",
    "Otros"
];


export const mensajesNotificaciones = (tituloVacante, estadoPostulacion) => {
    const mensaje = {
        rechazada: {
            asunto: "Actualización sobre tu postulación",
            cuerpo: `Agradecemos tu interés en la vacante ${tituloVacante}. Tras revisar tu perfil, la empresa ha decidido continuar con otros candidatos. Te invitamos a seguir postulando a otras oportunidades.`,
        },
        aceptada: {
            asunto: "¡Felicidades! Tu postulación ha sido aceptada",
            cuerpo: `Nos complace informarte que tu postulación para la vacante ${tituloVacante} ha sido aceptada. La empresa revisó tu perfil y desea continuar con el proceso de selección. Pronto recibirás más información sobre los siguientes pasos.`,
        },
        espera: {
            asunto: "Tu postulación está siendo revisada",
            cuerpo: "Hemos recibido tu postulación y se encuentra en proceso de revisión por parte de la empresa. Te notificaremos tan pronto como se actualice el estado."
        },
        cancelada: {
            asunto: "La vacante ha sido cancelada",
            cuerpo: `Lamentamos informarte que la empresa ha decidido cancelar el proceso de selección para la vacante ${tituloVacante} a la que postulaste. Agradecemos tu interés y te invitamos a explorar nuevas oportunidades en la plataforma.`
        }
    };

    return mensaje[estadoPostulacion];
};
