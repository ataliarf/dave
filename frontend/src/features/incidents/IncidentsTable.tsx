import { useMemo } from "react";
import type { Incident } from "@dave/shared";
import { Skeleton } from "../../ui/Skeleton/Skeleton";
import { useNow } from "../../hooks/useNow";
import { COLUMNS } from "./consts";
import { IncidentsRow } from "./IncidentsRow";
import { IncidentsTableHeader } from "./IncidentsTableHeader";
import styles from "./IncidentsTable.module.scss";
import { toRowVm } from "./utils/classifyOngoing";

interface Props {
  incidents: Incident[];
  serviceMap: Map<string, string>;
  loading?: boolean;
  pageSize: number;
}

export function IncidentsTable({ incidents, serviceMap, loading, pageSize }: Props) {
  const now = useNow();
  const rows = useMemo(() => incidents.map((i) => toRowVm(i, now)), [incidents, now]);

  if (loading && incidents.length === 0) {
    return (
      <table className={styles.table}>
        <ColumnWidths />
        <IncidentsTableHeader />
        <tbody>
          {Array.from({ length: pageSize }).map((_, i) => (
            <tr key={i}>
              {COLUMNS.map((c) => (
                <td key={c.key} className={styles.td}>
                  <Skeleton width="80%" height={14} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <table className={styles.table}>
      <ColumnWidths />
      <IncidentsTableHeader />
      <tbody>
        {rows.map((row) => (
          <IncidentsRow
            key={row.incident.id}
            row={row}
            serviceName={serviceMap.get(row.incident.serviceId) ?? row.incident.serviceId}
            now={now}
          />
        ))}
      </tbody>
    </table>
  );
}

function ColumnWidths() {
  return (
    <colgroup>
      {COLUMNS.map((c) => (
        <col key={c.key} style={{ width: c.width }} />
      ))}
    </colgroup>
  );
}
