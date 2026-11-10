// Mode 1 copy per variant. Source: "Landing Elaniin — Textos finales (Software y Cloud)", Nov 9 2026. Do not edit copy here without the doc.
export type VariantId = "software" | "cloud";

export type Variant = {
  id: VariantId;
  path: string;
  hero: { h1: string; accent: string; subtitle: string; proof: string; button: string };
  problem: string;
  capabilities: { title: string; names: string[] };
  cases: { title: string; ids: string[] };
};

export const variants: Record<VariantId, Variant> = {
  software: {
    id: "software",
    path: "/",
    hero: {
      h1: "Proyectos críticos merecen",
      accent: "ingeniería de primer nivel.",
      subtitle: "Desarrollo end-to-end de plataformas críticas para empresas e instituciones, con un estándar de calidad verificado antes de cada entrega.",
      proof: "+500 proyectos llevados a producción desde 2014.",
      button: "Conversemos sobre tu proyecto",
    },
    problem: "Detrás de cada requerimiento hay un objetivo de negocio. Ahí empieza nuestra ingeniería.",
    capabilities: {
      title: "Del discovery a producción, un solo equipo.",
      names: ["Discovery y arquitectura", "Desarrollo de plataformas", "QA y despliegue", "Evolución y soporte"],
    },
    cases: { title: "Soluciones para operaciones críticas de organizaciones líderes.", ids: ["tse", "credicomer", "jostens"] },
  },
  cloud: {
    id: "cloud",
    path: "/cloud",
    hero: {
      h1: "Tu operación no puede detenerse.",
      accent: "Tu nube tampoco.",
      subtitle: "Migración, modernización y operación cloud para empresas e instituciones, con arquitectura segura, gobernanza centralizada y sin interrumpir los servicios críticos.",
      proof: "Cientos de APIs críticas migradas a Apigee sin interrumpir servicios regulados.",
      button: "Evalúa tu proyecto cloud",
    },
    problem: "Migrar no debería significar arriesgar lo que ya funciona.",
    capabilities: {
      title: "Arquitectura, migración y operación en la nube.",
      names: ["Assessment y estrategia de migración", "Migración y modernización", "Gestión de APIs con Apigee", "Operación y gobernanza"],
    },
    cases: { title: "Infraestructura crítica que ya opera en la nube.", ids: ["procesar", "tse"] },
  },
};

/** Capabilities of each landing: parallel sub-services. `piezas` are the terms each text names, drawn as chips. */
export const CAPS = {
  cap_discovery: { grupo: "software", nombre: "Discovery y arquitectura", texto: "Levantamos requerimientos, reglas de negocio y dependencias antes de escribir la primera línea de código.", piezas: ["Requerimientos", "Reglas de negocio", "Dependencias"] },
  cap_desarrollo: { grupo: "software", nombre: "Desarrollo de plataformas", texto: "Web, mobile nativo para iOS y Android, sistemas core, ERP e integraciones vía APIs.", piezas: ["Web", "iOS", "Android", "Sistemas core", "ERP", "APIs"] },
  cap_qa: { grupo: "software", nombre: "QA y despliegue", texto: "Pruebas funcionales, de rendimiento y de regresión integradas a pipelines de CI/CD.", piezas: ["Pruebas funcionales", "Rendimiento", "Regresión", "CI/CD"] },
  cap_evolucion: { grupo: "software", nombre: "Evolución y soporte", texto: "Mantenimiento y nuevas funcionalidades sin comprometer lo que ya opera.", piezas: ["Mantenimiento", "Nuevas funcionalidades", "Lo que ya opera"] },
  cap_assessment: { grupo: "cloud", nombre: "Assessment y estrategia de migración", texto: "Inventario técnico, mapa de dependencias y plan por fases que prioriza lo crítico.", piezas: ["Inventario técnico", "Mapa de dependencias", "Plan por fases"] },
  cap_migracion: { grupo: "cloud", nombre: "Migración y modernización", texto: "De entornos legacy u on-premise a Google Cloud y AWS, con pruebas en cada fase.", piezas: ["Legacy", "On-premise", "Google Cloud", "AWS", "Pruebas en cada fase"] },
  cap_apigee: { grupo: "cloud", nombre: "Gestión de APIs con Apigee", texto: "Políticas de seguridad (OAuth, JWT, API Keys), rate limiting, cuotas y observabilidad centralizada.", piezas: ["OAuth", "JWT", "API Keys", "Rate limiting", "Cuotas", "Observabilidad"] },
  cap_operacion: { grupo: "cloud", nombre: "Operación y gobernanza", texto: "Monitoreo, control de accesos y arquitectura preparada para demanda pico.", piezas: ["Monitoreo", "Control de accesos", "Demanda pico"] },
} as const;
