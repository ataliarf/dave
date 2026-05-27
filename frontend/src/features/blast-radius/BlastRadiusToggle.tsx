import { useBlastRadiusFlag } from "../../hooks/useBlastRadiusFlag";
import styles from "./BlastRadiusToggle.module.scss";

export function BlastRadiusToggle() {
  const { enabled, toggle } = useBlastRadiusFlag();
  return (
    <button
      type="button"
      className={`${styles.toggle} ${enabled ? styles.on : ""}`}
      onClick={toggle}
      aria-pressed={enabled}
    >
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
      <span className={styles.label}>
        Blast radius
        <span className={styles.sub}>
          {enabled ? "on — upstream amber, downstream teal" : "off"}
        </span>
      </span>
    </button>
  );
}
