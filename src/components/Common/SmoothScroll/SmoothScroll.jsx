"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

function getHashTarget(href) {
  if (!href || !href.includes("#")) return null;
  const hash = href.split("#")[1];
  return hash ? `#${hash}` : null;
}

function getHeaderOffset() {
  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--header-height")
    .trim();

  const parsed = Number.parseFloat(value);
  const headerHeight = Number.isFinite(parsed) ? parsed : 72;
  return -(headerHeight + 12);
}

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refreshTimeout = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    const handleAnchorClick = (event) => {
      const link = event.target.closest("a[href*='#']");
      if (!link) return;

      const target = getHashTarget(link.getAttribute("href"));
      if (!target) return;

      const element = document.querySelector(target);
      if (!element) return;

      event.preventDefault();
      lenis.scrollTo(element, { offset: getHeaderOffset(), duration: 1.4 });
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      window.clearTimeout(refreshTimeout);
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return children;
}
