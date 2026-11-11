"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ListChecks,
  MonitorCheck,
  ArrowRight,
  Blocks,
  Building2,
  Check,
  Landmark,
  Maximize2,
  ShieldCheck,
  Smartphone,
  Users,
  X,
} from "lucide-react";
import { cases, type CaseStudy } from "@/data/cases";
import { CAPS } from "@/data/variants";
import { asset } from "@/lib/site";

const icons = {
  tse: Landmark,
  credicomer: Smartphone,
  procesar: Building2,
  jostens: Users,
} as const;

function Logo({
  c,
  h,
  white = false,
}: {
  c: CaseStudy;
  h: number;
  white?: boolean;
}) {
  return (
    <Image
      src={asset(c.logo)}
      alt=""
      aria-hidden="true"
      width={Math.round(h * c.logoRatio)}
      height={h}
      unoptimized
      style={{ height: h, width: "auto" }}
      className={`max-w-full object-contain object-left ${white ? "brightness-0 invert" : ""}`}
    />
  );
}

export const themes = {
  vivid: {
    card: "bg-elevate-blue text-white",
    tag: "text-white",
    title: "text-white",
    logoWhite: true,
    button: "bg-white text-text-primary hover:bg-blue-tint-50",
    panel: "bg-elevate-blue text-white",
    panelMuted: "text-blue-100",
    glow: {
      primary: "#99b0fe",
      bg: "#1054ff",
      angle: 115,
      reverse: false,
      slow: 1,
    },
  },
  black: {
    card: "bg-elaniin-black text-white",
    tag: "text-text-on-dark-accent",
    title: "text-white",
    logoWhite: true,
    button: "bg-elevate-blue text-white hover:bg-blue-700",
    panel: "bg-elaniin-black text-white",
    panelMuted: "text-text-on-dark-accent",
    glow: {
      primary: "#1054ff",
      bg: "#0c0c0c",
      angle: 65,
      reverse: true,
      slow: 0.9,
    },
  },
  excellence: {
    card: "bg-excellence-blue text-white",
    tag: "text-text-on-dark-accent",
    title: "text-white",
    logoWhite: true,
    button: "bg-elevate-blue text-white hover:bg-blue-700",
    panel: "bg-excellence-blue text-white",
    panelMuted: "text-text-on-dark-accent",
    glow: {
      primary: "#1054ff",
      bg: "#000040",
      angle: 150,
      reverse: false,
      slow: 1.3,
    },
  },
} as const;

/*
  Moving glints, same technique as the Elaniin site CTA: two layers of diagonal stripes slide
  sideways at different speeds (16 s and 6 s), so where they overlap the light bands keep
  changing. Each layer is a row of identical tiles whose width equals the stripe period, so the
  loop is seamless; only transforms animate. A blur and a mask keep it soft and strongest at the
  bottom. SCALE shrinks the stripes, OPACITY keeps them subtle.
*/
const SCALE = 0.55;
const OPACITY = 0.4;
const TILES = 4;

type GlowProps = {
  primary: string;
  bg: string;
  angle: number;
  reverse: boolean;
  slow: number;
};

/* angle, direction and speed differ per card so the three never move in sync */
export function Glow({ primary, bg, angle, reverse, slow }: GlowProps) {
  const period = (640 * SCALE) / Math.abs(Math.sin((angle * Math.PI) / 180)); // px: horizontal period of the stripe pattern
  const k = (n: number) => `${(n * SCALE).toFixed(2)}px`;
  const light = `repeating-linear-gradient(${angle}deg, ${primary} 0px, ${primary} ${k(50)}, transparent ${k(110)}, transparent ${k(150)}, color-mix(in oklab, ${primary} 50%, transparent) ${k(240)}, transparent ${k(280)}, ${primary} ${k(320)})`;
  const cut = `repeating-linear-gradient(${angle}deg, transparent 0px, ${bg} ${k(128)}, ${bg} ${k(160)}, transparent ${k(533.33)}, transparent ${k(640)})`;
  const layer = (background: string, duration: number) => (
    <div className="absolute inset-0">
      {Array.from({ length: TILES }, (_, i) => (
        <div
          key={i}
          className="glow-scroll absolute inset-y-0"
          style={{
            left: i * period,
            width: period,
            background,
            animationDirection: reverse ? "reverse" : "normal",
            ["--repeat" as string]: `${period}px`,
            ["--duration" as string]: `${Math.round(duration * slow)}ms`,
          }}
        />
      ))}
    </div>
  );
  return (
    <div
      className="mask-glow pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 blur-md" style={{ opacity: OPACITY }}>
        {layer(light, 16000)}
        {layer(cut, 6000)}
      </div>
    </div>
  );
}

