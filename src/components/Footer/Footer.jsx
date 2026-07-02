import Container from "@/components/Common/Container/Container";
import Logo from "@/components/Common/Logo/Logo";
import {
  SITE_NAME,
  SITE_EMAIL,
  SITE_URL,
} from "@/constants/site";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerTopGlow} aria-hidden="true" />
      <Container>
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <Logo variant="footer" />
            <p className={styles.footerDescription}>
              A dessert-first patisserie — cakes, preserves, and afternoon counters
              worth the trip.
            </p>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>Contact</h3>
            <ul className={styles.footerList} role="list">
              <li>
                <a href={`mailto:${SITE_EMAIL}`} className={styles.footerLink}>
                  {SITE_EMAIL}
                </a>
              </li>
              <li>
                <a href={SITE_URL} className={styles.footerLink}>
                  cakestreats.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopy}>
            © {year} {SITE_NAME}. Counter service · no reservations for takeaway.
          </p>
          <p className={styles.footerNote}>Shabby-chic patisserie · Manchester</p>
        </div>
      </Container>
    </footer>
  );
}
