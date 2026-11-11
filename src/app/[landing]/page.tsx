import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Landing } from "@/components/sections";
import { HOME_ID, pathOf, variants } from "@/data/variants";

/* Every landing except the home one (src/app/page.tsx) is built from its file in data/variants. */
type Props = { params: Promise<{ landing: string }> };

const find = (id: string) => (id !== HOME_ID && Object.hasOwn(variants, id) ? variants[id] : undefined);

export function generateStaticParams() {
  return Object.keys(variants).filter((id) => id !== HOME_ID).map((landing) => ({ landing }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const v = find((await params).landing);
  if (!v) return {};
  const title = v.title ?? `${v.hero.h1} ${v.hero.accent}`;
  const url = pathOf(v.id);
  return { title, description: v.hero.subtitle, alternates: { canonical: url }, openGraph: { title, description: v.hero.subtitle, url } };
}

export default async function LandingPage({ params }: Props) {
  const v = find((await params).landing);
  if (!v) notFound();
  return <Landing v={v} />;
}
