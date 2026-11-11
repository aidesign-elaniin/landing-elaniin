import { Landing } from "@/components/sections";
import { HOME_ID, variants } from "@/data/variants";

export default function Home() {
  return <Landing v={variants[HOME_ID]} />;
}
