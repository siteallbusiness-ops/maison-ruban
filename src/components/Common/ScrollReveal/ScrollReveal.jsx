"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ScrollReveal.module.css";

gsap.registerPlugin(ScrollTrigger);

const FROM_OFFSETS = {
  left: { x: -72, y: 0 },
  right: { x: 72, y: 0 },
  bottom: { x: 0, y: 48 },
};

const EFFECTS = {
  fade: {
    blur: 6,
    scale: 1,
    rotate: 0,
    opacity: 0,
  },
  lift: {
    blur: 5,
    scale: 0.98,
    rotate: 0,
    opacity: 0,
  },
  drift: {
    blur: 5,
    scale: 0.985,
    rotate: -0.6,
    opacity: 0,
  },
};

export default function ScrollReveal({
  children,
  from = "left",
  effect = "fade",
  className = "",
  as: Tag = "div",
  delay = 0,
  style,
  id,
  animateOnMount = false,
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.set(element, { clearProps: "all", opacity: 1 });
      return;
    }

    const offset = FROM_OFFSETS[from] || FROM_OFFSETS.left;
    const config = EFFECTS[effect] || EFFECTS.fade;

    gsap.set(element, {
      opacity: config.opacity,
      x: offset.x,
      y: offset.y,
      scale: config.scale,
      rotate: config.rotate,
      filter: `blur(${config.blur}px)`,
    });

    const animation = gsap.to(element, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      duration: 0.75,
      delay: delay / 1000,
      ease: "power3.out",
      scrollTrigger: animateOnMount
        ? undefined
        : {
            trigger: element,
            start: "top 92%",
            end: "top 50%",
            toggleActions: "play none none none",
            once: true,
          },
    });

    if (animateOnMount) {
      animation.play();
    }

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [animateOnMount, delay, effect, from]);

  const classNames = [styles.panel, className].filter(Boolean).join(" ");

  return (
    <Tag ref={ref} id={id} className={classNames} style={style}>
      {children}
    </Tag>
  );
}
