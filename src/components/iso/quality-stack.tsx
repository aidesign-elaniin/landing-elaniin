"use client";

import { Fragment, useId } from "react";
import { Activity, BadgeCheck, Blocks, Gauge, Shield, TestTube2, Wrench, type LucideIcon } from "lucide-react";
import { COS30, clamp01, easeInOut, pointAt, pointsAttr, project, planeTransform } from "./iso";
import { Slab, type SlabBox, topFace } from "./slab";
import { useClock } from "./use-clock";

/*
  Software Nivel A (isometric resource, references/isometric.md): the seven levels (six evaluation dimensions plus the verdict) as glass slabs on one
  base plate. A pulse of light travels the trace, climbs the riser and, at each level, feeds the arm of one dimension:
  that slab slides forward, lights its top edge and stays lit (it passed). When all are lit the finished state
  holds, then the loop restarts. One 12 s clock, only on screen; reduced motion rests on the assembled, all-lit state.
  Decorative (aria-hidden): the card text carries the meaning.
*/
const VB = { x: 100, y: 30, w: 630, h: 510 };
const VIEWBOX = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;
const O = { x: 400, y: 250 };
const D = 190;
const STEP = 42; // each slab is this much narrower than the one below, leaving a strip of its top face visible
const PITCH = 28; // z distance between slabs
const SLAB_H = 20;

const PLATE: SlabBox = { x: -90, y: -30, z: 0, w: 430, d: 250, h: 12 };
const RISER: SlabBox = { x: -68, y: 182, z: 12, w: 16, d: 16, h: 7 * PITCH + 4 };
const RISER_X = RISER.x + RISER.w;
const RISER_Y = RISER.y + RISER.d / 2;

const DIMENSIONS: { icon: LucideIcon }[] = [
  { icon: Shield }, // seguridad
  { icon: Activity }, // fiabilidad
  { icon: Wrench }, // mantenibilidad
  { icon: TestTube2 }, // cobertura
  { icon: Blocks }, // arquitectura
  { icon: Gauge }, // madurez
  { icon: BadgeCheck }, // veredicto: Nivel A
];

const N = DIMENSIONS.length;
const STATIONS = DIMENSIONS.map((d, i) => {
  const w = 28 + (N - i) * STEP; // widest at the bottom, the verdict slab on top is the narrowest
  const upper = i === N - 1 ? 0 : w - STEP;
  return {
    icon: d.icon,
    box: { x: 0, y: 0, z: 12 + i * PITCH, w, d: D, h: SLAB_H } as SlabBox,
    tile: { x: (w + upper) / 2, y: D / 2 },
  };
});
const levelOf = (s: (typeof STATIONS)[number]) => s.box.z + s.box.h / 2;

const T = { trace: 800, traceDur: 900, rise: 520, branch: 620, up: 500, hold: 500, down: 500, fade: 11000 };
const SLIDE = 24;
const DIM = 0.4;

const TIMES = (() => {
  let r = T.trace + T.traceDur;
  return STATIONS.map(() => {
    const row = { R: r, B: r + T.rise, A: r + T.rise + T.branch };
    r = row.B;
    return row;
  });
})();

const TRACE_POINTS = [
  { x: PLATE.x + PLATE.w, y: PLATE.y + PLATE.d - 12, z: PLATE.h },
  { x: RISER_X, y: PLATE.y + PLATE.d - 12, z: PLATE.h },
  { x: RISER_X, y: RISER_Y, z: PLATE.h },
];
const TRACE_SCREEN = TRACE_POINTS.map((p) => project(p, O));

const envelope = (t: number, a: number) => {
  const s = t - a;
  if (s <= 0) return 0;
  if (s < T.up) return easeInOut(s / T.up);
  if (s < T.up + T.hold) return 1;
  if (s < T.up + T.hold + T.down) return 1 - easeInOut((s - T.up - T.hold) / T.down);
  return 0;
};

/* a slab that has received the pulse stays lit until the loop fades out */
const passed = (t: number, a: number) => (t < a ? 0 : t < T.fade ? clamp01((t - a) / 300) : clamp01(1 - (t - T.fade) / 700));

