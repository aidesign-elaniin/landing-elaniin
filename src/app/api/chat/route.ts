import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { BLOCK_IDS, SUGGESTION_IDS } from "@/data/agent";
import { INTENTS, SYSTEM } from "@/lib/chat-ai";

// Fixed reply format the site interprets: the model picks block and suggestion ids, never writes what a block says.
const Reply = z.object({
  intencion: z.enum(INTENTS),
  respuesta: z.string(),
  bloques: z.array(z.enum(BLOCK_IDS)),
  sugerencias: z.array(z.enum(SUGGESTION_IDS as [string, ...string[]])),
  perfil_detectado: z.object({
    sector: z.enum(["privado", "publico", ""]),
    servicio: z.enum(["software", "cloud", "equipo", ""]),
    nube: z.enum(["google_cloud", "aws", "ambas", "ninguna", ""]),
  }),
});

// ponytail: per-IP limit kept in memory (public endpoint in front of a paid API). It resets on redeploy and is
// per server instance; move it to the platform's rate limiter or a KV store if traffic or abuse grows.
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();
function limited(ip: string, now = Date.now()) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  // No key configured: the agent falls back to its fixed line and the contact block (503 tells the client to do so).
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ ok: false }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const texto = str(body.texto, 500);
  if (!texto) return Response.json({ ok: false }, { status: 422 });
  if (limited(req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local")) return Response.json({ ok: false }, { status: 429 });

  // Context the map already knows, whitelisted. The visitor's text travels apart from it, as data.
  const contexto = {
    variante: body.variante === "cloud" ? "cloud" : "software",
    sector: str(body.sector, 10),
    servicio: str(body.servicio, 12),
    vistos: Array.isArray(body.vistos) ? body.vistos.filter((b): b is string => (BLOCK_IDS as readonly string[]).includes(b as string)).slice(0, 16) : [],
  };

  try {
    const client = new Anthropic();
    const res = await client.messages.parse(
      {
        model: "claude-opus-5-5",
        max_tokens: 2000,
        output_config: { effort: "low", format: zodOutputFormat(Reply) }, // short pick + one sentence: low effort keeps the agent quick
        system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }], // stable prefix: rules + document
        messages: [{ role: "user", content: `<contexto>${JSON.stringify(contexto)}</contexto>\n<mensaje_de_la_persona>${texto}</mensaje_de_la_persona>` }],
      },
      { timeout: 20_000, maxRetries: 1 },
    );
    const reply = res.parsed_output;
    // A refusal or an unparseable answer is handled like an outage: the agent offers the specialist.
    if (res.stop_reason === "refusal" || !reply) return Response.json({ ok: false }, { status: 502 });
    return Response.json({ ok: true, ...reply, respuesta: reply.respuesta.trim().slice(0, 300), bloques: reply.bloques.slice(0, 3), sugerencias: reply.sugerencias.slice(0, 3) });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return Response.json({ ok: false }, { status: 429 });
    if (error instanceof Anthropic.APIError) console.error("[chat] Claude API error", error.status, error.message);
    else console.error("[chat] failed", error);
    return Response.json({ ok: false }, { status: 502 });
  }
}
