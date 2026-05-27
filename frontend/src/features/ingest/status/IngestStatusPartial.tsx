import { useState } from "react";
import type { IngestRun } from "@dave/shared";
import { Button } from "../../../ui/Button/Button";
import { StatusDot } from "../../../ui/StatusDot/StatusDot";
import { useNow } from "../../../hooks/useNow";
import { formatRelativeTime } from "../../../utils/formatTime";
import { totalSkipped } from "../utils/summarizeSkipped";
import { IngestProgress } from "./IngestProgress";
import { ReingestButton } from "../ReingestButton";
import styles from "../IngestBanner.module.scss";

interface Props {
  run: IngestRun & { status: "partial" };
}

export function IngestStatusPartial({ run }: Props) {
  const [open, setOpen] = useState(false);
  const now = useNow();
  const skipped = run.summary ? totalSkipped(run.summary) : 0;
  const at = run.finishedAt ?? run.startedAt;

  return (
    <div className={styles.bannerColumn}>
      <div className={`${styles.banner} ${styles.partial}`}>
        <StatusDot state="warn" />
        <div className={styles.text}>
          <strong>Completed with issues.</strong> {skipped} row{skipped === 1 ? "" : "s"} skipped ·{" "}
          {formatRelativeTime(at, now)}
        </div>
        <div className={styles.actions}>
          <Button size="sm" variant="ghost" onClick={() => setOpen((o) => !o)}>
            {open ? "Hide details" : "Show details"}
          </Button>
          <ReingestButton />
        </div>
      </div>
      {open && run.summary ? (
        <div className={styles.expanded}>
          <IngestProgress summary={run.summary} />
        </div>
      ) : null}
    </div>
  );
}
