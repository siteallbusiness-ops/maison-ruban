"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/Common/Container/Container";
import ScrollReveal from "@/components/Common/ScrollReveal/ScrollReveal";
import SectionTitle from "@/components/Common/SectionTitle/SectionTitle";
import { LOVE_NOTES } from "@/constants/sections";
import styles from "./Testimonials.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll("[data-note-card]");

      cards.forEach((card) => {
        const highlight = card.querySelector("[data-note-highlight]");
        if (!highlight) return;

        gsap.fromTo(
          highlight,
          { scaleX: 0, opacity: 0.7 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 86%",
              once: true,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="notes"
      className={styles.notesSection}
      aria-labelledby="notes-heading"
    >
      <Container>
        <ScrollReveal from="bottom" effect="fade" className={styles.notesIntro}>
          <SectionTitle as="p" variant="eyebrow">
            Love notes
          </SectionTitle>
          <SectionTitle as="h2" variant="section" id="notes-heading">
            Words we keep on the counter.
          </SectionTitle>
          <p className={styles.notesLead}>
            The kind messages that come back with empty boxes and jam jars — warm, quiet,
            and very much appreciated.
          </p>
        </ScrollReveal>

        <div className={styles.notesGrid}>
          {LOVE_NOTES.map((note, index) => (
            <ScrollReveal
              key={note.id}
              from={index % 2 === 0 ? "left" : "right"}
              effect="lift"
              delay={index * 90}
              className={styles.noteCard}
            >
              <div className={styles.noteHighlight} data-note-highlight aria-hidden="true" />
              <figure className={styles.noteFigure} data-note-card>
                <blockquote className={styles.noteQuote}>&ldquo;{note.quote}&rdquo;</blockquote>
                <div className={styles.noteCaption} aria-hidden="true" />
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

