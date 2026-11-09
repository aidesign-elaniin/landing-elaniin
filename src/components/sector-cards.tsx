"use client";

import Image from "next/image";
import { Building2, Landmark } from "lucide-react";
import { Glow, themes } from "./cases";

type Item = {
  key: "privado" | "publico";
  label: string;
  text: string;
  clients: { name: string; src: string | null }[];
};

const icons = { privado: Building2, publico: Landmark } as const;

/* Celdas vacías que completan la última fila del panel (sin ellas se vería el color de las líneas): mobile = 2 columnas, md+ = 3. */
const fillers = { privado: { mobile: 1, md: 0 }, publico: { mobile: 1, md: 1 } } as const;

export function SectorCards({ items }: { items: Item[] }) {
  return (
    <ul className="mt-12 grid gap-6 lg:flex">
      {items.map((s, n) => {
        const Icon = icons[s.key];
        return (
          <li
            key={s.key}
            id={`sector-${s.key}`}
            aria-labelledby={`sector-${s.key}-title`}
            style={{ ["--i" as string]: n }}
            className="reveal relative isolate flex min-w-0 flex-col gap-8 overflow-hidden rounded-card border border-border-on-dark pad-card lg:basis-0 lg:flex-1"
          >
            <div className="absolute inset-0 -z-10 opacity-60" aria-hidden="true">
              <Glow {...themes.black.glow} />
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-button border border-border-on-dark bg-surface-dark-card text-text-on-dark-accent">
                <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 id={`sector-${s.key}-title`} className="font-display text-h4 font-medium text-white">
                {s.label}
              </h3>
            </div>
            <p className="-mt-4 text-card text-text-on-dark-secondary">{s.text}</p>

            <ul
              className="mt-auto grid grid-cols-2 overflow-hidden rounded-card bg-surface-dark-card md:h-72 md:grid-cols-3 md:grid-rows-[repeat(var(--rows),minmax(0,1fr))]"
              style={{ ["--rows" as string]: Math.ceil((s.clients.length + fillers[s.key].md) / 3) }}
              aria-label={`Clientes del ${s.label.toLowerCase()}`}
            >
              {s.clients.map((c) => (
                <li key={c.name} className="group flex min-h-24 min-w-0 items-center justify-center px-2">
                  {c.src ? (
                    <Image
                      src={c.src}
                      alt={c.name}
                      width={185}
                      height={43}
                      unoptimized
                      className="pointer-events-none h-auto w-full max-w-[185px] opacity-70 brightness-0 invert transition-opacity duration-base group-hover:opacity-100"
                    />
                  ) : (
                    <span className="break-words text-center font-display text-body font-medium text-text-on-dark-muted transition-colors duration-base group-hover:text-white">{c.name}</span>
                  )}
                </li>
              ))}
              {Array.from({ length: fillers[s.key].mobile }, (_, i) => (
                <li key={`f${i}`} aria-hidden="true" className={fillers[s.key].md ? "" : "md:hidden"} />
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
