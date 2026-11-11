import type { Variant } from "@/data/variants";
import { Glow, themes } from "./case-visuals";

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

export function CapTiles({ items: caps }: { items: Variant["capabilities"]["items"] }) {
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
