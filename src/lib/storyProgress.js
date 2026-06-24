import { ScrollTrigger } from "gsap/ScrollTrigger";

export const story = { progress: 0 };

export function trackStory(triggerEl) {
  ScrollTrigger.create({
    trigger: triggerEl,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      story.progress = self.progress;
    },
  });
}
