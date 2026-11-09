import Image from "next/image";
import { Lock } from "lucide-react";
import { projectSample as p } from "@/data/project-sample";
import { SoftwareDevelopmentIcon } from "./icons/elaniin-icons";

const services = [
  { title: "Desarrollo de software", text: "Apps, plataformas, ERP e integraciones construidas para tu operación.", Icon: SoftwareDevelopmentIcon },
  { title: "Google Cloud", text: "Migración, gestión de APIs con Apigee y operación en la nube, con facturación local.", Icon: null },
] as const;

type Shot = (typeof p.shots)[number];

/* Real screenshot, served by next/image (AVIF/WebP, several widths, quality 90) so the interface text stays sharp. */
function Screen({ shot, sizes, className = "", priority = false }: { shot: Shot; sizes: string; className?: string; priority?: boolean }) {
  return <Image src={shot.src!} alt={shot.alt} width={shot.w} height={shot.h} sizes={sizes} quality={90} priority={priority} className={`block h-auto w-full ${className}`} />;
}

/* Glass browser window (the website's "browser window" hero): translucent frame with grain, chrome and the interface inset inside it. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function GlassWindow({ shot, side }: { shot: Shot; side: Shot }) {
  return (
    <div aria-hidden="false" className="relative h-[260px] overflow-hidden sm:h-[340px] lg:h-[380px]">
      {/* the glow behind the glass, so the frame has something to be glass over */}
      <div className="absolute -top-10 left-10 h-[220px] w-[360px] rounded-full bg-blue-300/45" style={{ filter: "blur(70px)" }} aria-hidden="true" />
      <div className="absolute left-[45%] top-[120px] h-[200px] w-[300px] rounded-full bg-blue-200/70" style={{ filter: "blur(70px)" }} aria-hidden="true" />

      <div
        className="absolute left-0 top-0 w-[118%] overflow-hidden rounded-card border border-white/70 bg-white/45 p-2 shadow-product sm:p-3"
        style={{ backdropFilter: "blur(24px) saturate(1.4)", WebkitBackdropFilter: "blur(24px) saturate(1.4)" }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay" style={{ backgroundImage: GRAIN, backgroundSize: "160px 160px" }} aria-hidden="true" />
        <div className="relative flex h-6 items-center gap-3 px-1 sm:h-8" aria-hidden="true">
          <span className="flex gap-1.5">
            <span className="size-2 rounded-full bg-border-strong" />
            <span className="size-2 rounded-full bg-border-strong" />
            <span className="size-2 rounded-full bg-border-strong" />
          </span>
          <span className="mx-auto flex h-5 w-[210px] max-w-[60%] items-center justify-center gap-1.5 rounded-input bg-white/60 font-text text-[10px] text-text-secondary sm:h-6 sm:text-tag-sm">
            <Lock className="size-2.5" strokeWidth={1.75} />
            plataforma.tramites.com
          </span>
          <span className="w-10" />
        </div>
        <Screen shot={shot} sizes="(min-width: 1024px) 800px, 118vw" className="relative mt-1 rounded-menu border border-border-default" priority />
      </div>

      {/* a second screen as a glass card over the left corner: one composition */}
      <div className="absolute bottom-4 left-4 w-[36%] max-w-[230px] rounded-menu border border-white/70 bg-white/80 p-1.5 shadow-menu backdrop-blur-md sm:bottom-6 sm:left-6">
        <Screen shot={side} sizes="230px" className="rounded-tag border border-border-default" />
      </div>
    </div>
  );
}

export function ProjectShowcase() {
  return (
    <>
      <article
        className="reveal relative isolate col-span-12 flex min-w-0 flex-col gap-6 rounded-card border border-border-default bg-surface-subtle pad-card lg:col-span-7"
        style={{ ["--i" as string]: 0 }}
      >
        <GlassWindow shot={p.shots[0]} side={p.shots[2]} />
        <div className="mt-auto">
          <h3 className="min-w-0 max-w-[32ch] break-words font-display text-h3 font-medium text-text-primary">{p.title}</h3>
        </div>
      </article>

      <div className="col-span-12 flex min-w-0 flex-col lg:col-span-5">
        <ol className="reveal divide-y divide-border-default border-y border-border-default" style={{ ["--i" as string]: 1 }}>
          {services.map((s) => (
            <li key={s.title} className="py-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-button border border-border-default bg-white text-elevate-blue">
                  {s.Icon ? (
                    <s.Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                  ) : (
                    <Image src="/certifications/google-cloud-icon.png" alt="" aria-hidden="true" width={26} height={26} unoptimized className="h-[26px] w-[26px]" />
                  )}
                </span>
                <h3 className="min-w-0 font-display text-h4 font-medium text-text-primary">{s.title}</h3>
              </div>
              <p className="mt-4 text-body text-text-secondary">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid min-w-0 gap-6 sm:grid-cols-2 lg:mt-auto lg:pt-8">
          <p className="reveal min-w-0 self-end text-body text-text-secondary" style={{ ["--i" as string]: 2 }}>
            Meses de atraso y presupuestos que crecen son el costo de un proyecto sin dueño. Con Elaniin sabes desde el inicio qué recibes, cuándo y cuánto inviertes.
          </p>
          <div className="reveal flex min-w-0 flex-col justify-between gap-10 rounded-card bg-elevate-blue pad-card text-white" style={{ ["--i" as string]: 3 }}>
            <p className="font-display text-display-lg font-medium tabular-nums" data-count="500" data-prefix="+">
              +500
            </p>
            <p className="text-body-sm text-blue-100">proyectos llevados a producción desde 2014</p>
          </div>
        </div>
      </div>
    </>
  );
}
