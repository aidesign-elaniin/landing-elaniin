export type CaseStudy = {
  id: string;
  theme: "vivid" | "black" | "excellence";
  title: string; // short title: the client is already shown by its logo, so the name is not repeated
  heroTitle?: string; // title on the hero wallet card when it differs from the cases section
  logo: string; // file in /public
  logoRatio: number; // width / height of the logo file
  logoH: { card: number; modal: number }; // heights (px) tuned so every logo carries a similar visual weight
  tag: string;
  summary?: string; // line under the modal title; left out when it would repeat the title
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
  /** Project sheet. Only the cases taken from elaniin.com/work have it. */
  ficha?: { tipo: string; duracion: string; tecnologias: string };
};

export const cases: CaseStudy[] = [
  {
    id: "tse",
    theme: "vivid",
    title: "Consulta de centros de votación a escala nacional",
    logo: "/certifications/tribuna-supremo-electoral.svg",
    logoRatio: 512.93 / 72.95,
    logoH: { card: 36, modal: 30 },
    tag: "Sector público · Plataforma ciudadana",
    summary: "Millones de consultas con disponibilidad cercana al 100\u00a0% durante la elección.",
    button: "Ver caso",
    client: "Tribunal Supremo Electoral",
    highlight: { value: "Millones", label: "de consultas ciudadanas durante el proceso electoral" },
    detail: {
      client: "Tribunal Supremo Electoral · El Salvador",
      industry: "Sector público · Servicios ciudadanos",
      service: "Desarrollo de software · Plataforma de alta demanda",
      challenge:
        "La plataforma nacional de consulta de centros de votación para elecciones presidenciales y legislativas debía operar 24/7, soportar millones de consultas en periodos cortos y funcionar en dispositivos de gama baja y redes móviles. Los sistemas anteriores tenían dificultades en picos de tráfico, no estaban optimizados para móvil y representaban riesgos en el manejo de la base de datos nacional de votantes.",
      solution: [
        "Frontend en React optimizado para rendimiento, bajo consumo de datos y acceso mobile first.",
        "Integración segura con los sistemas del TSE.",
        "Cifrado estricto y controles de acceso.",
        "Infraestructura diseñada para soportar demanda concurrente masiva.",
      ],
      results: [
        "Millones de consultas ciudadanas exitosas durante el proceso electoral.",
        "Disponibilidad cercana al 100\u00a0% durante todo el proceso.",
        "Tiempos de respuesta rápidos bajo demanda pico.",
        "Manejo seguro de la base de datos nacional de votantes.",
        "Mejor experiencia ciudadana y mayor confianza institucional.",
        "Uno de los servicios digitales más utilizados del proceso electoral.",
      ],
      cta: "¿Tu institución necesita una plataforma que funcione cuando más se usa? Hablemos.",
    },
  },
  {
    id: "credicomer",
    theme: "black",
    title: "Apertura de cuenta 100\u00a0%\u00a0digital",
    logo: "/sectors/credicomer.svg",
    logoRatio: 185 / 43,
    logoH: { card: 46, modal: 40 },
    tag: "Banca · Producto digital",
    summary: "Cuenta de ahorro en tres minutos, con verificación de identidad por IA y banca en línea de alta disponibilidad.",
    button: "Ver caso",
    client: "Credicomer · El Salvador",
    highlight: { value: "3 minutos", label: "para abrir una cuenta de ahorro, sin visitar una agencia" },
    detail: {
      client: "Credicomer · El Salvador",
      industry: "Banca",
      service: "Desarrollo de software · Banca digital y producto móvil",
      challenge:
        "Credicomer necesitaba un producto para que nuevos clientes abrieran una cuenta de ahorro sin presentarse en una agencia, y una banca en línea renovada con una experiencia de primer nivel para personas naturales y jurídicas.",
      solution: [
        "Rapicuenta: app móvil para abrir una cuenta de ahorro simplificada en tres minutos.",
        "Verificación de identidad con IA, mediante fotografía del documento y del rostro, y aceptación del contrato durante el registro.",
        "Credicomer en Línea: actualización completa de la banca web y móvil sobre una arquitectura escalable y de alta disponibilidad.",
        "Inicio de sesión con biometría y transacciones en pocos pasos.",
      ],
      results: [
        "Apertura de cuenta 100\u00a0% digital, sin visitar una agencia.",
        "Verificación de identidad automatizada con validación de documento y rostro.",
        "Banca web y móvil con arquitectura escalable y de alta disponibilidad.",
        "Transferencias, pagos y consultas de balance de forma rápida y segura.",
      ],
      cta: "¿Tu organización necesita un producto digital crítico? Conversemos.",
    },
  },
  {
    id: "procesar",
    theme: "black",
    title: "Más de 100 APIs críticas migradas sin interrupciones",
    heroTitle: "Arquitectura de APIs unificada y segura en Google Cloud",
    logo: "/certifications/procesar.svg",
    logoRatio: 470.94 / 88.13,
    logoH: { card: 28, modal: 32 },
    tag: "Seguros y pensiones · Google Cloud",
    summary: "Arquitectura de APIs unificada y segura en Google Cloud.",
    button: "Ver caso",
    client: "Procesar · México",
    highlight: { value: "150 APIs", label: "migradas sin interrumpir los servicios conectados a CONSAR" },
    detail: {
      client: "Procesar · México",
      industry: "Seguros y pensiones",
      service: "Google Cloud · Modernización de arquitectura",
      challenge:
        "Procesar opera infraestructura crítica para la Comisión Nacional del Sistema de Ahorro para el Retiro (CONSAR). Su ecosistema tenía unas 150 APIs repartidas en plataformas legacy, sin políticas unificadas de seguridad, control de acceso ni monitoreo.",
      solutionIntro: "Migración completa hacia Apigee, la plataforma de gestión de APIs de Google Cloud, desde el discovery hasta producción:",
      solution: [
        "Discovery técnico de unas 150 APIs, con documentación de endpoints, dependencias y reglas de negocio.",
        "Plan de migración por fases, priorizando las APIs críticas.",
        "Arquitectura en Apigee con políticas centralizadas de seguridad (OAuth, API Keys, JWT), rate limiting, cuotas y caching.",
        "Migración progresiva sin interrupciones, con pruebas funcionales, de rendimiento y de regresión, integrada a los pipelines de CI/CD existentes.",
        "Entrenamiento en fundamentos de Apigee para 10 personas de su equipo.",
      ],
      results: [
        "Ecosistema de APIs unificado bajo una sola plataforma.",
        "Seguridad centralizada y monitoreo avanzado.",
        "Trazabilidad completa de llamadas, errores y rendimiento.",
        "Cumplimiento con los estándares de instituciones críticas como CONSAR.",
        "Arquitectura lista para el crecimiento regulatorio y operativo.",
        "Equipo interno capacitado para operar y evolucionar la plataforma.",
      ],
      cta: "¿Tu organización necesita modernizar su arquitectura? Hablemos.",
    },
  },
  {
    id: "publimovil",
    theme: "excellence",
    title: "Una red de pantallas digitales lista para crecer en Google Cloud",
    heroTitle: "La infraestructura de una red de pantallas digitales, en Google Cloud",
    logo: "/sectors/publimovil.svg",
    logoRatio: 1641.43 / 343.06,
    logoH: { card: 30, modal: 32 },
    tag: "Medios y publicidad · Google Cloud",
    button: "Ver caso",
    client: "Publimóvil",
    highlight: { value: "+200 pantallas", label: "migradas con monitoreo centralizado" },
    detail: {
      client: "Publimóvil",
      industry: "Medios y publicidad",
      service: "Google Cloud · Migración y modernización",
      challenge:
        "Publimóvil opera una red de pantallas digitales que crece en varios países. Su infraestructura limitaba la capacidad de sumar pantallas y mercados, centralizar el monitoreo y automatizar la operación.",
      solutionIntro: "Migración a Google Cloud y modernización de la operación de la red:",
      solution: [
        "Evaluación de la infraestructura actual y plan de migración por fases.",
        "Migración de cargas de trabajo y datos a Google Cloud sin interrumpir la exhibición de campañas.",
        "Arquitectura escalable para sumar pantallas y mercados sin rehacer la infraestructura.",
        "Monitoreo centralizado del estado de la red, con alertas automáticas.",
        "Automatización de procesos operativos sobre la nueva infraestructura.",
      ],
      results: [
        "Infraestructura de +200 pantallas operando en Google Cloud.",
        "Monitoreo en tiempo real de toda la red desde una sola consola.",
        "Base en la nube lista para crecer a nuevos mercados.",
      ],
      cta: "¿Tu infraestructura necesita crecer sin rehacerse? Hablemos.",
    },
  },
  {
    id: "jostens",
    theme: "excellence",
    title: "Ingenieros senior y líderes técnicos integrados a su equipo",
    logo: "/certifications/jostens.svg",
    logoRatio: 256.6 / 138.89,
    logoH: { card: 56, modal: 64 },
    tag: "Retail · Equipos de ingeniería",
    summary: "Staff augmentation nearshore con liderazgo técnico desde 2022.",
    button: "Ver caso",
    client: "Jostens · Estados Unidos",
    highlight: { value: "5 años", label: "como parte de su organización de ingeniería" },
    detail: {
      client: "Jostens · Estados Unidos",
      industry: "Manufactura personalizada, plataformas educativas y e-commerce",
      service: "Staff augmentation nearshore · Liderazgo técnico",
      challenge:
        "Al expandir sus plataformas digitales y de e-commerce, Jostens necesitaba liderar varios equipos de ingeniería en paralelo, mantener alta calidad de código y reducir deuda técnica, sin elevar significativamente sus costos de contratación en Estados Unidos.",
      solutionIntro: "Desde 2022, Elaniin provee ingenieros de software senior y líderes técnicos integrados en la organización de ingeniería de Jostens, aportando ejecución y liderazgo:",
      solution: [
        "Fortalecimiento de decisiones de arquitectura.",
        "Mejores estándares de QA y desarrollo.",
        "Metodologías ágiles reforzadas.",
        "Gestión de roadmaps de producto complejos entre equipos de Estados Unidos y Latinoamérica.",
      ],
      results: [
        "Ciclos de entrega más cortos en iniciativas de e-commerce y manufactura.",
        "Menor deuda técnica y mayor calidad de código.",
        "Mejor organización y liderazgo de los equipos de ingeniería.",
        "Colaboración fluida entre equipos nearshore y de Estados Unidos.",
        "Costos optimizados frente a la contratación tradicional en Estados Unidos.",
      ],
      cta: "¿Necesitas ampliar tu capacidad de ingeniería? Conversemos.",
    },
  },
  // ---------- Cases from elaniin.com/work (scraped Nov 9 2026, translated from English; raw data in docs/elaniin-work-scrape.json).
  // Not shown anywhere today (the agent that used them was removed): add an id to a variant's `cases.ids` to show one.
  {
    id: "dgme",
    theme: "excellence",
    title: "Sistema de control migratorio de un país",
    logo: "/sectors/dgme.svg",
    logoRatio: 170 / 45,
    logoH: { card: 46, modal: 40 },
    tag: "Sector público · Migración a la nube",
    summary: "Renovación de los sistemas de control migratorio de El Salvador: de un sistema legacy on-premise de 12 años a la nube.",
    button: "Ver caso",
    client: "Dirección General de Migración y Extranjería · El Salvador",
    highlight: { value: "86 millones", label: "de registros, desde un sistema on-premise de 12 años" },
    ficha: { tipo: "Team augmentation", duracion: "12 meses", tecnologias: "React, Next.js, Laravel, PHP, SQL, AWS" },
    detail: {
      client: "Dirección General de Migración y Extranjería · El Salvador",
      industry: "Sector público · Control migratorio",
      service: "Desarrollo de software · Migración a la nube",
      challenge:
        "La Dirección General de Migración y Extranjería procesaba cerca de 86 millones de registros migratorios en sus fronteras marítimas, aéreas y terrestres con un sistema legacy on-premise de 12 años. La experiencia de uso causaba demoras en el trabajo de los agentes migratorios.",
      solution: [
        "Migración de más de 86 millones de registros a la nube mediante un proceso ETL, sin margen de error.",
        "Nueva arquitectura en la nube y nueva estructura de datos, en reemplazo de una arquitectura on-premise que no escalaba.",
        "Rediseño del proceso migratorio para agentes, viajeros y consulados.",
      ],
      results: [
        "Sistema Integrado de Gestión Migratoria en la nube para agentes y viajeros.",
        "Sistema de Emisión de Visas: trámite en línea con respuesta de los consulados.",
        "Web app de viajeros: prechequeo y declaración de aduana desde el teléfono, con código QR.",
      ],
      cta: "¿Tu institución necesita una plataforma que funcione cuando más se usa? Hablemos.",
    },
  },
  {
    id: "mercandu",
    theme: "vivid",
    title: "El marketplace más grande de Centroamérica",
    logo: "/sectors/mercandu.svg",
    logoRatio: 170 / 45,
    logoH: { card: 46, modal: 40 },
    tag: "Comercio electrónico · Marketplace",
    summary: "Plataforma web y app móvil de comercio electrónico, con arquitectura de microservicios y operación en varios países.",
    button: "Ver caso",
    client: "Mercandú · Centroamérica",
    highlight: { value: "+500,000", label: "productos en el catálogo" },
    ficha: { tipo: "Proyecto completo", duracion: "En curso", tecnologias: "Laravel, NodeJS, ElasticSearch, React Native, MySQL, Vue, Docker, Kubernetes" },
    detail: {
      client: "Mercandú · Centroamérica",
      industry: "Comercio electrónico",
      service: "Desarrollo de software · Marketplace web y móvil",
      challenge:
        "La pandemia aceleró el consumo en línea en Centroamérica y abrió la oportunidad de crear una plataforma con una experiencia real de compra en línea para la región.",
      solution: [
        "Arquitectura de microservicios escalable para administrar un catálogo de más de 500,000 productos.",
        "Adaptación a leyes locales, nuevos proveedores, servicios de envío y varias monedas para operar en El Salvador, Guatemala y Honduras.",
        "Integración de comercios locales a la plataforma, con su manejo de datos y logística de envíos.",
      ],
      results: [
        "Experiencia de compra en sitio web y aplicación móvil.",
        "Más de 500,000 productos en categorías como tecnología, hogar, vitaminas, maquillaje, mascotas y juguetes.",
        "Expansión de El Salvador a Guatemala, con apertura en Honduras.",
      ],
      cta: "¿Tu organización necesita un producto digital crítico? Conversemos.",
    },
  },
  {
    id: "bancoazul",
    theme: "black",
    title: "Nueva generación de banca digital",
    logo: "/sectors/banco-azul.svg",
    logoRatio: 170 / 45,
    logoH: { card: 46, modal: 40 },
    tag: "Banca · App móvil",
    summary: "Aplicación de banca móvil para iOS y Android, construida desde cero con una navegación más simple.",
    button: "Ver caso",
    client: "Banco Azul · El Salvador",
    highlight: { value: "iOS y Android", label: "banca móvil construida desde cero" },
    ficha: { tipo: "Team y staff augmentation", duracion: "7 + 9 meses", tecnologias: "Swift 5 (iOS), Kotlin (Android)" },
    detail: {
      client: "Banco Azul · El Salvador",
      industry: "Banca",
      service: "Desarrollo de software · Banca móvil",
      challenge:
        "La banca en línea necesitaba renovar la imagen y el funcionamiento de su aplicación. La navegación era complicada y varias secciones confundían al usuario.",
      solution: [
        "Navegación rediseñada para llegar a cada producto de forma intuitiva.",
        "Ingeniería inversa de servicios y flujos de transacción que no tenían documentación.",
        "Entrevistas con usuarios, prototipos y pruebas hasta llegar al producto final.",
        "Paso de metodología en cascada a ágil (Scrum).",
      ],
      results: [
        "Aplicación creada desde cero a partir de las funciones de la banca en línea existente.",
        "Todas las transacciones que los usuarios necesitaban, más fáciles de hacer desde la app.",
        "El banco extendió más contratos para seguir mejorando sus aplicaciones.",
      ],
      cta: "¿Tu organización necesita un producto digital crítico? Conversemos.",
    },
  },
  {
    id: "transexpress",
    theme: "excellence",
    title: "Logística de comercio electrónico renovada",
    logo: "/sectors/trans-express.svg",
    logoRatio: 170 / 45,
    logoH: { card: 46, modal: 40 },
    tag: "Logística · Plataforma web",
    summary: "Nuevo sitio web y panel de usuario para un líder en logística de comercio electrónico internacional.",
    button: "Ver caso",
    client: "Trans-Express · Latinoamérica y el Caribe",
    highlight: { value: "11 meses", label: "para renovar el sitio y el panel de usuario" },
    ficha: { tipo: "Team augmentation", duracion: "11 meses", tecnologias: "Laravel (PHP), Statamic, Vue.js" },
    detail: {
      client: "Trans-Express · Latinoamérica y el Caribe",
      industry: "Logística · Comercio electrónico internacional",
      service: "Desarrollo de software · Sitio web y panel de usuario",
      challenge:
        "Un líder en casilleros de Miami y logística de comercio electrónico internacional para Latinoamérica y el Caribe necesitaba actualizar su sitio y su panel de usuario: la tecnología y la interfaz estaban desactualizadas y eran poco amigables.",
      solution: [
        "Arquitectura nueva, escalable y adaptable a cambios futuros.",
        "Panel de usuario rediseñado para gestionar paquetes y casilleros con facilidad.",
        "Actualización de tecnología e interfaz, con todos los servicios de Trans-Express integrados a las nuevas pantallas.",
      ],
      results: [
        "Plataforma completamente nueva con los servicios principales de Trans-Express.",
        "Forma más amigable y segura de ver la información de los paquetes y hacer solicitudes.",
        "Nueva forma de consumir los servicios desde el frontend, que permite sumar cambios y funciones.",
      ],
      cta: "¿Tu organización necesita un producto digital crítico? Conversemos.",
    },
  },
  {
    id: "graziela",
    theme: "black",
    title: "Joyería de lujo con la tecnología correcta",
    logo: "/sectors/graziela.svg",
    logoRatio: 170 / 45,
    logoH: { card: 46, modal: 40 },
    tag: "Comercio electrónico · Joyería de lujo",
    summary: "Catálogo, buscador y tienda en línea renovados para una marca de joyería de lujo.",
    button: "Ver caso",
    client: "Graziela",
    highlight: { value: "8 meses", label: "para renovar catálogo, buscador y tienda en línea" },
    ficha: { tipo: "Sitio web, app móvil y motion graphics", duracion: "8 meses", tecnologias: "WordPress, WooCommerce, PHP, AWS" },
    detail: {
      client: "Graziela",
      industry: "Comercio electrónico · Joyería de lujo",
      service: "Desarrollo de software · Tienda en línea",
      challenge:
        "La marca necesitaba mejorar su catálogo. Los filtros de búsqueda no eran interactivos, no dejaban ver la variedad ni el detalle de los productos, y el buscador era lento.",
      solution: [
        "Sesión estratégica de diseño de producto para definir los criterios clave de búsqueda.",
        "Tienda en línea con WooCommerce sobre WordPress: páginas de producto, carrito y proceso de pago.",
        "Sitio adaptable, cuidado en lo visual y funcional.",
      ],
      results: [
        "Buscador eficiente para encontrar productos con facilidad.",
        "Mayor velocidad de la plataforma y mejor rendimiento del servidor.",
        "Transacciones seguras y fluidas en la tienda en línea.",
      ],
      cta: "¿Tu organización necesita un producto digital crítico? Conversemos.",
    },
  },
];
