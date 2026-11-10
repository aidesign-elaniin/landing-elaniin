// Agent with canvas (replaces the guided chat): the visitor writes, the agent answers with ONE sentence and a few
// visual blocks taken from this fixed catalog. The model only picks ids; every word shown in a block is from the
// final texts ("Textos finales (Software y Cloud)", Nov 9 2026). No React and no imports: `node --test` walks it.

export type Variante = "software" | "cloud";

/** Capabilities: one block each. `n` is its position on its group's four-step line. */
export const CAPS = {
  cap_discovery: { grupo: "software", n: 0, nombre: "Discovery y arquitectura", texto: "Levantamos requerimientos, reglas de negocio y dependencias antes de escribir la primera línea de código." },
  cap_desarrollo: { grupo: "software", n: 1, nombre: "Desarrollo de plataformas", texto: "Web, mobile nativo para iOS y Android, sistemas core, ERP e integraciones vía APIs." },
  cap_qa: { grupo: "software", n: 2, nombre: "QA y despliegue", texto: "Pruebas funcionales, de rendimiento y de regresión integradas a pipelines de CI/CD." },
  cap_evolucion: { grupo: "software", n: 3, nombre: "Evolución y soporte", texto: "Mantenimiento y nuevas funcionalidades sin comprometer lo que ya opera." },
  cap_assessment: { grupo: "cloud", n: 0, nombre: "Assessment y estrategia de migración", texto: "Inventario técnico, mapa de dependencias y plan por fases que prioriza lo crítico." },
  cap_migracion: { grupo: "cloud", n: 1, nombre: "Migración y modernización", texto: "De entornos legacy u on-premise a Google Cloud y AWS, con pruebas en cada fase." },
  cap_apigee: { grupo: "cloud", n: 2, nombre: "Gestión de APIs con Apigee", texto: "Políticas de seguridad (OAuth, JWT, API Keys), rate limiting, cuotas y observabilidad centralizada." },
  cap_operacion: { grupo: "cloud", n: 3, nombre: "Operación y gobernanza", texto: "Monitoreo, control de accesos y arquitectura preparada para demanda pico." },
} as const;
export const CAP_GROUPS: Record<Variante, { titulo: string; nombres: string[] }> = {
  software: { titulo: "Del discovery a producción, un solo equipo.", nombres: ["Discovery y arquitectura", "Desarrollo de plataformas", "QA y despliegue", "Evolución y soporte"] },
  cloud: { titulo: "Arquitectura, migración y operación en la nube.", nombres: ["Assessment y estrategia de migración", "Migración y modernización", "Gestión de APIs con Apigee", "Operación y gobernanza"] },
};

export const BLOCK_IDS = [
  "cap_discovery", "cap_desarrollo", "cap_qa", "cap_evolucion", "cap_assessment", "cap_migracion", "cap_apigee", "cap_operacion",
  "caso_tse", "caso_credicomer", "caso_procesar", "caso_jostens",
  "caso_dgme", "caso_mercandu", "caso_bancoazul", "caso_transexpress", "caso_graziela",
  "umbrales", "respaldo", "sector_publico", "contacto",
] as const;
export type BlockId = (typeof BLOCK_IDS)[number];

/** Follow-ups the agent may offer. A click sends the label as the visitor's next message. */
export const SUGGESTIONS = {
  calidad: "¿Cómo garantizan la calidad?",
  casos: "¿Tienen un caso parecido al mío?",
  respaldo: "¿Quién los respalda?",
  publico: "¿Trabajan con instituciones públicas?",
  nube: "¿Con qué nube trabajan?",
  alcance: "No tengo el alcance definido",
  equipo: "Necesito sumar ingenieros a mi equipo",
  banca: "¿Tienen experiencia en banca?",
  ecommerce: "¿Han hecho comercio electrónico?",
  logistica: "¿Tienen experiencia en logística?",
  datos: "¿Cómo migran datos sin perder información?",
  especialista: "Hablar con un especialista",
} as const;
export type SuggestionId = keyof typeof SUGGESTIONS;
export const SUGGESTION_IDS = Object.keys(SUGGESTIONS) as SuggestionId[];

