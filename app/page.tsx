import DynamicTitle from "@/components/common/DynamicTitle";
import Navbar from "@/components/common/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import About from "@/components/sections/About";
import Team from "@/components/sections/Teams";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <DynamicTitle />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Work />
        <About />
        <Team />
        <Contact />
        <Footer />
      </main>
    </>
  );
}