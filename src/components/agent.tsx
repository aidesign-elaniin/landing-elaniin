"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, CheckCircle2, X } from "lucide-react";
import { cases } from "@/data/cases";
import { CAPS, CAP_GROUPS, CONSENT, SUGGESTIONS, addTurn, leadPayload, seen, start, wantsSpecialist, type AgentReply, type BlockId, type State } from "@/data/agent";
import { EMAIL, isCorporate } from "@/lib/lead";
import type { VariantId } from "@/data/variants";
import { Glow, themes } from "./cases";
import { OPEN_CHAT_EVENT, attribution, type OpenChatDetail } from "./lead-form";
import { Logo } from "./logo";
import { PrivacyLink } from "./privacy-link";
import { asset } from "@/lib/site";

/*
  Agent with canvas. The visitor writes what they need; the agent answers with one sentence (left column)
  and real pieces of the site (canvas). What it may show and say lives in data/agent.ts; this file draws it.
  <AgentEntry /> is the field in the hero; <Agent /> is mounted once per page and listens for its event.
*/

const primaryBtn =
  "btn-arrow inline-flex shrink-0 items-center justify-center gap-2 rounded-button bg-elevate-blue font-display font-semibold text-white transition-colors duration-base hover:bg-blue-700 active:bg-blue-800 focus-ring disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-text-disabled";
const card = "rise rounded-card border border-border-default bg-white pad-card shadow-card-rest";
const kicker = "mono-label text-micro text-text-muted";

// Ready-made sentences for the visitor who does not know what to write. Each one brings different pieces.
const EXAMPLES: Record<VariantId, string[]> = {
  software: ["Necesitamos una app para abrir cuentas sin ir a una agencia", "Queremos lanzar una tienda en línea", "Tenemos un sistema viejo y hay que modernizarlo"],
  cloud: ["Tenemos un portal que se cae cuando hay mucha gente", "Queremos migrar nuestros sistemas a la nube", "Nuestras APIs no tienen seguridad unificada"],
};

const open = (detail: OpenChatDetail) => window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail }));

/** The main action of the hero: one field. Writing (or tapping the example) opens the agent with that sentence. */
export function AgentEntry({ variante }: { variante: VariantId }) {
  return (
    <div className="max-w-2xl">
      <form
        className="flex gap-2 max-[479px]:flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem("necesidad") as HTMLInputElement;
          const texto = input.value.trim();
          if (!texto) return input.focus();
          open({ texto });
          input.value = "";
        }}
      >
        <input name="necesidad" type="text" autoComplete="off" maxLength={500} aria-label="Qué necesitas resolver" placeholder="Escribe qué necesitas resolver" className="field h-14 min-h-14 min-w-0 flex-1 text-body-lg" />
        <button type="submit" className={`${primaryBtn} h-14 px-6 text-button-lg`}>
          Ver lo que aplica
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-body-sm text-text-muted">
        <span>Por ejemplo:</span>
        {EXAMPLES[variante].map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => open({ texto: ex })}
            className="rounded-button border border-border-default bg-white px-3 py-1.5 text-left text-text-primary transition-colors duration-base hover:bg-surface-subtle focus-ring"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}

/* One answer of the agent per variant, frozen: the sentence, the capability it marks, the case and a seal. */
const PREVIEW = {
  software: { frase: "Necesitamos una app para abrir cuentas sin ir a una agencia", cap: "cap_desarrollo", caso: "credicomer", chips: ["calidad", "casos"], sello: "badge-clutch-top-software-developers" },
  cloud: { frase: "Tenemos un portal que se cae cuando hay mucha gente", cap: "cap_operacion", caso: "tse", chips: ["calidad", "nube"], sello: "gcp-services-select" },
} as const;

const miniLabel = "font-display text-[9.5px] font-semibold uppercase tracking-[.08em]";
const pop = "absolute"; // each pop sits on its own Z plane; the float lives on its child so the two transforms don't fight

