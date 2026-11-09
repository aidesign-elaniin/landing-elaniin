export type CaseStudy = {
  id: string;
  featured?: boolean;
  theme: "vivid" | "black" | "excellence";
  title: string; // short title: the client is already shown by its logo, so the name is not repeated
  logo: string; // file in /public
  logoRatio: number; // width / height of the logo file
  logoH: { card: number; modal: number }; // heights (px) tuned so every logo carries a similar visual weight
  tag: string;
  summary: string;
  button: string;
  client: string; // short client label under the logo
  highlight: { value: string; label: string };
  detail: {
    client: string;
    industry: string;
    service: string;
    challenge: string;
    solutionIntro?: string;
    solution: string[];
    results: string[];
    cta: string;
  };
};

export const cases: CaseStudy[] = [
  {
    id: "tse",
    featured: true,
    theme: "vivid",
    title: "Consulta electoral a escala nacional",
    logo: "/certifications/tribuna-supremo-electoral.svg",
    logoRatio: 512.93 / 72.95,
    logoH: { card: 36, modal: 30 },
    tag: "Sector público · Plataforma ciudadana",
    summary: "Millones de consultas ciudadanas con disponibilidad cercana al 100 % durante el proceso electoral.",
    button: "Ver caso",
    client: "Tribunal Supremo Electoral",
    highlight: { value: "Millones", label: "de consultas ciudadanas durante el proceso electoral" },
    detail: {
      client: "Tribunal Supremo Electoral · El Salvador",
      industry: "Sector público · Servicios ciudadanos",
      service: "Desarrollo de software · Plataforma de alta demanda",
      challenge:
        "La plataforma nacional de consulta de centros de votación para elecciones presidenciales y legislativas debía operar 24/7, soportar millones de consultas en periodos cortos y funcionar en dispositivos de gama baja y redes móviles. Los sistemas anteriores fallaban en picos de tráfico, no estaban optimizados para móvil y representaban riesgos en el manejo de la base de datos nacional de votantes.",
      solution: [
        "Frontend en React optimizado para rendimiento, bajo consumo de datos y acceso mobile first.",
        "Integración segura con los sistemas del TSE.",
        "Cifrado estricto y controles de acceso.",
        "Infraestructura diseñada para soportar demanda concurrente masiva.",
      ],
      results: [
        "Millones de consultas ciudadanas exitosas durante el proceso electoral.",
        "Disponibilidad cercana al 100 % durante todo el proceso.",
        "Tiempos de respuesta rápidos bajo demanda pico.",
        "Manejo seguro de la base de datos nacional de votantes.",
        "Uno de los servicios digitales más utilizados del proceso electoral.",
      ],
      cta: "¿Tu institución necesita una plataforma que funcione cuando más se usa? Hablemos.",
    },
  },
  {
    id: "procesar",
    theme: "black",
    title: "Migración de APIs a Apigee",
    logo: "/certifications/procesar.svg",
    logoRatio: 470.94 / 88.13,
    logoH: { card: 28, modal: 32 },
    tag: "Sector financiero regulado · Google Cloud",
    summary: "Cientos de APIs críticas migradas a Apigee, sin interrumpir servicios regulados por CONSAR.",
    button: "Ver caso",
    client: "Procesar · México",
    highlight: { value: "Cientos", label: "de APIs críticas migradas a Apigee" },
    detail: {
      client: "Procesar · México",
      industry: "Pensiones y servicios financieros regulados",
      service: "Google Cloud · Modernización de arquitectura",
      challenge:
        "Procesar opera infraestructura crítica para la Comisión Nacional del Sistema de Ahorro para el Retiro (CONSAR). Su ecosistema tenía cientos de APIs repartidas en plataformas legacy, sin políticas unificadas de seguridad, control de acceso ni monitoreo. Cada nueva funcionalidad ponía en riesgo los servicios existentes.",
      solutionIntro: "Elaniin ejecutó la migración completa hacia Apigee, la plataforma de gestión de APIs de Google Cloud, desde el discovery hasta producción:",
      solution: [
        "Discovery técnico de cientos de APIs, con documentación de endpoints, dependencias y reglas de negocio.",
        "Plan de migración por fases, priorizando las APIs críticas.",
        "Arquitectura en Apigee con políticas centralizadas de seguridad (OAuth, API Keys, JWT), rate limiting, cuotas y caching.",
        "Migración progresiva sin downtime, con pruebas funcionales, de rendimiento y de regresión, integrada a los pipelines de CI/CD existentes.",
      ],
      results: [
        "Ecosistema de APIs unificado bajo una sola plataforma.",
        "Seguridad centralizada y monitoreo avanzado.",
        "Trazabilidad completa de llamadas, errores y rendimiento.",
        "Cumplimiento con los estándares de instituciones críticas como CONSAR.",
        "Arquitectura lista para el crecimiento regulatorio y operativo.",
      ],
      cta: "¿Tu organización necesita modernizar su arquitectura? Hablemos.",
    },
  },
  {
    id: "jostens",
    theme: "excellence",
    title: "Ingeniería nearshore desde 2022",
    logo: "/certifications/jostens.svg",
    logoRatio: 256.6 / 138.89,
    logoH: { card: 56, modal: 64 },
    tag: "Estados Unidos · Equipos de ingeniería",
    summary: "Ingenieros senior y líderes técnicos integrados a su organización para acelerar la entrega y elevar la calidad.",
    button: "Ver caso",
    client: "Jostens · Estados Unidos",
    highlight: { value: "Desde 2022", label: "con ingenieros integrados a su organización" },
    detail: {
      client: "Jostens · Estados Unidos",
      industry: "Manufactura personalizada, plataformas educativas y e-commerce",
      service: "Staff augmentation nearshore · Liderazgo técnico",
      challenge:
        "Al expandir sus plataformas digitales y de e-commerce, Jostens necesitaba liderar varios equipos de ingeniería en paralelo, mantener alta calidad de código y reducir deuda técnica, sin elevar significativamente sus costos de contratación en Estados Unidos.",
      solutionIntro: "Desde 2022, Elaniin provee ingenieros de software senior y líderes técnicos que trabajan integrados en la organización de ingeniería de Jostens, aportando ejecución y liderazgo:",
      solution: [
        "Fortalecimiento de decisiones de arquitectura.",
        "Mejores estándares de QA y desarrollo.",
        "Metodologías ágiles reforzadas.",
        "Gestión de roadmaps de producto complejos entre equipos de Estados Unidos y Latinoamérica.",
      ],
      results: [
        "Ciclos de entrega más rápidos en iniciativas de e-commerce y manufactura.",
        "Menor deuda técnica y mayor calidad de código.",
        "Mejor organización y liderazgo de los equipos de ingeniería.",
        "Colaboración fluida entre equipos nearshore y de Estados Unidos.",
        "Costos optimizados frente a la contratación tradicional en Estados Unidos.",
      ],
      cta: "¿Necesitas ampliar tu capacidad de ingeniería? Conversemos.",
    },
  },
];
