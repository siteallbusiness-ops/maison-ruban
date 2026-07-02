import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/constants/site";
import LogoMark from "./LogoMark";
import styles from "./Logo.module.css";

export default function Logo({
  href = "/",
  variant = "header",
  showTagline = true,
  className = "",
}) {
  const isFooter = variant === "footer";

  const content = (
    <>
      <LogoMark
        size={isFooter ? 44 : 40}
        className={styles.logoMark}
        title={href ? undefined : `${SITE_NAME} logo`}
      />
      <span className={styles.logoText}>
        <span className={isFooter ? styles.logoNameFooter : styles.logoName}>
          {SITE_NAME}
        </span>
        {showTagline ? (
          <span className={isFooter ? styles.logoSubFooter : styles.logoSub}>
            {SITE_TAGLINE}
          </span>
        ) : null}
      </span>
    </>
  );

  const rootClass = `${styles.logo} ${isFooter ? styles.logoFooter : styles.logoHeader} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={rootClass} aria-label={`${SITE_NAME} home`}>
        {content}
      </Link>
    );
  }

  return <div className={rootClass}>{content}</div>;
}
