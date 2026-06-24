import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

export default function SplitReveal({ as: Tag = "h2", className, children, start = "top 90%", end = "top center" }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
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
            scrollTrigger: { trigger: el, start, end, scrub: true },
          });
        },
      });
      return () => split.revert();
    });
    return () => mm.revert();
  }, []);
  return <Tag ref={ref} className={className}>{children}</Tag>;
}
