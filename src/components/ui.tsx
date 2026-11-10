import { ArrowRight } from "lucide-react";

export function ArrowIcon() {
  return <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />;
}

const base =
  "btn-arrow inline-flex items-center justify-center gap-2 rounded-button bg-elevate-blue font-display font-medium text-white transition-colors duration-base hover:bg-blue-700 active:bg-blue-800 focus-ring";

export function ButtonLink({ href, children, size = "md", className = "" }: { href: string; children: React.ReactNode; size?: "md" | "lg"; className?: string }) {
  const s = size === "lg" ? "h-12 px-6 text-button-lg" : "h-11 px-4 text-button";
  return (
    <a href={href} className={`${base} ${s} ${className}`}>
      {children}
      <ArrowIcon />
    </a>
  );
}
