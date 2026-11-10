import { privacy, privacyUpdated } from "@/data/privacy";

const MAIL = "legal@elaniin.com";

function Text({ children }: { children: string }) {
  const [before, after] = children.split(MAIL);
  if (after === undefined) return <>{children}</>;
  return (
    <>
      {before}
      <a href={`mailto:${MAIL}`} className="text-text-link underline underline-offset-4 focus-ring">
        {MAIL}
      </a>
      {after}
    </>
  );
}

/* Content of the policy, shared by the consent modal and the /privacidad page. The legal text is in Spanish (data/privacy.ts). */
export function PolicyContent({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  const Sub = `h${headingLevel + 1}` as "h3" | "h4";
  return (
    <div className="space-y-10">
      {privacy.map((section) => (
        <section key={section.title}>
          <H className="font-display text-h4 font-medium text-text-primary">{section.title}</H>
          <div className="mt-4 space-y-4">
            {section.blocks.map((b) =>
              b.startsWith("### ") ? (
                <Sub key={b} className="pt-2 font-display text-body font-medium text-text-primary">
                  {b.slice(4)}
                </Sub>
              ) : (
                <p key={b} className="text-body text-text-secondary">
                  <Text>{b}</Text>
                </p>
              ),
            )}
          </div>
        </section>
      ))}
      <p className="mono-label text-micro text-text-muted">Esta Política de Privacidad se revisó por última vez el {privacyUpdated}.</p>
    </div>
  );
}