/*
  Stacked cases: every card is full width and sticky, each one pinned a little lower than the
  previous, so the next case slides over the one before and the edge of each stays visible.
*/
/*
  One case: sector line on top, then logo and title, then the button. `big` is the lead card of the grid.
  Requested: the glints in the background keep moving and the card fades in on scroll; nothing else moves
  (no scroll-driven effect, no arrow slide; hover only changes color).
*/
function CaseCard({ c, onOpen, big, index, className = "" }: { c: CaseStudy; onOpen: () => void; big: boolean; index: number; className?: string }) {
  const t = themes[c.theme];
  return (
    <article style={{ ["--i" as string]: index }} className={`reveal relative isolate flex min-w-0 cursor-pointer flex-col justify-between gap-10 overflow-hidden rounded-card pad-card shadow-product ${big ? "min-h-[22rem] lg:min-h-[32rem]" : "min-h-[15rem]"} ${t.card} ${className}`}>
      <Glow {...t.glow} />
      <p className={`mono-label text-nano ${t.tag}`}>{c.tag}</p>
      <div className="min-w-0">
        <div className="flex h-14 items-center">
          <Logo c={c} h={big ? c.logoH.card : Math.round(c.logoH.card * 0.85)} white={t.logoWhite} />
        </div>
        <h3 className={`mt-4 break-words font-display font-semibold ${big ? "text-h1 md:max-w-[16ch]" : "text-h3"} ${t.title}`}>{c.title}</h3>
      </div>
      <div>
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          aria-label={`${c.button}: ${c.client}, ${c.title}`}
          className={`inline-flex h-11 items-center gap-2 rounded-button px-4 font-display text-button font-semibold transition-colors duration-base after:absolute after:inset-0 after:content-[''] focus-ring ${t.button}`}
        >
          {c.button}
          <Maximize2 size={15} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 divide-y divide-border-default">
      {items.map((t) => (
        <li key={t} className="flex gap-3 py-3 first:pt-0 last:pb-0">
          <Check
            size={18}
            strokeWidth={2}
            className="mt-0.5 shrink-0 text-elevate-blue"
            aria-hidden="true"
          />
          <span className="min-w-0 text-body text-text-secondary">{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function Cases({ ids }: { ids: string[] }) {
  const shown = ids
    .map((id) => cases.find((c) => c.id === id))
    .filter((c): c is CaseStudy => !!c);
  const [openId, setOpenId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const current = cases.find((c) => c.id === openId) ?? null;

  useEffect(() => {
    const el = dialog.current;
    if (!el || !openId) return;
    if (!el.open) el.showModal();
    document.documentElement.classList.add("overflow-hidden");
  }, [openId]);

  const close = () => {
    dialog.current?.close();
    document.documentElement.classList.remove("overflow-hidden");
  };

  const Icon = current ? icons[current.id as keyof typeof icons] : Landmark;

  return (
    <>
      {/* Lead case on the left over two rows, the others stacked on the right; two cases share the row evenly. */}
      <div className={`mt-10 grid gap-6 ${shown.length > 2 ? "lg:grid-cols-[1.4fr_1fr]" : "md:grid-cols-2"}`}>
        {shown.map((c, i) => (
          <CaseCard key={c.id} c={c} index={i} big={i === 0 || shown.length < 3} className={i === 0 && shown.length > 2 ? "lg:row-span-2" : ""} onOpen={() => setOpenId(c.id)} />
        ))}
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="case-title"
        onClose={() => {
          setOpenId(null);
          document.documentElement.classList.remove("overflow-hidden");
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto max-h-[calc(100dvh-1.5rem)] w-[min(1120px,calc(100vw-1.5rem))] max-w-none overflow-y-auto overscroll-contain rounded-modal border-0 bg-white p-0 text-text-primary shadow-product backdrop:bg-excellence-blue/70 backdrop:backdrop-blur-sm"
      >
        {current && (
          <div className="rise relative grid lg:grid-cols-[1.2fr_0.8fr]">
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-button border border-border-default bg-white text-text-primary shadow-card-rest transition-colors duration-base hover:bg-surface-subtle focus-ring"
            >
              <X size={20} strokeWidth={1.75} aria-hidden="true" />
            </button>

            <div className="min-w-0 p-6 pt-16 md:p-10 lg:pt-10">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-button border border-border-default bg-white text-elevate-blue">
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="mono-label text-micro text-text-secondary">
                  {current.tag}
                </span>
              </div>
              <h3
                id="case-title"
                className="mt-8 break-words font-display text-h2 font-semibold text-text-primary"
              >
                {current.title}
              </h3>
              <p className="mt-4 text-body-lg text-text-secondary">
                {current.summary}
              </p>

              <dl className="mt-8 divide-y divide-border-default border-y border-border-default">
                {[
                  ["Cliente", current.detail.client],
                  ["Industria", current.detail.industry],
                  ["Servicio", current.detail.service],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="grid gap-1 py-3 sm:grid-cols-[7rem_1fr] sm:gap-4"
                  >
                    <dt className="mono-label text-micro leading-6 text-text-muted">
                      {k}
                    </dt>
                    <dd className="text-body-sm text-text-primary">{v}</dd>
                  </div>
                ))}
              </dl>

              <h4 className="mt-10 font-display text-h4 font-semibold text-text-primary">
                El reto
              </h4>
              <p className="mt-3 text-body text-text-secondary">
                {current.detail.challenge}
              </p>

              <h4 className="mt-10 font-display text-h4 font-semibold text-text-primary">
                La solución
              </h4>
              {current.detail.solutionIntro && (
                <p className="mt-3 text-body text-text-secondary">
                  {current.detail.solutionIntro}
                </p>
              )}
              <Checklist items={current.detail.solution} />

              <h4 className="mt-10 font-display text-h4 font-semibold text-text-primary">
                Resultados
              </h4>
              <Checklist items={current.detail.results} />

              <div className="mt-10 rounded-card border border-border-default bg-surface-subtle p-6">
                <p className="font-display text-h4 font-semibold text-text-primary">
                  {current.detail.cta}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="#contacto"
                    onClick={close}
                    className="btn-arrow inline-flex h-11 items-center gap-2 rounded-button bg-elevate-blue px-5 font-display text-button font-semibold text-white transition-colors duration-base hover:bg-blue-700 active:bg-blue-800 focus-ring"
                  >
                    Conversemos
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    onClick={close}
                    className="inline-flex h-11 items-center rounded-button border border-border-default bg-white px-5 font-display text-button font-semibold text-text-primary transition-colors duration-base hover:bg-surface-subtle focus-ring"
                  >
                    Volver a los casos
                  </button>
                </div>
              </div>
            </div>

            <aside
              aria-hidden="true"
              className={`relative isolate order-first flex min-h-44 flex-col justify-between gap-10 overflow-hidden p-6 md:p-10 lg:order-none lg:sticky lg:top-0 lg:h-[min(calc(100dvh-1.5rem),56rem)] lg:self-start ${themes[current.theme].panel}`}
            >
              <Glow {...themes[current.theme].glow} />
              <Logo
                c={current}
                h={current.logoH.modal}
                white={themes[current.theme].logoWhite}
              />
              <div>
                <p className="font-display text-display-lg font-semibold tabular-nums">
                  {current.highlight.value}
                </p>
                <p
                  className={`mono-label mt-3 max-w-[26ch] text-micro ${themes[current.theme].panelMuted}`}
                >
                  {current.highlight.label}
                </p>
              </div>
            </aside>
          </div>
        )}
      </dialog>
    </>
  );
}

/*
  Capabilities as a mosaic of four sub-services (peers, not steps: no numbers, no connecting line).
  Depth comes from tiles of different size and color, the moving glints on the dark ones and the product shadow.
  The chips stay on one straight grid (a tilted version read as untidy); each one lifts and fills under the cursor.
*/
const TILES_LAYOUT = [
  { span: "lg:col-span-7", theme: null },
  { span: "lg:col-span-5", theme: "excellence" },
  { span: "lg:col-span-5", theme: "vivid" },
  { span: "lg:col-span-7", theme: null },
] as const;

export function CapTiles({ grupo }: { grupo: "software" | "cloud" }) {
  const caps = Object.values(CAPS).filter((c) => c.grupo === grupo);
  return (
    <ul className="mt-10 grid gap-4 lg:grid-cols-12">
      {caps.map((c, i) => {
        const { span, theme } = TILES_LAYOUT[i % TILES_LAYOUT.length];
        const t = theme ? themes[theme] : null;
        return (
          <li
            key={c.nombre}
            className={`reveal relative isolate flex min-h-[17rem] min-w-0 flex-col justify-between gap-10 overflow-hidden rounded-card p-6 shadow-card-rest md:p-8 ${span} ${t ? t.card : "border border-border-default bg-[linear-gradient(160deg,#fff_45%,var(--color-surface-subtle))]"}`}
            style={{ ["--i" as string]: i }}
          >
            {t && <Glow {...t.glow} />}
            {/* the terms each service's own text names, as quiet tags: light, fully rounded, no hover, not buttons */}
            <div aria-hidden="true" className="flex flex-wrap gap-2">
              {c.piezas.map((p) => (
                <span
                  key={p}
                  className={`inline-flex h-7 items-center rounded-full border px-3 text-caption font-light ${
                    t ? "border-white/25 text-white/85" : "border-border-default text-text-secondary"
                  }`}
                >
                  {p}
                </span>
              ))}
            </div>
            <div className="min-w-0">
              <h3
                className={`font-display text-h3 font-semibold ${t ? "text-white" : "text-text-primary"}`}
              >
                {c.nombre}
              </h3>
              <p
                className={`mt-2 max-w-[46ch] text-body ${t ? t.panelMuted : "text-text-secondary"}`}
              >
                {c.texto}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/*
  The quality standard as one compact panel on Elevate Blue (same stage as the public-sector case).
  Left: the rule. Right: the four thresholds, figure and label only. No gauges or bars: an empty bar next to a
  "0" read as "not met" (team feedback, Nov 10 2026).
*/
/* lucide set, picked via Iconifika (Nov 11 2026): each one names what the dimension checks */
const DIMENSION_ICONS: Record<string, typeof Check> = {
  Seguro: ShieldCheck, // no exposed vulnerabilities or credentials
  Estable: MonitorCheck, // production running clean
  Mantenible: Blocks, // well-structured pieces any team can evolve
  Probado: ListChecks, // a list of passing tests
};

export function QualityGate({ dimensions }: { dimensions: { name: string; text: string }[] }) {
  const t = themes.vivid;
  return (
    // the dimensions in one row, each with its bare stroke icon (no box, no fill, no glow; team, Nov 11 2026), no dividers
    <div className={`reveal relative isolate mt-8 overflow-hidden rounded-card p-6 shadow-product md:mt-10 md:p-10 lg:p-12 ${t.card}`}>
      <Glow {...t.glow} />
      <ol className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-12">
        {dimensions.map((d, n) => (
          <li key={d.name} className="reveal min-w-0" style={{ ["--i" as string]: n + 1 }}>
            {(() => {
              const Icon = DIMENSION_ICONS[d.name] ?? Check;
              return (
                <Icon size={28} strokeWidth={1.5} className="text-white" aria-hidden="true" />
              );
            })()}
            <p className="mt-4 font-display text-h3 font-semibold text-white">{d.name}</p>
            <p className="mt-2 max-w-[28ch] text-body-sm text-white">{d.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/*
  Hero asset: the landing's cases stacked like Apple Wallet (Adrián, Nov 11 2026, from his wallet-stack.html).
  The front card shows in full, the ones behind only their header; tapping one brings it to the front.
  It rotates every 5 s until the visitor touches it, pauses on hover/focus and stays still with reduced motion.
  No "Ver caso" here (team, Nov 11 2026): the cases section right below opens them. Desktop and landscape tablet only
  (lg+), where the hero fits whole; on smaller screens the cases section follows right away. Data: data/cases.ts.
*/
export function WalletStack({ ids }: { ids: string[] }) {
  const list = ids.map((id) => cases.find((c) => c.id === id)).filter((c): c is CaseStudy => !!c);
  const n = list.length;
  // pile from back to front: the last index is the card in front; the first case starts in front
  const [order, setOrder] = useState(() => list.map((_, i) => i).reverse());
  const auto = useRef(true);
  const paused = useRef(false);

  const bringFront = (i: number) => setOrder((o) => (o[o.length - 1] === i ? o : o.filter((x) => x !== i).concat(i)));

  useEffect(() => {
    if (n < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (!auto.current || paused.current || document.hidden) return;
      setOrder((o) => {
        const next = (o[o.length - 1] + 1) % n;
        return o.filter((x) => x !== next).concat(next);
      });
    }, 5000);
    return () => clearInterval(t);
  }, [n]);

  const pick = (i: number) => {
    auto.current = false;
    bringFront(i);
  };

  if (!n) return null;
  return (
    <div
      role="group"
      aria-label="Casos destacados"
      className="relative mx-auto w-full max-w-[29rem] [--card-h:21rem] [--peek:4rem]"
      style={{ height: `calc(var(--card-h) + var(--peek) * ${n - 1})` }}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      {list.map((c, i) => {
        const slot = order.indexOf(i);
        const depth = n - 1 - slot; // 0 = front
        const active = depth === 0;
        const t = themes[c.theme];
        return (
          <article
            key={c.id}
            aria-current={active ? "true" : undefined}
            className={`absolute inset-x-0 top-0 isolate flex h-[var(--card-h)] origin-top flex-col overflow-hidden rounded-card px-6 pb-6 pt-5 shadow-product transition-transform duration-700 ease-[cubic-bezier(.22,.9,.24,1)] [transform:translateY(calc(var(--peek)*var(--slot)+var(--lift,0px)))_scale(calc(1-var(--depth)*.035))] motion-reduce:transition-none sm:px-7 ${active ? "" : "hover:[--lift:-8px]"} ${t.card}`}
            style={{ zIndex: slot + 1, ["--slot" as string]: slot, ["--depth" as string]: depth }}
          >
            <Glow {...t.glow} />
            {/* header: the only part a card behind shows; the button covers the whole card while it is behind */}
            <button
              type="button"
              onClick={() => pick(i)}
              aria-label={active ? `${c.client}: ${c.title}` : `Mostrar caso ${c.client}`}
              className={`flex min-h-6 items-center justify-between gap-4 text-left focus-ring ${active ? "cursor-default" : "after:absolute after:inset-0 after:content-['']"}`}
            >
              <span className={`mono-label min-w-0 text-nano ${active ? "" : "truncate"} ${t.tag}`}>{c.tag}</span>
              <Logo c={c} h={Math.round(c.logoH.card * 0.6)} white={t.logoWhite} />
            </button>
            <div className={`mt-6 flex flex-1 flex-col transition-[opacity,transform] duration-500 ${active ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none translate-y-2 opacity-0"}`} aria-hidden={!active}>
              <p className="max-w-[18ch] break-words font-display text-h3 font-semibold">{c.title}</p>
              <div className="mt-auto">
                <p className="break-words font-display text-display-lg font-semibold leading-none tabular-nums">{c.highlight.value}</p>
                <p className={`mono-label mt-2 max-w-[30ch] text-micro ${t.panelMuted}`}>{c.highlight.label}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
