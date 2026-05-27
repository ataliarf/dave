import type { IngestRun } from "@dave/shared";
import { StatusDot } from "../../../ui/StatusDot/StatusDot";
import { useNow } from "../../../hooks/useNow";
import { formatRelativeTime } from "../../../utils/formatTime";
import { ReingestButton } from "../ReingestButton";
import styles from "../IngestBanner.module.scss";

interface Props {
  run: IngestRun & { status: "succeeded" };
}

export function IngestStatusSucceeded({ run }: Props) {
  const now = useNow();
  const at = run.finishedAt ?? run.startedAt;
  return (
    <div className={`${styles.banner} ${styles.succeeded}`}>
      <StatusDot state="ok" />
      <div className={styles.text}>
        <strong>Up to date.</strong> Last ingest {formatRelativeTime(at, now)}.
      </div>
      <div className={styles.actions}>
        <ReingestButton />
      </div>
    </div>
  );
}
