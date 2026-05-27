import { StatusDot } from "../../../ui/StatusDot/StatusDot";
import { ReingestButton } from "../ReingestButton";
import styles from "../IngestBanner.module.scss";

export function IngestStatusIdle() {
  return (
    <div className={`${styles.banner} ${styles.idle}`}>
      <StatusDot state="idle" />
      <div className={styles.text}>
        <strong>No data yet.</strong> Run an ingest to load the topology.
      </div>
      <div className={styles.actions}>
        <ReingestButton label="Run ingest" variant="primary" />
      </div>
    </div>
  );
}
