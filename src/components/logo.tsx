import { asset } from "@/lib/site";

/* Official primary logo from the Elaniin brand kit, embedded untouched (colors and proportions are never altered). */
export function Logo({ tone = "dark", className = "h-5 w-auto sm:h-6" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- ponytail: static SVG, nothing for next/image to optimize
    <img
      src={asset(tone === "light" ? "/brand/elaniin-white.svg" : "/brand/elaniin-full-color.svg")}
      alt="Elaniin Tech Company"
      width={428}
      height={64}
      className={className}
    />
  );
}
