import type { Variant } from "@/lib/landing";

export const software: Variant = {
  id: "software",
  hero: {
    h1: "Proyectos críticos merecen",
    accent: "ingeniería de primer nivel.",
    subtitle: "Desarrollo end-to-end de plataformas críticas para empresas e instituciones, con un estándar de calidad verificado antes de cada entrega.",
    button: "Conversemos sobre tu proyecto",
  },
  problem: "Detrás de cada requerimiento hay un objetivo de negocio. Ahí empieza nuestra ingeniería.",
  capabilities: {
    title: "Del discovery a producción, un solo equipo.",
    items: [
      { nombre: "Discovery y arquitectura", texto: "Levantamos requerimientos, reglas de negocio y dependencias antes de escribir la primera línea de código.", piezas: ["Requerimientos", "Reglas de negocio", "Dependencias"] },
      { nombre: "Desarrollo de plataformas", texto: "Web, mobile nativo para iOS y Android, sistemas core, ERP e integraciones vía APIs.", piezas: ["Web", "iOS", "Android", "Sistemas core", "ERP", "APIs"] },
      { nombre: "QA y despliegue", texto: "Pruebas funcionales, de rendimiento y de regresión integradas a pipelines de CI/CD.", piezas: ["Pruebas funcionales", "Rendimiento", "Regresión", "CI/CD"] },
      { nombre: "Evolución y soporte", texto: "Mantenimiento y nuevas funcionalidades sin comprometer lo que ya opera.", piezas: ["Mantenimiento", "Nuevas funcionalidades", "Lo que ya opera"] },
    ],
  },
  cases: {
    title: "Soluciones para operaciones críticas de organizaciones líderes.",
    ids: ["tse", "credicomer", "jostens"],
    heroTags: { credicomer: "Banca · Desarrollo a medida", tse: "Sector público · Modernización", jostens: "Manufactura · Equipo dedicado" },
  },
};
