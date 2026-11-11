import { Logo } from "@/components/logo";

/* Site root: only the brand on Elevate Blue (the button color). Each landing lives at its own slug (/software, /cloud). */
export default function Home() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center bg-elevate-blue px-6">
      <h1>
        <Logo tone="light" className="h-10 w-auto md:h-14" />
      </h1>
    </main>
  );
}
