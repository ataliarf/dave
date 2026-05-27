import type { Incident } from "@dave/shared";
import { Badge } from "../../ui/Badge/Badge";
import { useNow } from "../../hooks/useNow";
import { formatRelativeTime } from "../../utils/formatTime";
import styles from "./RecentIncidents.module.scss";

interface Props {
  incidents: Incident[];
}

export function RecentIncidents({ incidents }: Props) {
  const now = useNow();

  if (incidents.length === 0) {
    return (
      <section className={styles.section}>
        <h3 className={styles.heading}>
          Recent incidents <span className={styles.subtle}>(7d)</span>
        </h3>
        <p className={styles.empty}>No incidents in the last 7 days.</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>
        Recent incidents <span className={styles.subtle}>(7d)</span>
      </h3>
      <ul className={styles.list}>
        {incidents.map((inc) => (
          <li key={inc.id} className={styles.row}>
            <Badge tone="severity" value={inc.severity}>
              {inc.severity}
            </Badge>
            <div className={styles.body}>
              <div className={styles.title}>{inc.title}</div>
              <div className={styles.timing}>
                {formatRelativeTime(inc.startedAt, now)}
                {inc.resolvedAt == null ? <span className={styles.ongoing}>ongoing</span> : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
