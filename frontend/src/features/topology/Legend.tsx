import styles from "./Legend.module.scss";

export function Legend() {
  return (
    <div className={styles.legend}>
      <div className={styles.section}>
        <h4 className={styles.h}>Tier</h4>
        <ul className={styles.items}>
          <li>
            <span className={`${styles.swatch} ${styles.tCrit}`} /> critical
          </li>
          <li>
            <span className={`${styles.swatch} ${styles.tStd}`} /> standard
          </li>
          <li>
            <span className={`${styles.swatch} ${styles.tExp}`} /> experimental
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h4 className={styles.h}>Edge type</h4>
        <ul className={styles.items}>
          <li>
            <span className={styles.lineSolid} /> sync_http
          </li>
          <li>
            <span className={styles.lineDashed} /> async_queue
          </li>
          <li>
            <span className={styles.lineDotted} /> db_read
          </li>
          <li>
            <span className={styles.lineLong} /> db_write
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h4 className={styles.h}>Criticality</h4>
        <ul className={styles.items}>
          <li>
            <span className={styles.lineThick} /> high
          </li>
          <li>
            <span className={styles.lineMed} /> medium
          </li>
          <li>
            <span className={styles.lineThin} /> low
          </li>
        </ul>
      </div>
    </div>
  );
}
