import { Link } from "react-router-dom";
import { Badge } from "../../ui/Badge/Badge";
import { formatAbsoluteTime, formatDuration, formatRelativeTime } from "../../utils/formatTime";
import styles from "./IncidentsTable.module.scss";
import type { IncidentRowVm } from "./types";

interface Props {
  row: IncidentRowVm;
  serviceName: string;
  now: Date;
}

export function IncidentsRow({ row, serviceName, now }: Props) {
  const { incident, status, durationMs } = row;
  return (
    <tr className={styles.tr}>
      <td className={styles.td}>
        <Badge tone="severity" value={incident.severity}>
          {incident.severity}
        </Badge>
      </td>
      <td className={styles.td}>{incident.title}</td>
      <td className={styles.td}>
        <Link
          className={styles.serviceLink}
          to={`/?service=${encodeURIComponent(incident.serviceId)}`}
        >
          {serviceName}
        </Link>
      </td>
      <td className={styles.td}>
        <time dateTime={incident.startedAt} title={formatAbsoluteTime(incident.startedAt)}>
          {formatRelativeTime(incident.startedAt, now)}
        </time>
      </td>
      <td className={styles.td}>
        {incident.resolvedAt ? (
          <time dateTime={incident.resolvedAt} title={formatAbsoluteTime(incident.resolvedAt)}>
            {formatRelativeTime(incident.resolvedAt, now)}
          </time>
        ) : (
          <span className={styles.ongoing}>ongoing</span>
        )}
      </td>
      <td className={styles.td}>
        {formatDuration(durationMs)}
        {status === "ongoing" ? <span className={styles.subtle}> & counting</span> : null}
      </td>
    </tr>
  );
}