export const CONSENT = "Acepto la política de privacidad y el tratamiento de mis datos.";
export const FALLBACK = "No tengo ese dato, pero un especialista te lo puede responder.";
export const CONTACT_LINE = "Déjanos tus datos y un especialista te contacta.";

export type AgentReply = { intencion: string; respuesta: string; bloques: string[]; sugerencias: string[]; perfil_detectado: { sector: string; servicio: string; nube: string } };
export type Turn = { user: string; agent: string; blocks: BlockId[] };
export type State = {
  variante: Variante;
  turns: Turn[];
  suggestions: SuggestionId[];
  perfil: { sector: string; servicio: string; nube: string };
  intents: string[];
};

export const start = (variante: Variante): State => ({ variante, turns: [], suggestions: [], perfil: { sector: "", servicio: "", nube: "" }, intents: [] });

export const seen = (s: State): BlockId[] => s.turns.flatMap((t) => t.blocks);

/**
 * Stand-in for the AI layer when there is no server to ask (static copy on GitHub Pages) or it is down.
 * ponytail: plain keyword rules, first match wins. It only has to keep the canvas useful; the real picking is /api/chat.
 */
const RULES: [RegExp, string, BlockId[], SuggestionId[]][] = [
  [/precio|cuesta|costo|presupuesto|cotiza|plazo|cu[aá]nto tarda|tiempo de entrega/, "precio", ["contacto"], []],
  [/\bapi|apigee/, "servicios", ["cap_apigee", "caso_procesar", "respaldo"], ["calidad", "nube"]],
  [/calidad|segur|prueba|vulnerab/, "calidad", ["umbrales", "cap_qa"], ["casos", "respaldo"]],
  [/respald|certific|partner|sello|qui[eé]n los/, "respaldo", ["respaldo"], ["calidad", "casos"]],
  [/gobierno|instituci[oó]n|p[uú]blic|ministerio|alcald|licitaci|migratori|frontera|visa/, "sector_publico", ["sector_publico", "caso_tse", "caso_dgme"], ["calidad", "respaldo"]],
  [/tienda|e-?commerce|comercio electr|marketplace|cat[aá]logo|vender en l[ií]nea|carrito/, "industria", ["cap_desarrollo", "caso_mercandu", "caso_graziela"], ["logistica", "calidad", "alcance"]],
  [/log[ií]stic|env[ií]o|paquete|casillero|courier/, "industria", ["cap_desarrollo", "caso_transexpress"], ["calidad", "casos"]],
  [/ingenier|equipo|staff|talento|desarrolladores|l[ií]der t[eé]cnico/, "servicios", ["caso_jostens", "respaldo"], ["calidad"]],
  [/se cae|pico|demanda|lento|mucha gente|disponibilidad|escal/, "servicios", ["cap_operacion", "caso_tse", "respaldo"], ["calidad", "nube"]],
  [/nube|cloud|migra|aws|google|servidor|on-?premise|legacy/, "servicios", ["cap_migracion", "caso_procesar", "caso_dgme"], ["datos", "calidad", "nube"]],
  [/alcance|no s[eé] por d[oó]nde|empezar|idea/, "alcance", ["cap_discovery", "caso_credicomer"], ["calidad", "casos"]],
  [/banco|banca|cuenta|financ|fintech|pago/, "industria", ["cap_desarrollo", "caso_credicomer", "caso_bancoazul"], ["calidad", "alcance"]],
  [/mantener|mantenimiento|soporte|ya tenemos un sistema|evolucion|moderniz|viejo|antiguo|anticuad/, "servicios", ["cap_evolucion", "caso_transexpress", "caso_bancoazul"], ["calidad", "datos"]],
  [/app|web|m[oó]vil|plataforma|sistema|software|erp|portal|sitio|integraci|caso/, "servicios", ["cap_desarrollo", "caso_credicomer", "umbrales"], ["banca", "ecommerce", "calidad"]],
];

