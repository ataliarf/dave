import type { IngestRun } from "@dave/shared";
import { Spinner } from "../../../ui/Spinner/Spinner";
import { useNow } from "../../../hooks/useNow";
import { formatRelativeTime } from "../../../utils/formatTime";
import styles from "../IngestBanner.module.scss";

interface Props {
  run: IngestRun & { status: "running" };
}

export function IngestStatusRunning({ run }: Props) {
  const now = useNow();
  return (
    <div className={`${styles.banner} ${styles.running}`}>
      <Spinner size={14} />
      <div className={styles.text}>
        <strong>Ingesting…</strong> started {formatRelativeTime(run.startedAt, now)}
      </div>
    </div>
  );
}
