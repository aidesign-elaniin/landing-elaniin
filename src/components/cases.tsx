"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { MonitorPlay, ArrowRight, Building2, Check, Landmark, Maximize2, Smartphone, Users, X } from "lucide-react";
import { cases, type CaseStudy } from "@/data/cases";
import { Glow, Logo, themes } from "./case-visuals";

const icons: Record<string, typeof Landmark> = {
  tse: Landmark,
  credicomer: Smartphone,
  procesar: Building2,
  jostens: Users,
  publimovil: MonitorPlay,
};

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
                  {createElement(icons[current.id] ?? Building2, { size: 22, strokeWidth: 1.5, "aria-hidden": true })}
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
              {current.summary && <p className="mt-4 text-body-lg text-text-secondary">{current.summary}</p>}

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
