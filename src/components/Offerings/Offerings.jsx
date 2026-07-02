"use client";

import { useLayoutEffect, useRef } from "react";
import Container from "@/components/Common/Container/Container";
import ScrollReveal from "@/components/Common/ScrollReveal/ScrollReveal";
import SectionTitle from "@/components/Common/SectionTitle/SectionTitle";
import { OFFERINGS } from "@/constants/sections";
import styles from "./Offerings.module.css";

export default function Offerings() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let ctx;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const cards = section.querySelectorAll(`.${styles.offeringCard}`);
        cards.forEach((card) => {
          const number = card.querySelector(`.${styles.offeringNumber}`);
          const tags = card.querySelectorAll(`.${styles.offeringTag}`);

          ScrollTrigger.create({
            trigger: card,
            start: "top 88%",
            once: true,
            onEnter: () => {
              if (number) {
                gsap.fromTo(
                  number,
                  { y: 10, opacity: 0, rotate: -1 },
                  { y: 0, opacity: 1, rotate: 0, duration: 0.55, ease: "power3.out" }
                );
              }

              if (tags.length) {
                gsap.fromTo(
                  tags,
                  { opacity: 0, y: 10 },
                  { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out", delay: 0.08 }
                );
              }
            },
          });

          // Subtle hover tilt (desktop only)
          const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
          if (!mq.matches) return;

          const onMove = (event) => {
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, { rotateX: py * -3, rotateY: px * 3, duration: 0.35, ease: "power3.out" });
          };

          const onLeave = () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power3.out" });
          };

          card.addEventListener("mousemove", onMove);
          card.addEventListener("mouseleave", onLeave);
        });
      }, section);
    };

    init();

    return () => ctx?.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.offeringsSection}
      id="offerings"
      aria-labelledby="offerings-heading"
    >
      <Container>
        <ScrollReveal from="bottom" effect="fade" className={styles.offeringsIntro}>
          <SectionTitle as="p" variant="eyebrow">
            What we make
          </SectionTitle>
          <SectionTitle as="h2" variant="section" id="offerings-heading">
            Four counters, one kitchen.
          </SectionTitle>
          <p className={styles.offeringsLead}>
            From celebration cakes to afternoon jars — everything leaves our kitchen the
            same day it was mixed, finished, and wrapped for the walk home.
          </p>
        </ScrollReveal>

        <ul className={styles.offeringsGrid} role="list">
          {OFFERINGS.map((item, index) => (
            <li key={item.id}>
              <ScrollReveal
                from={index % 2 === 0 ? "left" : "right"}
                effect="lift"
                className={styles.offeringCard}
                delay={index * 80}
              >
                <span className={styles.offeringNumber}>{item.number}</span>
                <h3 className={styles.offeringTitle}>{item.title}</h3>
                <p className={styles.offeringDetail}>{item.detail}</p>
                <ul className={styles.offeringTags} role="list">
                  {item.tags.map((tag) => (
                    <li key={tag} className={styles.offeringTag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
