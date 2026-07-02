import styles from "./Card.module.css";

export default function Card({ children, id, className = "", title, titleTag: TitleTag = "h2" }) {
  const classNames = [styles.card, className].filter(Boolean).join(" ");

  return (
    <article id={id} className={classNames}>
      {title && <TitleTag className={styles.cardTitle}>{title}</TitleTag>}
      {children}
    </article>
  );
}
