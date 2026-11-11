// Lead contract the form sends to n8n. The chat-era fields (modo "chat", interes, ruta) stay because the n8n workflow maps them. Shape: plan "Captura del lead y JSON para n8n".
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ponytail: personal mailboxes matched by the provider label (gmail.com, yahoo.com.mx, hotmail.es...). Extend the list if a new one shows up in leads.
const PERSONAL = new Set(["gmail", "googlemail", "hotmail", "outlook", "live", "msn", "yahoo", "ymail", "icloud", "me", "aol", "proton", "protonmail", "gmx", "zoho"]);

export function isCorporate(email: string) {
  if (!EMAIL.test(email)) return false;
  const provider = email.slice(email.lastIndexOf("@") + 1).toLowerCase().split(".")[0];
  return !PERSONAL.has(provider);
}

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T | "" = "") => (allowed.includes(v as T) ? (v as T) : fallback);
const list = (v: unknown, maxItems: number, maxLen: number) => (Array.isArray(v) ? v.map((x) => str(x, maxLen)).filter(Boolean).slice(0, maxItems) : []);
const obj = (v: unknown) => (typeof v === "object" && v ? v : {}) as Record<string, unknown>;

const PLATFORMS = ["web", "movil", "core_erp", "integraciones", "sin_definir"] as const;

type LeadError = "nombre" | "correo" | "correo_personal" | "consentimiento";

/** Whitelists every field: only what the contract names travels to n8n. Dates are set by the server. */
export function parseLead(body: Record<string, unknown>, now = new Date()) {
  const nombre = str(body.nombre);
  const correo = str(body.correo).toLowerCase();
  const error: LeadError | null = !nombre ? "nombre" : !EMAIL.test(correo) ? "correo" : !isCorporate(correo) ? "correo_personal" : body.consentimiento !== true ? "consentimiento" : null;
  if (error) return { ok: false as const, error };

  const utmIn = obj(body.utm);
  const perfil = obj(body.perfil);
  const interes = obj(body.interes);
  const consent = new Date(str(body.consentimiento_fecha, 40));
  return {
    ok: true as const,
    lead: {
      evento: "lead_creado",
      fecha: now.toISOString(),
      modo: oneOf(body.modo, ["chat", "formulario"] as const, "formulario"),
      // any landing slug (data/variants), so a new landing needs no change here; the pattern keeps markup and formulas out
      variante: typeof body.variante === "string" && /^[a-z0-9-]{1,40}$/.test(body.variante) ? body.variante : "software",
      nombre,
      correo,
      consentimiento: true,
      consentimiento_fecha: (Number.isNaN(consent.getTime()) || consent > now ? now : consent).toISOString(),
      utm: Object.fromEntries(UTM_KEYS.map((k) => [k, str(utmIn[k], 100)])),
      referrer: str(body.referrer, 300),
      page: str(body.page) || "/",
      perfil: {
        sector: oneOf(perfil.sector, ["privado", "publico"] as const),
        servicio: oneOf(perfil.servicio, ["software", "cloud", "equipo", "sin_definir"] as const),
        situacion: str(perfil.situacion, 80),
        nube: oneOf(perfil.nube, ["google_cloud", "aws", "ambas", "ninguna"] as const),
        tipo_plataforma: list(perfil.tipo_plataforma, 5, 20).filter((p) => (PLATFORMS as readonly string[]).includes(p)),
      },
      interes: {
        casos_vistos: list(interes.casos_vistos, 10, 20),
        temas_vistos: list(interes.temas_vistos, 20, 40),
        preguntas_libres: list(interes.preguntas_libres, 10, 500),
        mensaje: str(interes.mensaje, 1000),
      },
      ruta: list(body.ruta, 60, 12),
    },
  };
}
