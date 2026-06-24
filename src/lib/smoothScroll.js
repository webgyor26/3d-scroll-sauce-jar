import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

let lenis;

export function initSmoothScroll() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    autoRaf: false,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export const getLenis = () => lenis;

export function wordReveal(el) {
  if (!el) return;
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const split = SplitText.create(el, {
      type: "words",
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.words, {
          opacity: 0.15,
          duration: 0.2,
          ease: "power1.out",
          stagger: { each: 0.4 },
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: "top center",
            scrub: true,
          },
        });
      },
    });
    return () => split.revert();
  });
  return () => mm.revert();
}
