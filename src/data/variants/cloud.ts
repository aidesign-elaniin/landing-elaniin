import type { Variant } from ".";

export const cloud: Variant = {
  id: "cloud",
  title: "Migración, modernización y operación cloud",
  hero: {
    h1: "Tu operación no puede detenerse.",
    accent: "Tu nube tampoco.",
    subtitle: "Migración, modernización y operación cloud para empresas e instituciones, con arquitectura segura, gobernanza centralizada y sin interrumpir los servicios críticos.",
    button: "Evalúa tu proyecto cloud",
    // partnerships visible on arrival (Adrián, Nov 11 2026); same official badge files as the backing section
    partners: {
      label: "Partner de Google Cloud y AWS",
      badges: [
        { file: "gcp-services-select", alt: "Google Cloud Select, Services Partner", w: 546, h: 373 },
        { file: "badge-clutch-aws", alt: "AWS Partner, Premier Tier Services", w: 377, h: 377 },
      ],
    },
  },
  problem: "Migrar no debería significar arriesgar lo que ya funciona.",
  capabilities: {
    title: "Arquitectura, migración y operación en la nube.",
    items: [
      { nombre: "Assessment y estrategia de migración", texto: "Inventario técnico, mapa de dependencias y plan por fases que prioriza lo crítico.", piezas: ["Inventario técnico", "Mapa de dependencias", "Plan por fases"] },
      { nombre: "Migración y modernización", texto: "De entornos legacy u on-premise a Google Cloud y AWS, con pruebas en cada fase.", piezas: ["Legacy", "On-premise", "Google Cloud", "AWS", "Pruebas en cada fase"] },
      { nombre: "Gestión de APIs con Apigee", texto: "Políticas de seguridad (OAuth, JWT, API Keys), rate limiting, cuotas y observabilidad centralizada.", piezas: ["OAuth", "JWT", "API Keys", "Rate limiting", "Cuotas", "Observabilidad"] },
      { nombre: "Operación y gobernanza", texto: "Monitoreo, control de accesos y arquitectura preparada para demanda pico.", piezas: ["Monitoreo", "Control de accesos", "Demanda pico"] },
    ],
  },
  cases: { title: "Infraestructura crítica que ya opera en la nube.", ids: ["procesar", "publimovil", "tse"] },
};
