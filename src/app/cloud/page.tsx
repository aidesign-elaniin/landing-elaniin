import type { Metadata } from "next";
import { Landing } from "@/components/sections";
import { variants } from "@/data/variants";

const v = variants.cloud;
const title = "Migración, modernización y operación cloud";

export const metadata: Metadata = {
  title,
  description: v.hero.subtitle,
  alternates: { canonical: v.path },
  openGraph: { title, description: v.hero.subtitle, url: v.path },
};

export default function Cloud() {
  return <Landing v={v} />;
}
