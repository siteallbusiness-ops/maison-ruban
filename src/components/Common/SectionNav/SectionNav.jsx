"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PAGE_SECTIONS } from "@/constants/navigation";
import styles from "./SectionNav.module.css";

export default function SectionNav() {
  const [activeId, setActiveId] = useState(PAGE_SECTIONS[0].id);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const sectionElements = PAGE_SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      Boolean
    );

    if (!sectionElements.length) return;

    const ratios = new Map(PAGE_SECTIONS.map(({ id }) => [id, 0]));

    const pickActive = () => {
      let bestId = PAGE_SECTIONS[0].id;
      let bestRatio = 0;

      ratios.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });

      if (bestRatio > 0) {
        setActiveId(bestId);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.intersectionRatio);
        });
        pickActive();
      },
      {
        rootMargin: "-32% 0px -32% 0px",
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
      }
    );

    sectionElements.forEach((element) => observer.observe(element));

    const handleScroll = () => {
      const hero = document.getElementById("hero");
      if (!hero) {
        setIsVisible(true);
        return;
      }
      setIsVisible(window.scrollY > hero.offsetHeight * 0.25);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`${styles.sectionNav} ${isVisible ? styles.sectionNavVisible : ""}`}
        aria-label="Page sections"
      >
        <ol className={styles.sectionNavList} role="list">
          {PAGE_SECTIONS.map(({ id, label }) => {
            const isActive = activeId === id;

            return (
              <li key={id} className={styles.sectionNavItem}>
                <Link
                  href={`/#${id}`}
                  className={`${styles.sectionNavLink} ${isActive ? styles.sectionNavLinkActive : ""}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className={styles.sectionNavLabel}>{label}</span>
                <span
                  className={`${styles.sectionNavTick} ${isActive ? styles.sectionNavTickActive : ""}`}
                  aria-hidden="true"
                />
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>

      <nav
        className={`${styles.sectionNavMobile} ${isVisible ? styles.sectionNavMobileVisible : ""}`}
        aria-label="Current section"
      >
        <div className={styles.sectionNavMobileInner}>
          <span className={styles.sectionNavMobileKicker}>Section</span>
          <span className={styles.sectionNavMobileTitle}>
            {PAGE_SECTIONS.find((s) => s.id === activeId)?.label ?? "Home"}
          </span>

          <div className={styles.sectionNavMobileDots} aria-hidden="true">
            {PAGE_SECTIONS.map(({ id }) => (
              <span
                key={id}
                className={`${styles.sectionNavMobileDot} ${
                  id === activeId ? styles.sectionNavMobileDotActive : ""
                }`}
              />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
