import type { IngestSummary, IngestStep } from "@dave/shared";
import { describeStep } from "../utils/summarizeSkipped";
import styles from "./IngestProgress.module.scss";

interface Props {
  summary: IngestSummary;
}

const STEPS: IngestStep[] = ["services", "dependencies", "incidents"];

export function IngestProgress({ summary }: Props) {
  return (
    <ul className={styles.list}>
      {STEPS.map((stepName) => {
        const step = summary[stepName];
        if (!step) return null;

        return (
          <li key={stepName} className={styles.step}>
            <div className={styles.head}>
              <span className={styles.name}>{stepName}</span>
              <span className={step.ok ? styles.statusOk : styles.statusFail}>
                {step.ok ? "ok" : "failed"}
              </span>
            </div>
            <div className={styles.counts}>{describeStep(step)}</div>
            {step.error ? <div className={styles.error}>{step.error}</div> : null}
            {step.skipped.length > 0 ? (
              <details className={styles.details}>
                <summary>{step.skipped.length} skipped</summary>
                <ul className={styles.skipList}>
                  {step.skipped.map((s, i) => (
                    <li key={i}>
                      <span className={styles.skipRow}>row {s.row}</span> — {s.reason}
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
