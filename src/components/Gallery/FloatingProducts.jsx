"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import styles from "./FloatingProducts.module.css";

const SIZE_CLASS = {
  hero: styles.sizeHero,
  medium: styles.sizeMedium,
  small: styles.sizeSmall,
  accent: styles.sizeAccent,
  solo: styles.sizeSolo,
};

export default function FloatingProducts({ items = [], label = "" }) {
  const stageRef = useRef(null);
  const isSolo = items.length === 1 && items[0]?.size === "solo";

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let ctx;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const products = stage.querySelectorAll("[data-product]");
        const floaters = stage.querySelectorAll("[data-float]");

        gsap.from(products, {
          opacity: 0,
          x: isSolo ? 48 : 90,
          y: isSolo ? 0 : 36,
          scale: 0.96,
          duration: 1.1,
          stagger: 0.14,
          ease: "power4.out",
          scrollTrigger: {
            trigger: stage.closest("[data-gallery-row]") || stage,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        });

        // Gentle scroll-linked drift (adds premium life without distraction)
        gsap.to(stage, {
          y: isSolo ? -6 : -10,
          ease: "none",
          scrollTrigger: {
            trigger: stage.closest("[data-gallery-row]") || stage,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        floaters.forEach((el, index) => {
          const floatY = isSolo ? -8 : index % 2 === 0 ? -16 : 16;
          const floatRotate = isSolo ? -1 : index % 2 === 0 ? -2 : 2;
          const duration = 7.2 + index * 0.75;

          gsap.to(el, {
            y: floatY,
            rotate: `+=${floatRotate}`,
            duration,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: Number(el.dataset.floatDelay || 0),
          });
        });
      }, stage);
    };

    init();

    return () => ctx?.revert();
  }, [items, isSolo]);

  if (!items.length) return null;

  return (
    <div
      ref={stageRef}
      className={`${styles.stage} ${isSolo ? styles.stageSolo : ""}`}
      aria-label={label}
      role="img"
    >
      <div className={styles.stageGlow} aria-hidden="true" />
      {items.map((item) => (
        <div
          key={item.id}
          data-product
          className={`${styles.product} ${SIZE_CLASS[item.size] || styles.sizeMedium}`}
          style={
            isSolo
              ? {
                  zIndex: item.zIndex,
                  "--product-rotate": `${item.rotate}deg`,
                }
              : {
                  top: item.top,
                  left: item.left,
                  zIndex: item.zIndex,
                  "--product-rotate": `${item.rotate}deg`,
                }
          }
        >
          <div
            className={styles.productInner}
            data-float
            data-float-delay={item.floatDelay}
          >
            <Image
              src={item.src}
              alt=""
              width={item.width}
              height={item.height}
              className={`${styles.productImage} ${item.blend === "cutout" ? styles.productCutout : ""}`}
              sizes="(max-width: 768px) 42vw, 22vw"
              loading="lazy"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
