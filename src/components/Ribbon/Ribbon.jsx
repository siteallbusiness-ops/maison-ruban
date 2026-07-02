import styles from "./Ribbon.module.css";

const MARQUEE_ITEMS = [
  "Madeleines",
  "Layer cakes",
  "Preserves",
  "Afternoon tea",
  "Small batches",
  "French butter",
  "Seasonal fruit",
];

export default function Ribbon() {
  const track = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className={styles.ribbon} aria-hidden="true">
      <div className={styles.ribbonTrack}>
        {track.map((item, index) => (
          <span key={`${item}-${index}`} className={styles.ribbonItem}>
            {item}
            <span className={styles.ribbonDot} />
          </span>
        ))}
      </div>
    </div>
  );
}