/*
  Hero asset: the agent's whole screen, tilted in space, with three pieces leaving its plane. It straightens on hover.
  Decorative (aria-hidden): it repeats content the page and the agent already expose to assistive tech.
  ponytail: a hand-drawn miniature, not the real <Agent /> scaled down. If the agent's layout changes a lot, redraw it.
*/
export function HeroPreview({ variante }: { variante: VariantId }) {
  const p = PREVIEW[variante];
  const cap = CAPS[p.cap];
  const c = cases.find((x) => x.id === p.caso)!;
  const t = themes[c.theme];
  return (
    <div aria-hidden="true" className="rise group col-span-5 min-w-0 self-center py-10 pl-4 [perspective:1500px] max-lg:hidden xl:pl-10 min-[1400px]:pl-20" style={{ ["--i" as string]: 3 }}>
      <div className="relative [zoom:.78] xl:[zoom:.88] min-[1400px]:[zoom:1] transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] [transform-style:preserve-3d] [transform:rotateY(-19deg)_rotateX(7deg)_rotateZ(1.5deg)] group-hover:[transform:rotateY(-7deg)_rotateX(3deg)] motion-reduce:transition-none">
        {/* the window */}
        <div className="grid min-h-[25rem] grid-cols-[34%_1fr] overflow-hidden rounded-card border border-border-default bg-white shadow-[0_60px_80px_-40px_rgba(0,0,64,.45),0_30px_40px_-30px_rgba(0,0,0,.25)]">
          <div className="flex min-w-0 flex-col gap-3 border-r border-border-default p-3.5">
            <Logo className="h-3.5 w-auto self-start" />
            <p className="text-[10px] leading-snug text-text-muted">{p.frase}</p>
            <p className="font-display text-[13px] font-semibold leading-tight text-text-primary">Esto es lo que aplica a lo que describes.</p>
            <div className="mt-auto grid gap-1.5">
              {p.chips.map((id) => (
                <span key={id} className="rounded-tag border border-border-default px-2 py-1.5 font-display text-[9.5px] font-semibold text-text-primary">{SUGGESTIONS[id]}</span>
              ))}
              <span className="rounded-tag border border-inspire-blue px-2 py-1.5 font-display text-[9.5px] font-semibold text-inspire-blue">{SUGGESTIONS.especialista}</span>
              <div className="h-6 rounded-tag border border-border-strong" />
            </div>
          </div>
          <div className="grid min-w-0 content-start gap-2.5 bg-surface-subtle p-3.5">
            <div className="min-w-0 rounded-button border border-border-default bg-white p-3">
              <p className={`${miniLabel} text-text-muted`}>Capacidad que aplica</p>
              <div className="my-2.5 grid grid-cols-4 gap-1">
                {CAP_GROUPS[cap.grupo].nombres.map((n, i) => (
                  <i key={n} className={`h-[3px] rounded-full ${i === cap.n ? "bg-inspire-blue" : "bg-border-default"}`} />
                ))}
              </div>
              <p className="font-display text-[14px] font-semibold text-text-primary">{cap.nombre}</p>
            </div>
            <div className={`relative isolate min-w-0 overflow-hidden rounded-button p-3.5 ${t.card}`}>
              <Glow {...t.glow} />
              <p className={`${miniLabel} ${t.tag}`}>{c.tag}</p>
              {/* eslint-disable-next-line @next/next/no-img-element -- ponytail: static SVG logo */}
              <img src={asset(c.logo)} alt="" className="my-3 h-5 w-auto max-w-[70%] brightness-0 invert" />
              <p className="font-display text-[15px] font-semibold leading-tight">{c.title}</p>
            </div>
            <div className="min-w-0 rounded-button border border-border-default bg-white p-3">
              <p className={`${miniLabel} text-text-muted`}>Software Nivel A</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {THRESHOLDS.map(([v, l]) => (
                  <div key={l} className="min-w-0 border-l-2 border-inspire-blue pl-1.5">
                    <p className="font-mono text-[16px] font-semibold tabular-nums text-text-primary">{v}</p>
                    <p className="text-[7.5px] leading-tight text-text-muted">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* pieces that leave the plane of the screen */}
        <div className={`${pop} left-[22%] top-[-8%] max-w-[62%] [transform:translateZ(60px)]`}>
          <p className="float-chip rounded-card rounded-br-tag bg-inspire-blue px-3 py-2 text-[11px] text-white shadow-[0_30px_40px_-20px_rgba(0,0,64,.5)] [animation-delay:-1.5s]">{p.frase}</p>
        </div>
        <div className={`${pop} right-[-9%] top-[40%] w-[41%] [transform:translateZ(90px)]`}>
          <div className="float-chip rounded-card bg-excellence-blue px-4 py-3.5 text-white shadow-[0_30px_40px_-20px_rgba(0,0,64,.5)]">
            <p className="font-display text-[28px] font-semibold leading-none tracking-tight tabular-nums">{c.highlight.value}</p>
            <p className={`${miniLabel} mt-1.5 text-text-on-dark-accent`}>{c.highlight.label}</p>
          </div>
        </div>
        <div className={`${pop} bottom-[-9%] left-[6%] [transform:translateZ(70px)]`}>
          <div className="float-chip rounded-card border border-border-default bg-white p-2.5 shadow-[0_30px_40px_-20px_rgba(0,0,64,.5)] [animation-delay:-3s]">
            {/* eslint-disable-next-line @next/next/no-img-element -- ponytail: static SVG badge */}
            <img src={asset(`/certifications/${p.sello}.svg`)} alt="" className="h-14 w-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- blocks: every one is built from content the site already shows ----------

function CapBlock({ id }: { id: keyof typeof CAPS }) {
  const c = CAPS[id];
  const g = CAP_GROUPS[c.grupo];
  return (
    <section className={card}>
      <p className={kicker}>Capacidad que aplica</p>
      <ol className="mt-6 grid grid-cols-4 gap-2" aria-label={g.titulo}>
        {g.nombres.map((n, i) => {
          const on = i === c.n;
          return (
            <li key={n} className="min-w-0" aria-current={on ? "step" : undefined}>
              <div className={`h-1 rounded-full ${on ? "bg-inspire-blue" : "bg-border-default"}`} />
              <p className={`mt-2 font-mono text-caption font-semibold ${on ? "text-inspire-blue" : "text-text-disabled"}`}>{String(i + 1).padStart(2, "0")}</p>
              <p className={`mt-1 text-caption max-sm:hidden ${on ? "font-semibold text-text-primary" : "text-text-disabled"}`}>{n}</p>
            </li>
          );
        })}
      </ol>
      <h3 className="mt-8 font-display text-h3 font-semibold text-text-primary">{c.nombre}</h3>
      <p className="mt-2 max-w-[56ch] text-body text-text-secondary">{c.texto}</p>
    </section>
  );
}

function CaseBlock({ id }: { id: string }) {
  const c = cases.find((x) => x.id === id);
  if (!c) return null;
  const t = themes[c.theme];
  return (
    <section className={`rise relative isolate overflow-hidden rounded-card pad-card shadow-product ${t.card}`}>
      <Glow {...t.glow} />
      <p className={`mono-label text-nano ${t.tag}`}>{c.tag}</p>
      <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div className="min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- ponytail: static SVG logo, nothing for next/image to optimize */}
          <img src={asset(c.logo)} alt={c.client} style={{ height: Math.round(c.logoH.card * 0.9) }} className="w-auto max-w-full brightness-0 invert" />
          <h3 className="mt-5 font-display text-h2 font-semibold">{c.title}</h3>
          <p className={`mt-2 text-body ${t.panelMuted}`}>{c.summary}</p>
        </div>
        <div className="min-w-0 border-t border-border-on-dark pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <p className="break-words font-display text-display-lg font-semibold tabular-nums">{c.highlight.value}</p>
          <p className={`mono-label mt-2 text-micro ${t.panelMuted}`}>{c.highlight.label}</p>
        </div>
      </div>
      <ul className="mt-8 grid gap-x-8 gap-y-3 border-t border-border-on-dark pt-6 sm:grid-cols-2">
        {c.detail.results.slice(0, 4).map((r) => (
          <li key={r} className="flex gap-3 text-body-sm">
            <Check size={16} strokeWidth={2} className="mt-1 shrink-0" aria-hidden="true" />
            <span className="min-w-0">{r}</span>
          </li>
        ))}
      </ul>
      {/* project sheet: how the work was set up */}
      {c.ficha && (
        <dl className="mt-6 grid gap-x-8 gap-y-4 border-t border-border-on-dark pt-6 sm:grid-cols-[auto_auto_1fr]">
          {[
            ["Tipo de proyecto", c.ficha.tipo],
            ["Duración", c.ficha.duracion],
            ["Tecnologías", c.ficha.tecnologias],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className={`mono-label text-nano ${t.panelMuted}`}>{k}</dt>
              <dd className="mt-1 text-body-sm">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

const BADGES = [
  { file: "gcp-cosell-select", alt: "Google Cloud Select, Co-sell Partner" },
  { file: "gcp-services-select", alt: "Google Cloud Select, Services Partner" },
  { file: "badge-clutch-aws", alt: "AWS Premier Tier Services" },
  { file: "badge-clutch-top-software-developers", alt: "Clutch Top Software Developers, El Salvador" },
  { file: "badge-clutch-top-staff", alt: "Clutch Top Staff Augmentation, El Salvador" },
];

function BackingBlock() {
  return (
    <section className={card}>
      <p className={kicker}>Respaldo verificable</p>
      <ul className="mt-6 flex flex-wrap items-center gap-6">
        {BADGES.map((b) => (
          <li key={b.file} className="h-20">
            {/* eslint-disable-next-line @next/next/no-img-element -- ponytail: static SVG badge */}
            <img src={asset(`/certifications/${b.file}.svg`)} alt={b.alt} className="h-full w-auto" />
          </li>
        ))}
      </ul>
    </section>
  );
}

const THRESHOLDS = [
  ["0", "vulnerabilidades críticas o altas"],
  ["0", "secretos expuestos"],
  ["80 %", "de cobertura mínima en pruebas automatizadas"],
  ["0", "dependencias circulares en la arquitectura"],
];

function ThresholdsBlock() {
  return (
    <section className={card}>
      <p className={kicker}>Software Nivel A</p>
      <p className="mt-3 max-w-[60ch] text-body text-text-secondary">Ninguna solución llega a producción sin superar siete dimensiones de evaluación con umbrales objetivos. Entre ellas:</p>
      <ul className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
        {THRESHOLDS.map(([v, l]) => (
          <li key={l} className="min-w-0 border-l-2 border-inspire-blue pl-4">
            <p className="font-display text-display-lg font-semibold tabular-nums text-text-primary">{v}</p>
            <p className="mt-2 text-body-sm text-text-secondary">{l}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PublicBlock() {
  return (
    <section className={card}>
      <p className={kicker}>Para instituciones públicas</p>
      <h3 className="mt-4 max-w-[30ch] font-display text-h3 font-semibold text-text-primary">Documentación técnica, trazabilidad y acompañamiento en procesos de contratación pública desde el primer día.</h3>
      <p className="mt-4 max-w-[60ch] text-body text-text-secondary">Hemos ejecutado plataformas para el TSE, la DGME y el MTPS, y acompañamos los requisitos de contratación pública.</p>
    </section>
  );
}

type Datos = { nombre: string; correo: string; consentFecha: string };
type Sent = "idle" | "loading" | "ok" | "error";

function ContactBlock({ datos, sent, onSend }: { datos: Partial<Datos>; sent: Sent; onSend: (d: Datos) => void }) {
  const [error, setError] = useState("");
  if (sent === "ok") {
    return (
      <section role="status" className={`${card} border-success-border`}>
        <CheckCircle2 size={28} strokeWidth={1.5} className="text-success-dot" aria-hidden="true" />
        <p className="mt-3 font-display text-h4 font-semibold text-text-primary">Listo, {datos.nombre}.</p>
        <p className="mt-1 text-body text-text-secondary">Un especialista revisará tu proyecto y te contactará para una conversación técnica inicial, sin compromiso.</p>
      </section>
    );
  }
  return (
    <section className={`${card} border-inspire-blue`}>
      <p className={kicker}>Hablar con un especialista</p>
      <form
        noValidate
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const nombre = String(f.get("nombre") ?? "").trim();
          const correo = String(f.get("correo") ?? "").trim();
          const problem = !nombre
            ? "Escribe tu nombre."
            : !EMAIL.test(correo)
              ? "Escribe un correo válido."
              : !isCorporate(correo)
                ? "Necesito tu correo corporativo para que el especialista te contacte."
                : f.get("consentimiento") !== "on"
                  ? "Acepta la política de privacidad para enviar tus datos."
                  : "";
          setError(problem);
          if (!problem) onSend({ nombre, correo, consentFecha: datos.consentFecha || new Date().toISOString() });
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="nombre" type="text" autoComplete="name" defaultValue={datos.nombre} placeholder="Nombre" aria-label="Nombre" className="field min-h-11" />
          <input name="correo" type="email" autoComplete="email" defaultValue={datos.correo} placeholder="Correo corporativo" aria-label="Correo corporativo" className="field min-h-11" />
        </div>
        <label className="mt-4 flex cursor-pointer items-start gap-3 text-body-sm text-text-secondary">
          <input name="consentimiento" type="checkbox" defaultChecked={!!datos.consentFecha} className="mt-0.5 size-4 shrink-0 rounded-tag accent-inspire-blue focus-ring" />
          <span>
            {CONSENT.split("política de privacidad")[0]}
            <PrivacyLink className="font-medium text-inspire-blue underline underline-offset-2 focus-ring">política de privacidad</PrivacyLink>
            {CONSENT.split("política de privacidad")[1]}
          </span>
        </label>
        {(error || sent === "error") && (
          <p role="alert" className="mt-3 text-body-sm text-error-text">
            {error || "No pudimos enviar tus datos. Inténtalo de nuevo en unos minutos."}
          </p>
        )}
        <button type="submit" disabled={sent === "loading"} className={`${primaryBtn} mt-5 h-11 px-5 text-button`}>
          {sent === "loading" ? "Enviando" : "Enviar mis datos"}
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}

// ---------- the guide ----------

export function Agent({ variante }: { variante: VariantId }) {
  const [s, setS] = useState<State>(() => start(variante));
  const [thinking, setThinking] = useState("");
  const [datos, setDatos] = useState<Partial<Datos>>({});
  const [sent, setSent] = useState<Sent>("idle");
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  // latest values for callbacks that outlive a render (the fetch, the close handler)
  const live = useRef({ s, datos, sent });
  useEffect(() => {
    live.current = { s, datos, sent };
  });

  const ask = (text: string, base?: State) => {
    const q = text.trim().slice(0, 500);
    if (!q) return;
    setThinking(q);
    const cur = base ?? live.current.s; // `base`: the guide was just reopened, the previous conversation does not count
    const finish = (reply: AgentReply | null) => {
      setS((st) => addTurn(st, q, reply));
      setThinking("");
    };
    if (wantsSpecialist(q)) return void setTimeout(() => finish(null), 250); // no model call: the contact block comes straight away
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: q, variante: cur.variante, sector: cur.perfil.sector, servicio: cur.perfil.servicio, vistos: seen(cur) }),
    })
      .then(async (res) => finish(res.ok ? ((await res.json()) as AgentReply) : null))
      .catch(() => finish(null));
  };

  // the hero field opens the guide with the sentence the visitor typed
  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<OpenChatDetail>).detail;
      const fresh = start(variante);
      setS(fresh);
      setSent("idle");
      setDatos({});
      if (!dialog.current?.open) dialog.current?.showModal();
      document.documentElement.classList.add("overflow-hidden");
      ask(d.texto, fresh);
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, [variante]);

  // each new turn: bring its first block (or the loading state) into view
  useEffect(() => {
    const el = canvas.current?.querySelector("[data-turn]:last-of-type, [data-loading]");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!thinking) field.current?.focus({ preventScroll: true });
  }, [s.turns.length, thinking]);

  const post = (state: State, d: Datos) => {
    const { utm, referrer } = attribution();
    return fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...leadPayload(state, d, true), utm, referrer, page: location.pathname }),
    });
  };

  const send = (d: Datos) => {
    setDatos(d);
    setSent("loading");
    post(live.current.s, d)
      .then((res) => setSent(res.ok ? "ok" : "error"))
      .catch(() => setSent("error"));
  };

  const onClose = () => document.documentElement.classList.remove("overflow-hidden");

  const close = () => dialog.current?.close();
  const last = s.turns[s.turns.length - 1];
  const empty = s.turns.length === 0 && !thinking;

  const block = (b: BlockId) => {
    if (b in CAPS) return <CapBlock id={b as keyof typeof CAPS} />;
    if (b.startsWith("caso_")) return <CaseBlock id={b.slice(5)} />;
    if (b === "umbrales") return <ThresholdsBlock />;
    if (b === "respaldo") return <BackingBlock />;
    if (b === "sector_publico") return <PublicBlock />;
    return <ContactBlock datos={datos} sent={sent} onSend={send} />;
  };

  return (
    <dialog ref={dialog} aria-label="Guía de proyecto" onClose={onClose} className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-white p-0 text-text-primary">
      <div className="grid h-full grid-rows-[minmax(0,1fr)_auto] lg:grid-cols-[24rem_minmax(0,1fr)] lg:grid-rows-1">
        {/* conversation: one sentence per answer, the suggestions and the field. No long bubbles. */}
        <aside className="flex min-h-0 flex-col border-border-default max-lg:order-last max-lg:border-t lg:border-r">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border-default px-5 max-lg:hidden">
            <Logo />
            <button type="button" onClick={close} aria-label="Cerrar la guía" className="inline-flex h-11 w-11 items-center justify-center rounded-button text-text-secondary transition-colors duration-base hover:bg-surface-subtle focus-ring">
              <X size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-5 max-lg:hidden">
            <ol aria-live="polite" className="space-y-8">
              {empty && <li className="font-display text-h4 font-semibold text-text-primary">Cuéntanos qué necesitas ejecutar.</li>}
              {s.turns.map((t, i) => (
                <li key={i} className={`rise ${i < s.turns.length - 1 || thinking ? "opacity-50" : ""}`}>
                  <p className="text-body-sm text-text-muted">{t.user}</p>
                  <p className="mt-2 font-display text-h4 font-semibold text-text-primary">{t.agent}</p>
                </li>
              ))}
              {thinking && (
                <li>
                  <p className="text-body-sm text-text-muted">{thinking}</p>
                  <span role="status" aria-label="Preparando la vista" className="typing-dots mt-4 text-inspire-blue">
                    <i />
                    <i />
                    <i />
                  </span>
                </li>
              )}
            </ol>
          </div>
          <div className="shrink-0 space-y-3 p-4 lg:border-t lg:border-border-default">
            {/* on small screens the last sentence sits here, next to the field */}
            <p className="font-display text-body font-semibold text-text-primary lg:hidden">{thinking ? "Preparando la vista…" : (last?.agent ?? "Cuéntanos qué necesitas ejecutar.")}</p>
            {!thinking && s.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {s.suggestions.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => ask(SUGGESTIONS[id])}
                    className={`rounded-button border bg-white px-3 py-2 text-left font-display text-body-sm font-semibold transition-colors duration-base hover:bg-surface-subtle focus-ring ${id === "especialista" ? "border-inspire-blue text-inspire-blue" : "border-border-default text-text-primary"}`}
                  >
                    {SUGGESTIONS[id]}
                  </button>
                ))}
              </div>
            )}
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const v = field.current?.value ?? "";
                if (!v.trim() || thinking) return field.current?.focus();
                ask(v);
                if (field.current) field.current.value = "";
              }}
            >
              <input ref={field} type="text" autoComplete="off" maxLength={500} aria-label="Tu mensaje" placeholder={empty ? "Escribe qué necesitas resolver" : "Pregunta lo que quieras ver"} className="field min-h-11 min-w-0 flex-1" />
              <button type="submit" disabled={!!thinking} aria-label="Enviar" className={`${primaryBtn} h-11 w-11`}>
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </form>
          </div>
        </aside>

        {/* canvas: real pieces of the site, stacked as the conversation goes */}
        <div className="relative min-h-0">
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar la guía"
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-button border border-border-default bg-white text-text-primary shadow-card-rest focus-ring lg:hidden"
          >
            <X size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <div ref={canvas} className="h-full overflow-y-auto overscroll-contain bg-surface-subtle">
          <div className="mx-auto flex max-w-4xl flex-col gap-5 p-4 max-lg:pt-16! md:p-8">
            {s.turns.map((t, i) =>
              t.blocks.length ? (
                <div key={i} data-turn className="flex scroll-mt-4 flex-col gap-5">
                  {t.blocks.map((b) => (
                    <div key={b}>{block(b)}</div>
                  ))}
                </div>
              ) : null,
            )}
            {thinking && (
              <div data-loading className="flex scroll-mt-4 flex-col gap-5" aria-hidden="true">
                <div className="h-40 animate-pulse rounded-card bg-white" />
                <div className="h-64 animate-pulse rounded-card bg-white" />
              </div>
            )}
            {empty && (
              <div className="grid min-h-[50dvh] place-items-center text-center">
                <p className="max-w-[32ch] text-body text-text-muted">Escribe qué necesitas y aquí verás solo lo que aplica a tu proyecto: capacidades, casos y respaldo.</p>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
