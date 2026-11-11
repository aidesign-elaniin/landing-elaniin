import { ListChecks, MonitorCheck, Blocks, Check, ShieldCheck } from "lucide-react";
import { Glow, themes } from "./case-visuals";

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
