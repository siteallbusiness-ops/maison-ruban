import styles from "./SectionTitle.module.css";

const VARIANT_CLASSES = {
  section: styles.sectionTitle,
  page: styles.pageTitle,
  hero: styles.heroTitle,
  eyebrow: styles.eyebrow,
};

export default function SectionTitle({
  children,
  as: Tag = "h2",
  variant = "section",
  className = "",
  id,
}) {
  const classNames = [VARIANT_CLASSES[variant], className].filter(Boolean).join(" ");

  return (
    <Tag id={id} className={classNames}>
      {children}
    </Tag>
  );
}
