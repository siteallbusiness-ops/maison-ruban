"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/Common/Container/Container";
import ScrollReveal from "@/components/Common/ScrollReveal/ScrollReveal";
import SectionTitle from "@/components/Common/SectionTitle/SectionTitle";
import { FAQ_ITEMS } from "@/constants/sections";
import styles from "./FAQ.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const items = section.querySelectorAll("[data-faq-item]");

      items.forEach((item) => {
        const summary = item.querySelector("summary");
        const chevron = item.querySelector("[data-faq-chevron]");
        if (!summary || !chevron) return;

        const setOpen = (open) => {
          gsap.to(chevron, {
            rotate: open ? 90 : 0,
            duration: 0.25,
            ease: "power3.out",
          });
        };

        setOpen(item.open);
        item.addEventListener("toggle", () => setOpen(item.open));
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className={styles.faqSection}
      aria-labelledby="faq-heading"
    >
      <Container>
        <div className={styles.faqGrid}>
          <ScrollReveal from="left" effect="fade" className={styles.faqIntro}>
            <SectionTitle as="p" variant="eyebrow">
              Good to know
            </SectionTitle>
            <SectionTitle as="h2" variant="section" id="faq-heading">
              Pickup details, cake consults, and little notes.
            </SectionTitle>
            <p className={styles.faqLead}>
              A few quick answers to help you plan a visit. If you’re unsure, email us and
              we’ll guide you to what’s best this week.
            </p>
          </ScrollReveal>

          <div className={styles.faqList}>
            {FAQ_ITEMS.map((item, index) => (
              <ScrollReveal
                key={item.id}
                from="right"
                effect="lift"
                delay={index * 80}
                className={styles.faqItemWrap}
              >
                <details className={styles.faqItem} data-faq-item>
                  <summary className={styles.faqSummary}>
                    <span className={styles.faqQuestion}>{item.q}</span>
                    <span className={styles.faqChevron} data-faq-chevron aria-hidden="true">
                      ›
                    </span>
                  </summary>
                  <div className={styles.faqAnswer}>
                    <p>{item.a}</p>
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

