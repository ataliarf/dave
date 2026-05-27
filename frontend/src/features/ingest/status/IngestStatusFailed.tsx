import { useState } from "react";
import type { IngestRun, IngestStep } from "@dave/shared";
import { Button } from "../../../ui/Button/Button";
import { StatusDot } from "../../../ui/StatusDot/StatusDot";
import { useNow } from "../../../hooks/useNow";
import { formatRelativeTime } from "../../../utils/formatTime";
import { IngestProgress } from "./IngestProgress";
import { ReingestButton } from "../ReingestButton";
import styles from "../IngestBanner.module.scss";

interface Props {
  run: IngestRun & { status: "failed" };
}

export function IngestStatusFailed({ run }: Props) {
  const [open, setOpen] = useState(false);
  const now = useNow();
  const at = run.finishedAt ?? run.startedAt;

  let summarySnippet = "Ingest failed.";
  if (run.summary) {
    const failed = Object.entries(run.summary) as [
      IngestStep,
      IngestRun["summary"] extends infer _ ? never : never,
    ][];
    const firstFailedEntry = Object.entries(run.summary).find(([, s]) => s && !s.ok);
    if (firstFailedEntry) {
      const [name, step] = firstFailedEntry;
      summarySnippet = `Ingest failed at "${name}"${step?.error ? ` — ${step.error}` : ""}.`;
    }
    void failed;
  }

  return (
    <div className={styles.bannerColumn}>
      <div className={`${styles.banner} ${styles.failed}`}>
        <StatusDot state="error" />
        <div className={styles.text}>
          <strong>{summarySnippet}</strong>
          <span className={styles.muted}> · {formatRelativeTime(at, now)}</span>
        </div>
        <div className={styles.actions}>
          {run.summary ? (
            <Button size="sm" variant="ghost" onClick={() => setOpen((o) => !o)}>
              {open ? "Hide details" : "Show details"}
            </Button>
          ) : null}
          <ReingestButton label="Retry" variant="primary" />
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
