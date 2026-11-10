"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Check,
  Landmark,
  Maximize2,
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
            className={`reveal relative isolate flex min-h-[17rem] min-w-0 flex-col justify-between gap-10 overflow-hidden rounded-card p-6 shadow-product md:p-8 ${span} ${t ? t.card : "border border-border-default bg-[linear-gradient(160deg,#fff_45%,var(--color-surface-subtle))]"}`}
            style={{ ["--i" as string]: i }}
          >
            {t && <Glow {...t.glow} />}
            {/* the terms each service's own text names: one straight row of equal chips; the one under the cursor lifts and fills */}
            <div aria-hidden="true" className="flex flex-wrap gap-2">
              {c.piezas.map((p) => (
                <span
                  key={p}
                  className={`group/chip inline-flex h-10 cursor-default items-center gap-2 rounded-button border px-3.5 font-display text-body-sm font-semibold transition duration-base hover:-translate-y-1 hover:shadow-[0_16px_22px_-12px_rgba(0,0,64,.5)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                    t
                      ? "border-white/25 bg-white/10 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-text-primary"
                      : "border-border-default bg-white text-text-primary shadow-card-rest hover:border-inspire-blue hover:bg-inspire-blue hover:text-white"
                  }`}
                >
                  <i
                    className={`size-1.5 rounded-module transition-colors duration-base ${t ? "bg-white group-hover/chip:bg-inspire-blue" : "bg-inspire-blue group-hover/chip:bg-white"}`}
                  />
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
  The quality standard as one compact instrument panel on Elevate Blue (same stage as the public-sector case).
  Left: a seven-segment arc, all lit, with "7/7" inside: every dimension passed before production.
  Right: the four thresholds the final texts name, as tight rows (figure, label, ten-step gauge), not as cards.
  References: segmented arc gauge with the figure inside and small stat chips (pin 1115063189023198346);
  small figures with a compact range indicator (pin 1115063189023236389).
*/
const ARC = Array.from({ length: 7 }, (_, k) => {
  // seven strokes along a half circle (180° to 0°), 4° of gap between them
  const step = 180 / 7, gap = 4, r = 84, cx = 110, cy = 104;
  const pt = (deg: number) => `${(cx + r * Math.cos((deg * Math.PI) / 180)).toFixed(2)} ${(cy - r * Math.sin((deg * Math.PI) / 180)).toFixed(2)}`;
  return `M ${pt(180 - k * step - gap / 2)} A ${r} ${r} 0 0 1 ${pt(180 - (k + 1) * step + gap / 2)}`;
});

export function QualityGate({ thresholds }: { thresholds: { value: string; label: string; fill: number }[] }) {
  const t = themes.vivid;
  return (
    <div className={`reveal relative isolate mt-12 grid items-center gap-y-8 overflow-hidden rounded-card p-6 shadow-product md:mt-16 md:p-10 lg:grid-cols-12 lg:gap-x-12 ${t.card}`}>
      <Glow {...t.glow} />
      <div className="flex min-w-0 items-center gap-6 max-sm:flex-col max-sm:items-start lg:col-span-5">
        <div className="relative w-[13.75rem] shrink-0">
          <svg viewBox="0 0 220 112" className="block w-full" aria-hidden="true">
            {ARC.map((d, k) => (
              <path key={k} d={d} fill="none" stroke="#fff" strokeWidth="22" className="reveal" style={{ ["--i" as string]: k + 1 }} />
            ))}
          </svg>
          <p className="absolute inset-x-0 bottom-0 text-center font-display text-[2.5rem] font-semibold leading-none tabular-nums" aria-label="Siete de siete">
            7<span className={t.panelMuted}>/7</span>
          </p>
        </div>
        <div className="min-w-0">
          <p className={`mono-label text-micro ${t.panelMuted}`}>Software Nivel A</p>
          <p className="mt-2 max-w-[22ch] font-display text-h4 font-medium text-white">dimensiones de evaluación superadas antes de llegar a producción.</p>
        </div>
      </div>
      <div className="min-w-0 lg:col-span-7">
        <p className={`mono-label text-micro ${t.panelMuted}`}>Entre ellas</p>
        <ul className="mt-3">
          {thresholds.map((th, n) => (
            <li key={th.label} className="reveal flex min-w-0 items-center gap-4 border-t border-white/25 py-3" style={{ ["--i" as string]: n + 1 }}>
              <p className="w-[5.5rem] shrink-0 font-mono text-h3 font-semibold leading-none tabular-nums text-white">{th.value}</p>
              <p className="min-w-0 flex-1 text-body-sm text-white">{th.label}</p>
              <div className="grid w-24 shrink-0 grid-cols-10 gap-0.5 max-sm:hidden" aria-hidden="true">
                {Array.from({ length: 10 }, (_, k) => (
                  <i key={k} className={`h-3 rounded-[2px] ${k < th.fill ? "bg-white" : "bg-white/25"}`} />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/*
  Hero asset: real proof instead of decoration. Two case cards stacked and tilted in space, with the second
  case's figure and a seal leaving the plane. It straightens on hover. Everything comes from data/cases.ts.
  Decorative (aria-hidden): the cases section below exposes the same content to assistive tech.
*/
export function HeroStack({ ids, sello }: { ids: string[]; sello: string }) {
  const [front, back] = ids.map((id) => cases.find((c) => c.id === id)).filter((c): c is CaseStudy => !!c);
  if (!front) return null;
  const t = themes[front.theme];
  const pop = "absolute rounded-card shadow-[0_30px_40px_-20px_rgba(0,0,64,.5)]";
  return (
    <div aria-hidden="true" className="rise group col-span-5 min-w-0 self-center pb-12 pt-24 pl-4 [perspective:1500px] max-lg:hidden xl:pl-10 min-[1400px]:pl-20" style={{ ["--i" as string]: 3 }}>
      <div className="relative transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] [transform-style:preserve-3d] [transform:rotateY(-19deg)_rotateX(7deg)_rotateZ(1.5deg)] [zoom:.78] group-hover:[transform:rotateY(-7deg)_rotateX(3deg)] motion-reduce:transition-none xl:[zoom:.88] min-[1400px]:[zoom:1]">
        {/* the case behind: it rises enough above the front card for its sector line and logo to read */}
        {back && (
          <div className={`absolute inset-x-5 -top-[5.5rem] flex h-48 items-start justify-between gap-4 overflow-hidden rounded-card px-6 py-5 shadow-product [transform:translateZ(-60px)] ${themes[back.theme].card}`}>
            <p className={`mono-label text-micro ${themes[back.theme].tag}`}>{back.tag}</p>
            <Logo c={back} h={Math.round(back.logoH.card * 0.6)} white={themes[back.theme].logoWhite} />
          </div>
        )}
        {/* the case in front */}
        <div className={`relative isolate flex min-h-[24rem] flex-col justify-between gap-8 overflow-hidden rounded-card p-7 shadow-[0_60px_80px_-40px_rgba(0,0,64,.45),0_30px_40px_-30px_rgba(0,0,0,.25)] ${t.card}`}>
          <Glow {...t.glow} />
          <p className={`mono-label text-nano ${t.tag}`}>{front.tag}</p>
          <div className="min-w-0">
            <Logo c={front} h={front.logoH.card} white={t.logoWhite} />
            <p className="mt-5 max-w-[14ch] break-words font-display text-h2 font-semibold">{front.title}</p>
          </div>
          <div className="border-t border-border-on-dark pt-5">
            <p className="break-words font-display text-display-lg font-semibold tabular-nums">{front.highlight.value}</p>
            <p className={`mono-label mt-2 max-w-[26ch] text-micro ${t.panelMuted}`}>{front.highlight.label}</p>
          </div>
        </div>
        {/* pieces that leave the plane */}
        {back && (
          <div className={`${pop} right-[-10%] top-[50%] w-[44%] bg-excellence-blue px-5 py-4 text-white [transform:translateZ(90px)]`}>
            <div className="float-chip">
              <p className="font-display text-[1.75rem] font-semibold leading-none tabular-nums">{back.highlight.value}</p>
              <p className="mono-label mt-2 text-nano text-text-on-dark-accent">{back.highlight.label}</p>
            </div>
          </div>
        )}
        <div className={`${pop} bottom-[-9%] right-[7%] border border-border-default bg-white p-2.5 [transform:translateZ(70px)]`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ponytail: static SVG badge */}
          <img src={asset(`/certifications/${sello}.svg`)} alt="" className="float-chip h-14 w-auto [animation-delay:-3s]" />
        </div>
      </div>
    </div>
  );
}
