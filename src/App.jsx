import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initSmoothScroll } from "./lib/smoothScroll";
import { trackStory } from "./lib/storyProgress";

import GrainOverlay from "./components/layout/GrainOverlay";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import JarLayer from "./components/three/JarLayer";

import Hero from "./components/sections/Hero";
import AngleOfFlavor from "./components/sections/AngleOfFlavor";
import UnwrapAdventure from "./components/sections/UnwrapAdventure";
import PerspectiveOnTaste from "./components/sections/PerspectiveOnTaste";
import WhatsInside from "./components/sections/WhatsInside";
import NoFillers from "./components/sections/NoFillers";
import Tradition from "./components/sections/Tradition";
import WhyTheJar from "./components/sections/WhyTheJar";
import FullCTA from "./components/sections/FullCTA";
import Recipes from "./components/sections/Recipes";
import Newsletter from "./components/sections/Newsletter";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const storyRef = useRef(null);

  useEffect(() => {
    const lenis = initSmoothScroll();
    if (storyRef.current) trackStory(storyRef.current);

    return () => {
      lenis?.destroy?.();
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <>
      <GrainOverlay />
      <Header />
      <JarLayer />

      {/* Story wrapper — drives jar scroll animation */}
      <div ref={storyRef} style={{ position: "relative", zIndex: 2 }}>
        <Hero />
        <AngleOfFlavor />
        <UnwrapAdventure />
        <PerspectiveOnTaste />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <WhatsInside />
        <NoFillers />
        <Tradition />
        <WhyTheJar />
        <FullCTA />
        <Recipes />
        <Newsletter />
        <Footer />
      </div>
    </>
  );
}
