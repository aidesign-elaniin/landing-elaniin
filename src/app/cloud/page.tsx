import { Landing } from "@/components/sections";
import { landingMetadata } from "@/lib/landing";
import { cloud } from "./content";

export const metadata = landingMetadata(cloud);

export default function Page() {
  return <Landing v={cloud} />;
}
