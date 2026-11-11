import { Landing } from "@/components/sections";
import { landingMetadata } from "@/lib/landing";
import { software } from "./content";

export const metadata = landingMetadata(software);

export default function Page() {
  return <Landing v={software} />;
}
