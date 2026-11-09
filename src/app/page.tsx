import { Nav } from "@/components/nav";
import { Sectors } from "@/components/sector-card";
import { Certifications, Clients, Experience, FinalCta, Footer, Hero, Services } from "@/components/sections";
import { Method } from "@/components/method";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Clients />
        <Services />
        <Sectors />
        <Method />
        <Experience />
        <Certifications />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
