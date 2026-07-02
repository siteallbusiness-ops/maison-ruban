"use client";

import { useLayoutEffect, useRef } from "react";
import Container from "@/components/Common/Container/Container";
import ScrollReveal from "@/components/Common/ScrollReveal/ScrollReveal";
import { CRAFT_STEPS, EDITORIAL_QUOTE } from "@/constants/sections";
import styles from "./Craft.module.css";

export default function Craft() {
  const quoteRef = useRef(null);

  useLayoutEffect(() => {
    const quote = quoteRef.current;
    if (!quote) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let ctx;
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          quote,
          { backgroundPosition: "0% 50%" },
          {
            backgroundPosition: "100% 50%",
            ease: "none",
            scrollTrigger: {
              trigger: quote,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }, quote);
    };

    init();
    return () => ctx?.revert();
  }, []);

  return (
    <>
      <section id="craft" className={styles.craftSection} aria-labelledby="craft-heading">
        <Container>
          <ScrollReveal from="bottom" effect="fade" className={styles.craftIntro}>
            <p className={styles.craftEyebrow}>From kitchen to counter</p>
            <h2 className={styles.craftHeading} id="craft-heading">
              How every tray leaves the oven.
            </h2>
          </ScrollReveal>

          <ol className={styles.craftSteps}>
            {CRAFT_STEPS.map((step, index) => (
              <li key={step.id}>
                <ScrollReveal
                  from="bottom"
                  effect="lift"
                  className={styles.craftStep}
                  delay={index * 100}
                >
                  <span className={styles.craftStepNumber}>{step.step}</span>
                  <h3 className={styles.craftStepTitle}>{step.title}</h3>
                  <p className={styles.craftStepDetail}>{step.detail}</p>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <aside ref={quoteRef} className={styles.quoteBand} aria-label="Kitchen philosophy">
        <Container>
          <ScrollReveal from="bottom" effect="fade" className={styles.quoteInner}>
            <blockquote className={styles.quoteBlock}>
              <p className={styles.quoteText}>{EDITORIAL_QUOTE.text}</p>
              <footer className={styles.quoteAttribution}>— {EDITORIAL_QUOTE.attribution}</footer>
            </blockquote>
          </ScrollReveal>
        </Container>
      </aside>
    </>
  );
}
