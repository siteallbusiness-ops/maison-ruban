"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/Common/Container/Container";
import ScrollReveal from "@/components/Common/ScrollReveal/ScrollReveal";
import SectionTitle from "@/components/Common/SectionTitle/SectionTitle";
import { STORY_PILLARS } from "@/constants/sections";
import styles from "./Story.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const frame = section.querySelector(`.${styles.storyImageFrame}`);
    const veil = section.querySelector(`.${styles.storyImageVeil}`);

    if (!frame) return;

    const ctx = gsap.context(() => {
      gsap.to(frame, {
        y: -18,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      if (veil) {
        gsap.to(veil, {
          opacity: 0.85,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
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
      className={styles.storySection}
      id="story"
      aria-labelledby="story-heading"
    >
      <Container>
        <div className={styles.storyGrid}>
          <ScrollReveal from="left" effect="drift" className={styles.storyVisual}>
            <div className={styles.storyImageFrame}>
              <Image
                src="/images/hero-accent-macarons.webp"
                width={1200}
                height={800}
                alt="Pastel macarons and meringues in glass jars on white painted wood"
                loading="lazy"
                className={styles.storyImage}
                sizes="(max-width: 992px) 100vw, 44vw"
              />
              <div className={styles.storyImageVeil} aria-hidden="true" />
            </div>

            <blockquote className={styles.storyQuote}>
              <p>
                Painted wood, soft light, and the smell of butter before the door even
                opens.
              </p>
            </blockquote>
          </ScrollReveal>

          <ScrollReveal from="right" effect="fade" className={styles.storyContent} delay={120}>
            <SectionTitle as="p" variant="eyebrow">
              Our kitchen
            </SectionTitle>

            <SectionTitle as="h2" variant="section" id="story-heading">
              A shabby-chic patisserie built around the counter.
            </SectionTitle>

            <p className={styles.storyLead}>
              Cakes Treats is a dessert-first kitchen — part French-country recipe book,
              part neighbourhood treat shop. We favour fruit over frosting, butter over
              shortcuts, and the kind of afternoon that deserves a second slice.
            </p>

            <ul className={styles.storyPillars} role="list">
              {STORY_PILLARS.map((pillar) => (
                <li key={pillar.id} className={styles.storyPillar}>
                  <span className={styles.storyPillarTitle}>{pillar.title}</span>
                  <span className={styles.storyPillarDetail}>{pillar.detail}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
