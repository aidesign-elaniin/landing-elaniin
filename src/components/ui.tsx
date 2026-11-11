import { ArrowRight } from "lucide-react";

export function ArrowIcon() {
  return <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />;
}

const base =
  "btn-arrow inline-flex items-center justify-center gap-2 rounded-button bg-elevate-blue font-display font-medium text-white transition-colors duration-base hover:bg-blue-700 active:bg-blue-800 focus-ring";

export function ButtonLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={`${base} h-12 px-6 text-button-lg ${className}`}>
      {children}
      <ArrowIcon />
    </a>
  );
}
