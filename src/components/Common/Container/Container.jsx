import styles from "./Container.module.css";

export default function Container({ children, className = "", as: Tag = "div", id }) {
  const classNames = [styles.container, className].filter(Boolean).join(" ");

  return (
    <Tag id={id} className={classNames}>
      {children}
    </Tag>
  );
}
