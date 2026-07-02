import Link from "next/link";
import styles from "./Button.module.css";

const VARIANT_CLASSES = {
  solid: styles.buttonSolid,
  outline: styles.buttonOutline,
  nav: styles.buttonNav,
};

export default function Button({
  children,
  href,
  variant = "solid",
  className = "",
  onClick,
  ariaLabel,
  type = "button",
}) {
  const classNames = [styles.button, VARIANT_CLASSES[variant], className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={classNames} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
