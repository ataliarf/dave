import { NeighborRow } from "./NeighborRow";
import styles from "./NeighborList.module.scss";
import type { NeighborListProps } from "./types";

export function NeighborList({ title, emptyLabel, neighbors, onSelect }: NeighborListProps) {
  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>
        {title} <span className={styles.count}>{neighbors.length}</span>
      </h3>
      {neighbors.length === 0 ? (
        <p className={styles.empty}>{emptyLabel}</p>
      ) : (
        <ul className={styles.list}>
          {neighbors.map((n) => (
            <NeighborRow key={n.id} neighbor={n} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </section>
  );
}
