"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Ensure GSAP plugins are registered safely on the client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);
}

/**
 * Utility function for buttery smooth GSAP scrolling to any element or selector
 */
export const smoothScrollTo = (target: string | HTMLElement, offsetY: number = 80) => {
  if (typeof window === "undefined") return;

  const element = typeof target === "string" ? document.querySelector(target) : target;
  if (!element) return;

  gsap.to(window, {
    duration: 0.65,
    scrollTo: {
      y: element,
      offsetY: offsetY,
      autoKill: true,
    },
    ease: "power2.out",
  });
};

export { gsap, useGSAP, ScrollTrigger, ScrollToPlugin };
export default gsap;

