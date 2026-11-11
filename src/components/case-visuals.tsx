/* Shared look of the case cards: the logo, the color themes and the moving glints. */
import Image from "next/image";
import type { CaseStudy } from "@/data/cases";
import { asset } from "@/lib/site";

export function Logo({
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
