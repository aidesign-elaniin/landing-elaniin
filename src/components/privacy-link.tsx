"use client";

import Link from "next/link";

/* Opens the privacy policy modal (mounted once by <CookieConsent />). It is a real link to /privacidad, so crawlers and
   "open in new tab" still reach the full page; a plain click opens the modal instead. */
export const OPEN_PRIVACY_EVENT = "open-privacy";

export function PrivacyLink({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Link
      href="/privacidad"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        window.dispatchEvent(new Event(OPEN_PRIVACY_EVENT));
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
