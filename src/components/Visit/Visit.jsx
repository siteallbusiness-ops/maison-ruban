"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/Common/Container/Container";
import Button from "@/components/Common/Button/Button";
import { OPENING_HOURS, KITCHEN_ADDRESS, VISIT_FEATURES } from "@/constants/hours";
import { SITE_EMAIL } from "@/constants/site";
import styles from "./Visit.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Visit() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section || !header) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const headerItems = header.querySelectorAll("[data-visit-animate]");
    const cards = section.querySelectorAll("[data-visit-card]");
    const photo = section.querySelector(`.${styles.photoFrame}`);
    const photoImg = section.querySelector(`.${styles.photoImage}`);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 90%",
        toggleActions: "play none none none",
        once: true,
      },
    });

    timeline
      .from(headerItems, {
        opacity: 0,
        y: 18,
        duration: 0.55,
        stagger: 0.06,
        ease: "power3.out",
      })
      .from(
        cards,
        {
          opacity: 0,
          y: 22,
          duration: 0.55,
          stagger: 0.08,
          ease: "power3.out",
        },
        0.12
      );

    if (photo && photoImg) {
      gsap.to(photoImg, {
        y: -18,
        ease: "none",
        scrollTrigger: {
          trigger: photo,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === photo)
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="visit"
      className={styles.visitSection}
      aria-labelledby="visit-heading"
    >
      <Container>
        <header ref={headerRef} className={styles.visitHeader}>
          <p className={styles.visitEyebrow} data-visit-animate>
            Visit
          </p>
          <h2 className={styles.visitHeading} id="visit-heading" data-visit-animate>
            Counter pickup, a few window stools, and warm boxes for the walk home.
          </h2>
          <p className={styles.visitDescription} data-visit-animate>
            No reservations for takeaway. For a celebration cake consult, email a week ahead
            with your date, servings, and any dietary notes — we&apos;ll confirm within two
            working days.
          </p>
        </header>

        <div className={styles.visitGrid}>
          <div className={styles.visitCard} data-visit-card>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Pickup &amp; tables</h3>
              <span className={styles.cardBadge}>Wed – Sun</span>
            </div>

            <div className={styles.photoFrame} aria-hidden="true">
              <Image
                src="/images/hero-atmosphere.png"
                width={1536}
                height={1024}
                alt=""
                loading="lazy"
                className={styles.photoImage}
                sizes="(max-width: 992px) 100vw, 46vw"
              />
              <div className={styles.photoOverlay} />
            </div>

            <ul className={styles.featureList} role="list">
              {VISIT_FEATURES.map((feature) => (
                <li key={feature.id} className={styles.featureRow}>
                  <span className={styles.featureDot} aria-hidden="true" />
                  <span className={styles.featureText}>
                    <span className={styles.featureLabel}>{feature.label}</span>
                    <span className={styles.featureDetail}>{feature.detail}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.contactRow}>
              <a href={`mailto:${SITE_EMAIL}`} className={styles.contactLink}>
                {SITE_EMAIL}
              </a>
              <Button href={`mailto:${SITE_EMAIL}`} variant="solid" className={styles.contactButton}>
                Plan a cake consult
              </Button>
            </div>
          </div>

          <div id="hours" className={styles.visitCard} data-visit-card>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Opening hours</h3>
              <span className={styles.cardBadgeAlt}>Sample schedule</span>
            </div>

            <ul className={styles.hoursList} role="list" aria-label="Opening hours">
              {OPENING_HOURS.map((row) => (
                <li
                  key={row.days}
                  className={`${styles.hoursRow} ${row.isClosed ? styles.hoursRowClosed : ""}`}
                >
                  <span className={styles.hoursDays}>{row.days}</span>
                  <span className={styles.hoursTime}>{row.hours}</span>
                </li>
              ))}
            </ul>

            <div className={styles.locationBlock}>
              <span className={styles.locationLabel}>Kitchen</span>
              <p className={styles.locationAddress}>{KITCHEN_ADDRESS}</p>
              <p className={styles.locationNote}>
                Map embed and step-free access notes go here in production.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
