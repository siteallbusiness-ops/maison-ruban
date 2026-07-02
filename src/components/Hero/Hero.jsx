"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/Common/Container/Container";
import { HERO_HIGHLIGHTS } from "@/constants/hero";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const copyRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    if (!section || !copy) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const items = copy.querySelectorAll("[data-hero-animate]");
      const grid = section.querySelector(`.${styles.heroGridLines}`);
      const eyebrowLine = section.querySelector(`.${styles.heroEyebrowLine}`);
      const divider = section.querySelector(`.${styles.heroDivider}`);
      const cards = section.querySelectorAll(`.${styles.heroFeature}`);

      if (eyebrowLine) gsap.set(eyebrowLine, { transformOrigin: "left center", scaleX: 0.65 });
      if (divider) gsap.set(divider, { transformOrigin: "left center", scaleX: 0.6, opacity: 0.7 });

      gsap.from(items, {
        opacity: 0,
        y: 24,
        duration: 0.55,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.05,
      });

      if (eyebrowLine) {
        gsap.to(eyebrowLine, { scaleX: 1, duration: 0.6, ease: "power3.out", delay: 0.1 });
      }

      if (divider) {
        gsap.to(divider, { scaleX: 1, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.12 });
      }

      if (cards.length) {
        gsap.from(cards, {
          opacity: 0,
          y: 16,
          rotate: -0.4,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.18,
        });
      }

      if (grid) {
        gsap.to(grid, {
          y: -28,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={styles.hero}
      aria-labelledby="hero-heading"
    >
      <div className={styles.heroBackdrop} aria-hidden="true">
        <div className={styles.heroGridLines} />
      </div>

      <Container>
        <div ref={copyRef} className={styles.heroInner}>
          <p className={styles.heroEyebrow} data-hero-animate>
            <span className={styles.heroEyebrowLine} aria-hidden="true" />
            Shabby-chic &amp; butter-forward
          </p>

          <h1 className={styles.heroTitle} id="hero-heading" data-hero-animate>
            Cakes, jars, and crumbs
            <em className={styles.heroTitleEm}> that feel like Sunday morning.</em>
          </h1>

          <p className={styles.heroLead} data-hero-animate>
            A dessert-first patisserie with painted wood, soft light, and recipes rooted
            in seasonal fruit, cultured cream, and fine French butter.
          </p>

          <div className={styles.heroDivider} aria-hidden="true" data-hero-animate />

          <ul className={styles.heroFeatures} role="list" data-hero-animate>
            {HERO_HIGHLIGHTS.map((item) => (
              <li key={item.label} className={styles.heroFeature}>
                <span className={styles.heroFeatureLabel}>{item.label}</span>
                <span className={styles.heroFeatureDetail}>{item.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Link href="/#gallery" className={styles.heroScroll} aria-label="Scroll to gallery">
        <span className={styles.heroScrollText}>Discover</span>
        <span className={styles.heroScrollLine} aria-hidden="true" />
      </Link>
    </section>
  );
}