export function localReply(text: string): AgentReply | null {
  const t = text.toLowerCase();
  const rule = RULES.find(([re]) => re.test(t));
  if (!rule) return null;
  const [, intencion, bloques, sugerencias] = rule;
  return { intencion, respuesta: bloques[0] === "contacto" ? CONTACT_LINE : "Esto es lo que aplica a lo que describes.", bloques, sugerencias, perfil_detectado: { sector: "", servicio: "", nube: "" } };
}

/** The visitor asked for a person: no model call, the contact block comes straight away. */
export const wantsSpecialist = (text: string) => text.trim() === SUGGESTIONS.especialista;

/**
 * Adds one turn. `reply` is what /api/chat returned, or null when it failed (no server, no key, outage, rate limit):
 * then the keyword stand-in picks the blocks, and if nothing matches, the fixed line and the contact block.
 * A block is never shown twice; at most three per turn.
 */
export function addTurn(s: State, user: string, reply: AgentReply | null): State {
  const shown = seen(s);
  const asked = [...s.turns.map((t) => t.user), user];
  const direct = wantsSpecialist(user);
  const r: AgentReply = direct
    ? { intencion: "contacto", respuesta: CONTACT_LINE, bloques: ["contacto"], sugerencias: [], perfil_detectado: { sector: "", servicio: "", nube: "" } }
    : (reply ?? localReply(user) ?? { intencion: "sin_respuesta", respuesta: FALLBACK, bloques: ["contacto"], sugerencias: [], perfil_detectado: { sector: "", servicio: "", nube: "" } });

  const blocks = [...new Set(r.bloques)].filter((b): b is BlockId => (BLOCK_IDS as readonly string[]).includes(b) && !shown.includes(b as BlockId)).slice(0, 3);
  const all = [...shown, ...blocks];
  const suggestions = [...new Set([...r.sugerencias.slice(0, 3), "especialista"])]
    .filter((id): id is SuggestionId => id in SUGGESTIONS)
    .filter((id) => !asked.includes(SUGGESTIONS[id]))
    .filter((id) => id !== "especialista" || !all.includes("contacto"))
    .slice(0, 4);

  const d = r.perfil_detectado;
  const pick = (cur: string, v: string, allowed: string[]) => (!cur && allowed.includes(v) ? v : cur);
  return {
    ...s,
    turns: [...s.turns, { user, agent: r.respuesta.trim() || FALLBACK, blocks }],
    suggestions,
    intents: [...s.intents, r.intencion],
    perfil: {
      sector: pick(s.perfil.sector, d.sector, ["privado", "publico"]),
      servicio: pick(s.perfil.servicio, d.servicio, ["software", "cloud", "equipo"]),
      nube: pick(s.perfil.nube, d.nube, ["google_cloud", "aws", "ambas", "ninguna"]),
    },
  };
}

/**
 * The single JSON for /api/lead (contract in lib/lead.ts); the caller adds attribution.
 * `finished`: the visitor sent the contact block. The sheet reads "L4" in `ruta` as "reached the end".
 */
export function leadPayload(s: State, datos: { nombre: string; correo: string; consentFecha: string }, finished: boolean) {
  const all = seen(s);
  return {
    modo: "chat",
    variante: s.variante,
    nombre: datos.nombre,
    correo: datos.correo,
    consentimiento: true,
    consentimiento_fecha: datos.consentFecha,
    perfil: { ...s.perfil, situacion: "", tipo_plataforma: [] },
    interes: {
      casos_vistos: all.filter((b) => b.startsWith("caso_")).map((b) => b.slice(5)),
      temas_vistos: all.filter((b) => !b.startsWith("caso_") && b !== "contacto"),
      preguntas_libres: s.turns.map((t) => t.user).slice(0, 10),
      mensaje: "",
    },
    ruta: [...s.intents.slice(0, 50).map((i) => i.slice(0, 12)), ...(finished ? ["L4"] : [])],
  };
}
