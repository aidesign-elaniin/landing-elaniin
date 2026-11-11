"use client";

import { useEffect, useRef, useState } from "react";
import { cases, type CaseStudy } from "@/data/cases";
import { Glow, Logo, themes } from "./case-visuals";

/*
  Hero asset: the landing's cases stacked like Apple Wallet (Adrián, Nov 11 2026, from his wallet-stack.html).
  The front card shows in full, the ones behind only their header; tapping one brings it to the front.
  It rotates every 5 s until the visitor touches it, pauses on hover/focus and stays still with reduced motion.
  No "Ver caso" here (team, Nov 11 2026): the cases section right below opens them. Desktop and landscape tablet only
  (lg+), where the hero fits whole; on smaller screens the cases section follows right away. Data: data/cases.ts.
*/
export function WalletStack({ ids, tags = {} }: { ids: string[]; tags?: Record<string, string> }) {
  const list = ids.map((id) => cases.find((c) => c.id === id)).filter((c): c is CaseStudy => !!c);
  const n = list.length;
  // pile from back to front: the last index is the card in front; the first case starts in front
  const [order, setOrder] = useState(() => list.map((_, i) => i).reverse());
  const auto = useRef(true);
  const paused = useRef(false);
  // tap feedback from the reference video: a ring that opens where the pointer lands
  const [tap, setTap] = useState<{ x: number; y: number; k: number } | null>(null);

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
      className="relative mx-auto w-full max-w-[28.75rem] [--card-h:25rem] [--peek:4rem]"
      style={{ height: `calc(var(--card-h) + var(--peek) * ${n - 1})` }}
      onPointerDown={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTap({ x: e.clientX - r.left, y: e.clientY - r.top, k: e.timeStamp });
      }}
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
            className={`absolute inset-x-0 top-0 isolate flex h-[var(--card-h)] origin-top flex-col overflow-hidden rounded-[24px] px-7 pb-7 pt-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_-2px_12px_-6px_rgba(0,0,64,.25),0_28px_50px_-24px_rgba(0,0,64,.55)] transition-transform duration-[650ms] ease-[cubic-bezier(.22,.9,.24,1)] [transform:translateY(calc(var(--peek)*var(--slot)+var(--lift,0px)))_scale(calc((1-var(--depth)*.035)*var(--press,1)))] active:[--press:.97] motion-reduce:transition-none sm:px-7 ${active ? "" : "cursor-pointer hover:[--lift:-8px]"} ${t.card}`}
            style={{ zIndex: slot + 1, ["--slot" as string]: slot, ["--depth" as string]: depth }}
          >
            <Glow {...t.glow} />
            {/* header: the only part a card behind shows; the button covers the whole card while it is behind */}
            <button
              type="button"
              onClick={() => pick(i)}
              aria-label={active ? `${c.client}: ${c.heroTitle ?? c.title}` : `Mostrar caso ${c.client}`}
              className={`flex min-h-6 items-center justify-between gap-4 text-left focus-ring ${active ? "cursor-default" : "cursor-pointer after:absolute after:inset-0 after:content-['']"}`}
            >
              {/* this landing's tag, or only the industry; one part per line, never cut with an ellipsis (team, Nov 11 2026) */}
              <span className={`mono-label flex min-w-0 flex-col text-nano ${t.tag}`}>
                {/* industry first and solid; the service under it, lighter, so the two lines read as title and detail */}
                {(tags[c.id] ?? c.tag.split(" · ")[0]).split(" · ").map((part, n) => (
                  <span key={part} className={n ? "mt-0.5 font-medium normal-case tracking-normal opacity-65" : undefined}>
                    {part}
                  </span>
                ))}
              </span>
              <Logo c={c} h={Math.round(c.logoH.card * 0.6)} white={t.logoWhite} />
            </button>
            <div className={`mt-7 flex flex-1 flex-col transition-[opacity,transform] duration-500 ${active ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none translate-y-2 opacity-0"}`} aria-hidden={!active}>
              <p className="max-w-[16ch] break-words font-display text-h2 font-semibold">{c.heroTitle ?? c.title}</p>
              <div className="mt-auto">
                <p className="break-words font-display text-display-lg font-semibold leading-none tabular-nums">{c.highlight.value}</p>
                <p className={`mono-label mt-2 max-w-[30ch] text-micro ${t.panelMuted}`}>{c.highlight.label}</p>
              </div>
            </div>
          </article>
        );
      })}
      {tap && (
        <span
          key={tap.k}
          aria-hidden="true"
          onAnimationEnd={() => setTap(null)}
          className="tap-ring pointer-events-none absolute z-50 h-10 w-10 rounded-full border-2 border-blue-300"
          style={{ left: tap.x, top: tap.y }}
        />
      )}
    </div>
  );
}
