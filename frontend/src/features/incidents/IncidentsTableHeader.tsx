import { COLUMNS } from "./consts";
import styles from "./IncidentsTable.module.scss";

export function IncidentsTableHeader() {
  return (
    <thead className={styles.thead}>
      <tr>
        {COLUMNS.map((c) => (
          <th key={c.key} className={styles.th}>
            {c.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
