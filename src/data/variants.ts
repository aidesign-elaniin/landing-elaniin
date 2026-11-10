// Mode 1 copy per variant. Source: "Landing Elaniin — Textos finales (Software y Cloud)", Nov 9 2026. Do not edit copy here without the doc.
export type VariantId = "software" | "cloud";

export type Variant = {
  id: VariantId;
  path: string;
  hero: { h1: string; accent: string; subtitle: string; proof: string; seals?: string[]; button: string };
  problem: string;
  capabilities: { title: string; names: string[] };
  cases: { title: string; ids: string[] };
  closing: { title: string; button: string };
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
    closing: { title: "Tu próximo proyecto crítico, con ingeniería de primer nivel.", button: "Conversemos sobre tu proyecto" },
  },
  cloud: {
    id: "cloud",
    path: "/cloud",
    hero: {
      h1: "Tu operación no puede detenerse.",
      accent: "Tu nube tampoco.",
      subtitle: "Migración, modernización y operación cloud para empresas e instituciones, con arquitectura segura, gobernanza centralizada y sin interrumpir los servicios críticos.",
      proof: "Cientos de APIs críticas migradas a Apigee sin interrumpir servicios regulados.",
      seals: ["Google Cloud Partner", "AWS Partner"],
      button: "Evalúa tu proyecto cloud",
    },
    problem: "Migrar no debería significar arriesgar lo que ya funciona.",
    capabilities: {
      title: "Arquitectura, migración y operación en la nube.",
      names: ["Assessment y estrategia de migración", "Migración y modernización", "Gestión de APIs con Apigee", "Operación y gobernanza"],
    },
    cases: { title: "Infraestructura crítica que ya opera en la nube.", ids: ["procesar", "tse"] },
    closing: { title: "Lleva tu operación a la nube sin detenerla.", button: "Conversemos sobre tu proyecto" },
  },
};
