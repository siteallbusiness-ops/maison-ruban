import Link from "next/link";
import Container from "@/components/Common/Container/Container";
import Logo from "@/components/Common/Logo/Logo";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.siteHeader}>
      <Container className={styles.headerInner}>
        <Logo variant="header" />

        <Link href="/#visit" className={styles.headerCta}>
          <span className={styles.headerCtaDot} aria-hidden="true" />
          <span className={styles.headerCtaLabel}>Open Wed – Sun</span>
        </Link>
      </Container>
    </header>
  );
}
