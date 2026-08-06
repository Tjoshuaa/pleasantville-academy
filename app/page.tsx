import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Programs from "@/components/Programs";
import Facilities from "@/components/Facilities";
import Gallery from "@/components/Gallery";
import Admissions from "@/components/Admissions";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhyChoose from "@/components/WhyChoose";
import VisionMission from "@/components/VisionMission";


export default function Home() {

  return (

    <main>

      <Navbar />

      <Hero />

      <About />

      <WhyChoose />

      <VisionMission />

      <Programs />

      <Facilities />

      <Gallery />

      <Admissions />

      <Contact />

      <Footer />

    </main>

  );

}