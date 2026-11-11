import { Award } from "lucide-react";
import Image from "next/image";
import type { Variant } from "@/data/variants";
import { LeadForm } from "./lead-form";
import { CapTiles, Cases, QualityGate, WalletStack } from "./cases";
import { Nav } from "./nav";
import { Logo } from "./logo";
import { ButtonLink } from "./ui";
import { PrivacyLink } from "./privacy-link";
import { asset } from "@/lib/site";

/* Mode 1 (essential summary). Copy: data/variants.ts + the shared texts below, all from the final texts doc. */
export function Landing({ v }: { v: Variant }) {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero v={v} />
        <Clients />
        {/* storytelling order from the team (Georgina, Nov 10 2026): problem, cases, capabilities, standard, backing, contact */}
        <CasesSection v={v} />
        <Capabilities v={v} />
        <Quality />
        <Backing />
        <Contact v={v} />
      </main>
      <Footer />
    </>
  );
}

/* seal that floats on the hero asset, one per landing */
/* the proof line as one long pill, no bullet (team, Nov 10 2026) */
const PROOF_PILL =
  "w-fit max-w-full rounded-full border border-border-default bg-surface-card px-5 py-2.5 font-display text-body-sm font-medium text-text-primary shadow-card-rest";

/* Cloud: partnerships visible on arrival (Adrián, Nov 11 2026). Same official badge files as the backing section. */
const HERO_PARTNERS = [
  { file: "gcp-services-select", alt: "Google Cloud Select, Services Partner", w: 546, h: 373 },
  { file: "badge-clutch-aws", alt: "AWS Partner, Premier Tier Services", w: 377, h: 377 },
];

function Hero({ v }: { v: Variant }) {
  const h = v.hero;
  return (
    <section className="relative isolate overflow-hidden pb-20 pt-12 md:pb-28 md:pt-16 lg:pb-32 lg:pt-20">
      <div className="container-site relative grid-page gap-y-0">
        <div className="col-span-12 min-w-0 lg:col-span-7">
          {v.id === "cloud" && (
            <div className="rise mb-8 flex items-center gap-3">
              {HERO_PARTNERS.map((b) => (
                <Image key={b.file} src={asset(`/certifications/${b.file}.svg`)} alt={b.alt} width={Math.round((56 * b.w) / b.h)} height={56} unoptimized className="h-14 w-auto md:h-16" />
              ))}
              <p className="ml-1 max-w-[16ch] font-display text-body font-semibold text-text-primary">Partner de Google Cloud y AWS</p>
            </div>
          )}
          <h1 className="rise break-words font-display text-display-lg font-semibold text-text-primary">
            {h.h1} <span className="text-inspire-blue">{h.accent}</span>
          </h1>
          <p className="rise measure-lead mt-6 text-lead text-text-secondary" style={{ ["--i" as string]: 1 }}>
            {h.subtitle}
          </p>
          {/* main action: the contact form further down; the cases are the second path */}
          <div className="rise mt-10 flex flex-wrap items-center gap-3" style={{ ["--i" as string]: 2 }}>
            <ButtonLink href="#contacto" size="lg" className="max-[479px]:w-full">
              {h.button}
            </ButtonLink>
            <a href="#casos" className="inline-flex h-12 items-center justify-center rounded-button border border-border-strong px-6 font-display text-button-lg font-medium text-text-primary transition-colors duration-base hover:bg-surface-subtle focus-ring max-[479px]:w-full">
              Ver casos
            </a>
          </div>
          <p className={`rise aura mt-10 ${PROOF_PILL}`} style={{ ["--i" as string]: 3 }}>
            {h.proof}
          </p>
        </div>
        {/* proof next to the promise: this landing's cases as a wallet; tap one to bring it to the front */}
        <div className="rise col-span-5 min-w-0 self-center max-lg:hidden xl:pl-6" style={{ ["--i" as string]: 3 }}>
          <WalletStack ids={v.cases.ids} />
        </div>
      </div>
    </section>
  );
}

