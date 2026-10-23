"use client";

import { useEffect } from "react";
import { smoothScrollTo } from "@/lib/gsap";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Intercept all internal anchor link clicks for smooth GSAP scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        window.history.pushState(null, "", href);
        smoothScrollTo(href, 80);
      }
    };

    // Handle initial hash in URL on page mount
    if (window.location.hash) {
      const hash = window.location.hash;
      const initialElement = document.querySelector(hash);
      if (initialElement) {
        setTimeout(() => {
          smoothScrollTo(hash, 80);
        }, 200);
      }
    }

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return <>{children}</>;
}