export function QualityStack() {
  const { ref, t } = useClock(12000);
  const glowId = useId();

  const envs = TIMES.map((row) => envelope(t, row.A));
  const emphasis = Math.max(...envs);
  const layer = "absolute inset-0 block h-full w-full";

  return (
    <div ref={ref} aria-hidden="true" className="relative w-full">
      {/* sizing layer: gives the box its proportion */}
      <svg viewBox={VIEWBOX} className="block h-auto w-full" focusable="false" />

      <div className="iso-levitate absolute inset-0">
        <svg viewBox={VIEWBOX} className={layer} focusable="false">
          <defs>
            <filter id={`${glowId}-halo`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation={3} />
            </filter>
          </defs>

          <g className="rise" style={{ "--i": 0 } as React.CSSProperties}>
            <Slab look="plate" box={PLATE} o={O} />
            <Slab look="plate" box={RISER} o={O} />
          </g>

          <g className="rise" style={{ "--i": 2 } as React.CSSProperties}>
            <polyline
              points={TRACE_SCREEN.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
              style={{ fill: "none", stroke: "var(--color-excellence-blue)", strokeOpacity: 0.4, strokeWidth: 1, strokeLinejoin: "round" }}
            />
            <Arms t={t} envs={envs} />
            <Pulses t={t} haloId={`${glowId}-halo`} />
          </g>
        </svg>

        {STATIONS.map((station, i) => {
          const env = envs[i];
          const lit = Math.max(env, passed(t, TIMES[i].A));
          const off = SLIDE * env;
          const opacity = 1 - DIM * emphasis * (1 - env);
          return (
            <Fragment key={i}>
              <Frost box={station.box} off={off} opacity={opacity} index={i} />
              <svg viewBox={VIEWBOX} className={layer} focusable="false">
                <g className="rise" style={{ "--i": 2 + i } as React.CSSProperties}>
                  <g transform={`translate(${(off * COS30).toFixed(2)} ${(off * 0.5).toFixed(2)})`} style={{ opacity }}>
                    <Slab look="software" box={station.box} o={O} />
                    <Tile station={station} index={i} />
                    {lit > 0 && (
                      <polygon
                        points={pointsAttr(topFace(station.box), O)}
                        style={{ fill: "none", stroke: "var(--color-elevate-blue)", strokeWidth: 2, strokeLinejoin: "round", opacity: lit }}
                      />
                    )}
                  </g>
                </g>
              </svg>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

const FROST_BLUR = 14;
const pct = (p: { x: number; y: number }) => `${(((p.x - VB.x) / VB.w) * 100).toFixed(2)}% ${(((p.y - VB.y) / VB.h) * 100).toFixed(2)}%`;

function Frost({ box, off, opacity, index }: { box: SlabBox; off: number; opacity: number; index: number }) {
  const { x, y, z, w, d, h } = box;
  const silhouette = [
    { x, y, z: z + h },
    { x: x + w, y, z: z + h },
    { x: x + w, y, z },
    { x: x + w, y: y + d, z },
    { x, y: y + d, z },
    { x, y: y + d, z: z + h },
  ].map((p) => pct(project(p, O)));
  const blur = `blur(${FROST_BLUR}px)`;
  return (
    <div className="rise pointer-events-none absolute inset-0" style={{ "--i": 2 + index } as React.CSSProperties}>
      <div
        className="absolute inset-0"
        style={{
          clipPath: `polygon(${silhouette.join(", ")})`,
          backdropFilter: blur,
          WebkitBackdropFilter: blur,
          transform: `translate(${(((off * COS30) / VB.w) * 100).toFixed(3)}%, ${(((off * 0.5) / VB.h) * 100).toFixed(3)}%)`,
          opacity,
        }}
      />
    </div>
  );
}

/* A small white tile with the dimension icon, lying on the visible strip of the top face. */
const TILE = 24;

function Tile({ station, index }: { station: (typeof STATIONS)[number]; index: number }) {
  const { box, icon: Icon } = station;
  const plane = `${planeTransform(O, box.z + box.h)} matrix(0 -1 1 0 ${station.tile.x - TILE / 2} ${station.tile.y + TILE / 2})`;
  return (
    <g>
      <g transform={plane} style={{ fill: "var(--color-blue-300)", opacity: 0.35 }}>
        <rect x={0} y={0} width={TILE} height={TILE} rx={6} />
      </g>
      <g className="iso-float" style={{ "--d": index % 3 } as React.CSSProperties}>
        <g transform={plane}>
          <rect
            x={0}
            y={0}
            width={TILE}
            height={TILE}
            rx={6}
            style={{ fill: "var(--color-white)", stroke: "var(--color-excellence-blue)", strokeWidth: 1, strokeOpacity: 0.9 }}
          />
          <Icon x={4} y={4} width={16} height={16} strokeWidth={1.5} style={{ color: "var(--color-elevate-blue)" }} />
        </g>
      </g>
    </g>
  );
}

function Arms({ t, envs }: { t: number; envs: number[] }) {
  return (
    <g>
      {STATIONS.map((station, i) => {
        const level = levelOf(station);
        const row = TIMES[i];
        const from = project({ x: RISER_X, y: RISER_Y, z: level }, O);
        const to = project({ x: SLIDE * envs[i], y: RISER_Y, z: level }, O);

        const travelling = t >= row.B && t < row.A;
        const progress = easeInOut(clamp01((t - row.B) / T.branch));
        const head = project({ x: RISER_X + (SLIDE * envs[i] - RISER_X) * progress, y: RISER_Y, z: level }, O);
        const trailOpacity = travelling ? 1 : t >= row.A ? clamp01(1 - (t - row.A) / 700) : 0;

        return (
          <g key={i}>
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} style={{ stroke: "var(--color-excellence-blue)", strokeOpacity: 0.5, strokeWidth: 1 }} />
            {trailOpacity > 0 && (
              <line
                x1={from.x}
                y1={from.y}
                x2={travelling ? head.x : to.x}
                y2={travelling ? head.y : to.y}
                style={{ stroke: "var(--color-elevate-blue)", strokeWidth: 2, strokeLinecap: "round", opacity: trailOpacity }}
              />
            )}
            <circle cx={to.x} cy={to.y} r={3} style={{ fill: "var(--color-white)", stroke: "var(--color-elevate-blue)", strokeWidth: 1.5 }} />
          </g>
        );
      })}
    </g>
  );
}

function Pulses({ t, haloId }: { t: number; haloId: string }) {
  const pulses: { x: number; y: number; opacity: number; key: string }[] = [];

  const traceEnd = T.trace + T.traceDur;
  if (t >= T.trace && t < traceEnd) {
    const p = pointAt(TRACE_SCREEN, easeInOut((t - T.trace) / T.traceDur));
    pulses.push({ ...p, opacity: clamp01((t - T.trace) / 150), key: "trace" });
  }

  const last = TIMES[TIMES.length - 1];
  if (t >= traceEnd && t < last.B + 200) {
    let z = PLATE.h;
    let from = z;
    TIMES.forEach((row, i) => {
      const level = levelOf(STATIONS[i]);
      if (t >= row.R && t < row.B) z = from + (level - from) * easeInOut((t - row.R) / T.rise);
      else if (t >= row.B) z = level;
      from = level;
    });
    const p = project({ x: RISER_X, y: RISER_Y, z }, O);
    pulses.push({ ...p, opacity: t < last.B ? 1 : clamp01(1 - (t - last.B) / 200), key: "riser" });
  }

  TIMES.forEach((row, i) => {
    if (t >= row.B && t < row.A) {
      const level = levelOf(STATIONS[i]);
      const k = easeInOut((t - row.B) / T.branch);
      const p = project({ x: RISER_X + (0 - RISER_X) * k, y: RISER_Y, z: level }, O);
      pulses.push({ ...p, opacity: 1, key: `arm-${i}` });
    }
  });

  return (
    <g>
      {pulses.map((p) => (
        <g key={p.key} style={{ opacity: p.opacity }}>
          <circle cx={p.x} cy={p.y} r={11} filter={`url(#${haloId})`} style={{ fill: "var(--color-blue-400)", opacity: 0.5 }} />
          <circle cx={p.x} cy={p.y} r={4} style={{ fill: "var(--color-elevate-blue)" }} />
          <circle cx={p.x} cy={p.y} r={1.5} style={{ fill: "var(--color-white)" }} />
        </g>
      ))}
    </g>
  );
}