const clients = [
  { file: "cinemark", name: "Cinemark" },
  { file: "papa-johns", name: "Papa Johns" },
  { file: "north-face", name: "The North Face" },
  { file: "iom", name: "IOM" },
  { file: "vital-strategies", name: "Vital Strategies" },
  { file: "infra-del-sur", name: "Infra del Sur" },
];

function ClientLogoImage({ file, name }: { file: string; name: string }) {
  return (
    <Image
      src={asset(`/clients/${file}.svg`)}
      alt={name}
      width={160}
      height={48}
      unoptimized
      className="h-10 w-auto max-w-none brightness-0 invert md:h-12"
    />
  );
}

/* A slow horizontal marquee on every screen size. Four copies of the list so the loop also fills very wide screens. */
function Clients() {
  return (
    <section className="bg-elaniin-black py-10 md:py-12">
      <div className="container-site reveal">
        <p id="clients-label" className="text-center font-display text-body-sm font-medium text-text-on-dark-secondary">
          Empresas e instituciones que ya operan con nuestra ingeniería.
        </p>

        <div className="mask-fade-x mt-8 overflow-hidden">
          <div className="marquee-track flex w-max" style={{ animationDuration: "56s" }}>{/* twice the copies, twice the time: same speed as before */}
            {[0, 1, 2, 3].map((copy) => (
              <ul key={copy} aria-hidden={copy > 0 ? true : undefined} aria-labelledby={copy === 0 ? "clients-label" : undefined} className="flex shrink-0 items-center gap-x-12 pr-12">
                {clients.map((c) => (
                  <li key={c.file} className="flex h-12 items-center">
                    <ClientLogoImage file={c.file} name={copy === 0 ? c.name : ""} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Problem title as the bridge sentence, then the four capability names (each with its description and chips). */
function Capabilities({ v }: { v: Variant }) {
  return (
    <section id="capacidades" className="section-y">
      <div className="container-site">
        <h2 className="reveal max-w-[26ch] break-words font-display text-h2 font-semibold text-text-primary">{v.capabilities.title}</h2>
        {/* The four capabilities are parallel sub-services, not steps: a mosaic of peers (see CapTiles). */}
        <CapTiles grupo={v.id} />
      </div>
    </section>
  );
}

function CasesSection({ v }: { v: Variant }) {
  return (
    <section id="casos" className="section-y bg-surface-subtle">
      <div className="container-site">
        {/* the problem opens the cases: H2 + text, the cases answer it right below */}
        <h2 className="reveal max-w-[26ch] break-words font-display text-h1 font-semibold text-text-primary">{v.problem}</h2>
        <p className="reveal mt-4 max-w-[60ch] text-lead text-text-secondary" style={{ ["--i" as string]: 1 }}>
          {v.cases.title}
        </p>
        <Cases ids={v.cases.ids} />
      </div>
    </section>
  );
}

/* Thresholds and wording from the team (Georgina, Nov 10 2026). Do not reword without the team. */
const THRESHOLDS = [
  { value: "0", label: "vulnerabilidades críticas conocidas" },
  { value: "0", label: "credenciales expuestas" },
  { value: "80\u00a0%", label: "mínimo de cobertura en pruebas automáticas" },
  { value: "100\u00a0%", label: "de entregas revisadas por un ingeniero" },
];

function Quality() {
  return (
    <section id="calidad" className="section-y">
      <div className="container-site">
        {/* one text block (title + one subtitle) sitting right on top of the data card, same left edge */}
        <h2 className="reveal max-w-[22ch] break-words font-display text-h1 font-semibold text-text-primary">
          Software crítico exige <span className="text-inspire-blue">un estándar que no se negocia.</span>
        </h2>
        <p className="reveal mt-4 max-w-[60ch] text-lead text-text-secondary" style={{ ["--i" as string]: 1 }}>
          Lo aplicamos en cada solución, sin importar su tamaño.
          <span className="block">Nada llega a producción sin cumplirlo.</span>
        </p>

        <QualityGate thresholds={THRESHOLDS} />
      </div>
    </section>
  );
}

// Exported from the brand file "Badges elaniin 2.0.ai" (Nov 10 2026), one SVG per badge, untouched.
type Badge = { file: string; alt: string; w: number; h: number };
const GCP: Badge[] = [
  { file: "gcp-services-select", alt: "Google Cloud Select, Services Partner", w: 546, h: 373 },
  { file: "gcp-cosell-select", alt: "Google Cloud Select, Co-sell Partner", w: 552, h: 377 },
  { file: "gws-cosell-services-select", alt: "Google Workspace Select, Co-sell & Services Partner", w: 553, h: 377 },
  { file: "badge-clutch-aws", alt: "AWS Partner, Premier Tier Services", w: 377, h: 377 },
];
const CLUTCH: Badge[] = [
  { file: "badge-clutch-top-software-developers", alt: "Clutch Top Software Developers, El Salvador 2024", w: 388, h: 431 },
  { file: "badge-clutch-top-staff", alt: "Clutch Top Staff Augmentation Company, El Salvador 2024", w: 388, h: 430 },
];

/* Each fact sits on top of the badges that prove it (team, Nov 10 2026). Figures from Georgina; do not reword without the team.
   "Partner de Google Cloud y AWS" is what the badges themselves say. */
const FACTS: { value: string; label: string; badges: Badge[]; span: string; seal?: boolean }[] = [
  { value: "12 años", label: "en la industria", badges: [], span: "lg:col-span-3", seal: true },
  { value: "Top 1,000", label: "empresas globales en Clutch", badges: CLUTCH, span: "lg:col-span-3" },
  { value: "Equipo certificado", label: "Partner de Google Cloud y AWS", badges: GCP, span: "md:col-span-2 lg:col-span-6" },
];

/* Own seal under "12 años" (2014 to 2026), drawn inline so it uses the page fonts.
   Same build as the Google badges next to it (white card, colored band at the bottom). It adds, not repeats:
   the start year, one tick per year (the last in Inspire Blue) and the +500 projects from the hero proof.
   Icon: lucide Award (already a dependency). Refs: Braun dial ticks and a habit-streak dot row, Pinterest board, Nov 10 2026. */
function YearsBadge() {
  const ticks = Array.from({ length: 12 }, (_, i) => 108 + i * 30.5);
  return (
    <svg viewBox="0 0 552 377" role="img" aria-label="Desde 2014, más de 500 proyectos en producción" className="h-full w-auto">
      <rect x="1.5" y="1.5" width="549" height="374" rx="12" fill="#FFFFFF" stroke="#4E4C4C" strokeWidth="3" />
      <circle cx="276" cy="72" r="40" fill="#EDF1FF" />
      <Award x="248" y="44" width="56" height="56" color="#023BFD" strokeWidth={1.75} aria-hidden="true" />
      <text x="276" y="186" textAnchor="middle" className="font-display" fontSize="64" fontWeight="600" letterSpacing="-1.5" fill="#0C0C0C">Desde 2014</text>
      {ticks.map((x, i) => (
        <rect key={x} x={x} y={i === 11 ? 214 : 220} width="8" height={i === 11 ? 32 : 20} rx="4" fill={i === 11 ? "#023BFD" : "#99B0FE"} />
      ))}
      <text x="108" y="280" className="font-mono" fontSize="20" fill="#4E4C4C">2014</text>
      <text x="449" y="280" textAnchor="end" className="font-mono" fontSize="20" fill="#4E4C4C">2026</text>
      <path d="M1.5 313h549v50.5a12 12 0 0 1-12 12h-525a12 12 0 0 1-12-12z" fill="#023BFD" />
      <text x="276" y="354" textAnchor="middle" className="font-display" fontSize="26" fontWeight="500" fill="#FFFFFF">+500 proyectos en producción</text>
    </svg>
  );
}

function Backing() {
  return (
    <section id="respaldo" className="section-y-compact border-t border-border-default">
      <div className="container-site">
        <h2 className="reveal font-display text-h3 font-semibold text-text-primary">Respaldo verificable.</h2>
        <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-12">
          {FACTS.map((f, i) => (
            <li key={f.value} className={`reveal min-w-0 ${f.span}`} style={{ ["--i" as string]: i }}>
              <p className="font-display text-h3 font-semibold leading-tight text-text-primary">{f.value}</p>
              <p className="mt-1 text-body-sm text-text-secondary">{f.label}</p>
              {f.seal && (
                <div className="mt-5 flex h-12 items-center sm:h-16 md:h-20">
                  <YearsBadge />
                </div>
              )}
              {f.badges.length > 0 && (
                <ul className="mt-5 flex flex-wrap items-center gap-3 md:gap-4">
                  {f.badges.map((b) => (
                    <li key={b.file} className="flex h-12 items-center sm:h-16 md:h-20">
                      <Image src={asset(`/certifications/${b.file}.svg`)} alt={b.alt} width={Math.round((80 * b.w) / b.h)} height={80} unoptimized className="h-full w-auto" />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Contact({ v }: { v: Variant }) {
  return (
    <section id="contacto" className="section-y bg-surface-subtle">
      {/* The form takes the wider column so its fields and its two options sit side by side and the card stays short. */}
      <div className="container-site grid-page items-stretch">
        <div className="col-span-12 flex min-w-0 flex-col justify-between gap-10 lg:col-span-5">
          <div>
            <h2 className="reveal max-w-[16ch] break-words font-display text-h1 font-semibold text-text-primary">Cuéntanos qué necesitas ejecutar.</h2>
            <p className="reveal measure-lead mt-5 text-lead text-text-secondary" style={{ ["--i" as string]: 1 }}>
              Un especialista te contactará para conocer tu proyecto en una primera conversación.
            </p>
          </div>
        </div>
        <div className="reveal col-span-12 min-w-0 lg:col-span-7" style={{ ["--i" as string]: 2 }}>
          {/* the aura ring sits 2px outside the card, so its corners get radius + 2px to stay concentric */}
          <div className="aura rounded-card before:rounded-[14px] border border-border-default bg-surface-card pad-card shadow-card-rest">
            <LeadForm variante={v.id} />
          </div>
        </div>
      </div>
    </section>
  );
}

const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/elaniin", path: LINKEDIN_PATH },
  { label: "Clutch", href: "https://clutch.co/profile/elaniin", logo: "/certifications/clutch.svg", w: 88, h: 25 },
] as const;

function Footer() {
  const link = "nav-link relative rounded-button before:absolute before:-inset-x-2 before:-inset-y-3 before:content-[''] text-body-sm text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark";
  return (
    <footer className="bg-elaniin-black text-white">
      <div className="container-site py-16">
        <div className="grid-page items-end border-b border-border-on-dark pb-12">
          <div className="col-span-12 min-w-0 md:col-span-6">
            <Logo tone="light" />
            <p className="mt-4 text-body-sm text-text-on-dark-secondary">Intelligent Software Company</p>
            <ul className="mt-6 flex gap-3" aria-label="Redes y reseñas">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-11 min-w-11 place-items-center rounded-button border border-border-on-dark text-text-on-dark-secondary transition-colors duration-base hover:bg-white/8 hover:text-white focus-ring-on-dark"
                  >
                    {"path" in s ? (
                      <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
                        <path d={s.path} />
                      </svg>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="mx-4 block h-4 bg-current"
                        style={{ width: (s.w / s.h) * 16, maskImage: `url(${asset(s.logo)})`, WebkitMaskImage: `url(${asset(s.logo)})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <ul className="col-span-12 flex min-w-0 flex-wrap gap-x-8 gap-y-3 md:col-span-6 md:justify-end">
            <li>
              <a href="mailto:hello@elaniin.com" className={link}>hello@elaniin.com</a>
            </li>
            <li>
              <PrivacyLink className={link}>Política de privacidad</PrivacyLink>
            </li>
          </ul>
        </div>
        <p className="mono-label mt-8 text-caption text-text-on-dark-muted">© 2026 Elaniin</p>
      </div>
    </footer>
  );
}
