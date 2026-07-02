"use client";

import { useLayoutEffect, useRef } from "react";
import Container from "@/components/Common/Container/Container";
import ScrollReveal from "@/components/Common/ScrollReveal/ScrollReveal";
import SectionTitle from "@/components/Common/SectionTitle/SectionTitle";
import { GALLERY_ITEMS } from "@/constants/gallery";
import FloatingProducts from "@/components/Gallery/FloatingProducts";
import styles from "./Gallery.module.css";

function GalleryScrollItem({ item, index }) {
  const textOnLeft = index % 2 === 0;
  const itemNumber = String(index + 1).padStart(2, "0");

  const detailContent = (
    <>
      <span className={styles.itemNumber}>{itemNumber}.</span>
      <span className={styles.itemCategory}>{item.category}</span>
      <h3 className={styles.itemTitle} id={`gallery-item-${item.id}`}>
        {item.title}
      </h3>
      <p className={styles.itemCaption}>{item.caption}</p>
      <p className={styles.itemDescription}>{item.description}</p>
      <ul className={styles.itemTags} role="list">
        {item.tags.map((tag) => (
          <li key={tag} className={styles.itemTag}>
            {tag}
          </li>
        ))}
      </ul>
    </>
  );

  const visualContent = (
    <FloatingProducts items={item.floaters} label={item.alt} />
  );

  return (
    <article
      className={styles.scrollItem}
      aria-labelledby={`gallery-item-${item.id}`}
      data-gallery-row
    >
      {textOnLeft ? (
        <>
          <ScrollReveal from="left" className={styles.detailPanel}>
            {detailContent}
          </ScrollReveal>
          <ScrollReveal from="right" className={styles.visualPanel} delay={220}>
            {visualContent}
          </ScrollReveal>
        </>
      ) : (
        <>
          <ScrollReveal from="left" className={styles.visualPanel}>
            {visualContent}
          </ScrollReveal>
          <ScrollReveal from="right" className={styles.detailPanel} delay={220}>
            {detailContent}
          </ScrollReveal>
        </>
      )}
    </article>
  );
}

export default function Gallery() {
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
        const rows = section.querySelectorAll("[data-gallery-row]");
        rows.forEach((row) => {
          const number = row.querySelector(`.${styles.itemNumber}`);
          const tags = row.querySelectorAll(`.${styles.itemTag}`);
          const visual = row.querySelector(`.${styles.visualPanel}`);

          if (visual) {
            gsap.to(visual, {
              y: -14,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          }

          ScrollTrigger.create({
            trigger: row,
            start: "top 84%",
            once: true,
            onEnter: () => {
              if (number) {
                gsap.fromTo(
                  number,
                  { opacity: 0, y: 14 },
                  { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
                );
              }

              if (tags.length) {
                gsap.fromTo(
                  tags,
                  { opacity: 0, y: 10 },
                  { opacity: 1, y: 0, duration: 0.5, stagger: 0.045, ease: "power3.out", delay: 0.06 }
                );
              }
            },
          });
        });
      }, section);
    };

    init();

    return () => ctx?.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.gallerySection}
      id="gallery"
      aria-labelledby="gallery-heading"
    >
      <Container>
        <ScrollReveal from="bottom" className={styles.galleryIntroWrap}>
          <SectionTitle as="p" variant="eyebrow">
            On the counter
          </SectionTitle>
          <SectionTitle as="h2" variant="section" id="gallery-heading">
            Everything on the counter today.
          </SectionTitle>
          <p className={styles.galleryIntro}>
            Scroll to discover each treat — copy arrives from one side, photography from
            the other, the way you&apos;d walk our display at cakestreats.com.
          </p>
        </ScrollReveal>

        <div className={styles.scrollList}>
          {GALLERY_ITEMS.map((item, index) => (
            <GalleryScrollItem key={item.id} item={item} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
