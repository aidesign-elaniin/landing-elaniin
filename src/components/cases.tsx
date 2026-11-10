"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Building2, Check, Landmark, Maximize2, Smartphone, Users, X } from "lucide-react";
import { cases, type CaseStudy } from "@/data/cases";
import { asset } from "@/lib/site";

const icons = { tse: Landmark, credicomer: Smartphone, procesar: Building2, jostens: Users } as const;

function Logo({ c, h, white = false }: { c: CaseStudy; h: number; white?: boolean }) {
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
    glow: { primary: "#99b0fe", bg: "#1054ff", angle: 115, reverse: false, slow: 1 },
  },
  black: {
    card: "bg-elaniin-black text-white",
    tag: "text-text-on-dark-accent",
    title: "text-white",
    logoWhite: true,
    button: "bg-elevate-blue text-white hover:bg-blue-700",
    panel: "bg-elaniin-black text-white",
    panelMuted: "text-text-on-dark-accent",
    glow: { primary: "#1054ff", bg: "#0c0c0c", angle: 65, reverse: true, slow: 0.9 },
  },
  excellence: {
    card: "bg-excellence-blue text-white",
    tag: "text-text-on-dark-accent",
    title: "text-white",
    logoWhite: true,
    button: "bg-elevate-blue text-white hover:bg-blue-700",
    panel: "bg-excellence-blue text-white",
    panelMuted: "text-text-on-dark-accent",
    glow: { primary: "#1054ff", bg: "#000040", angle: 150, reverse: false, slow: 1.3 },
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

type GlowProps = { primary: string; bg: string; angle: number; reverse: boolean; slow: number };

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
    <div className="mask-glow pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
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
function CaseCard({ c, onOpen, index }: { c: CaseStudy; onOpen: () => void; index: number }) {
  const t = themes[c.theme];
  return (
    <article
      /* The pin offset lives in --stick and is only used together with `sticky`: as a plain `top` it also moved the
         non-sticky (relative) card down and pushed the last one over the next section. On phones the stack is on
         only when the screen is tall enough to show a whole card under the bar. */
      className={`card-glow reveal relative isolate grid min-w-0 cursor-pointer gap-8 rounded-card pad-card shadow-product md:sticky md:top-(--stick) md:min-h-[26rem] md:grid-cols-[1.3fr_1fr] md:gap-12 [@media(min-height:700px)]:sticky [@media(min-height:700px)]:top-(--stick) ${t.card}`}
      style={{ ["--i" as string]: index, ["--stick" as string]: `calc(var(--nav-height) + ${16 + index * 16}px)` }}
    >
      <Glow {...t.glow} />

      <div className="flex min-w-0 flex-col justify-between gap-10">
        <p className={`mono-label text-nano ${t.tag}`}>{c.tag}</p>
        <div className="min-w-0">
          <div className="flex h-14 items-center">
            <Logo c={c} h={c.logoH.card} white={t.logoWhite} />
          </div>
          <h3 className={`mt-4 break-words font-display text-h1 font-semibold md:max-w-[16ch] ${t.title}`}>{c.title}</h3>
          <p className={`mt-3 max-w-[44ch] text-body ${t.panelMuted}`}>{c.summary}</p>
        </div>
        <div>
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            aria-label={`${c.button}: ${c.client}, ${c.title}`}
            className={`btn-arrow inline-flex h-11 items-center gap-2 rounded-button px-4 font-display text-button font-semibold transition-colors duration-base after:absolute after:inset-0 after:content-[''] focus-ring ${t.button}`}
          >
            {c.button}
            <Maximize2 size={15} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* the figure leads, its label stays small */}
      <div className="flex min-w-0 flex-col justify-end border-t border-border-on-dark pt-6 md:border-l md:border-t-0 md:pl-12 md:pt-0">
        <p className="break-words font-display text-display-lg font-semibold tabular-nums">{c.highlight.value}</p>
        <p className={`mono-label mt-3 max-w-[26ch] text-micro ${t.panelMuted}`}>{c.highlight.label}</p>
      </div>
    </article>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 divide-y divide-border-default">
      {items.map((t) => (
        <li key={t} className="flex gap-3 py-3 first:pt-0 last:pb-0">
          <Check size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-elevate-blue" aria-hidden="true" />
          <span className="min-w-0 text-body text-text-secondary">{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function Cases({ ids }: { ids: string[] }) {
  const shown = ids.map((id) => cases.find((c) => c.id === id)).filter((c): c is CaseStudy => !!c);
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
      <div className="mt-10 flex flex-col gap-6">
        {shown.map((c, i) => (
          <CaseCard key={c.id} c={c} index={i} onOpen={() => setOpenId(c.id)} />
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
                <span className="mono-label text-micro text-text-secondary">{current.tag}</span>
              </div>
              <h3 id="case-title" className="mt-8 break-words font-display text-h2 font-semibold text-text-primary">
                {current.title}
              </h3>
              <p className="mt-4 text-body-lg text-text-secondary">{current.summary}</p>

              <dl className="mt-8 divide-y divide-border-default border-y border-border-default">
                {[
                  ["Cliente", current.detail.client],
                  ["Industria", current.detail.industry],
                  ["Servicio", current.detail.service],
                ].map(([k, v]) => (
                  <div key={k} className="grid gap-1 py-3 sm:grid-cols-[7rem_1fr] sm:gap-4">
                    <dt className="mono-label text-micro leading-6 text-text-muted">{k}</dt>
                    <dd className="text-body-sm text-text-primary">{v}</dd>
                  </div>
                ))}
              </dl>

              <h4 className="mt-10 font-display text-h4 font-semibold text-text-primary">El reto</h4>
              <p className="mt-3 text-body text-text-secondary">{current.detail.challenge}</p>

              <h4 className="mt-10 font-display text-h4 font-semibold text-text-primary">La solución</h4>
              {current.detail.solutionIntro && <p className="mt-3 text-body text-text-secondary">{current.detail.solutionIntro}</p>}
              <Checklist items={current.detail.solution} />

              <h4 className="mt-10 font-display text-h4 font-semibold text-text-primary">Resultados</h4>
              <Checklist items={current.detail.results} />

              <div className="mt-10 rounded-card border border-border-default bg-surface-subtle p-6">
                <p className="font-display text-h4 font-semibold text-text-primary">{current.detail.cta}</p>
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
              <Logo c={current} h={current.logoH.modal} white={themes[current.theme].logoWhite} />
              <div>
                <p className="font-display text-display-lg font-semibold tabular-nums">{current.highlight.value}</p>
                <p className={`mono-label mt-3 max-w-[26ch] text-micro ${themes[current.theme].panelMuted}`}>{current.highlight.label}</p>
              </div>
            </aside>
          </div>
        )}
      </dialog>
    </>
  );
}
