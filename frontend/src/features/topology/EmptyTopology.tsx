import { Button } from "../../ui/Button/Button";
import { Spinner } from "../../ui/Spinner/Spinner";
import styles from "./EmptyTopology.module.scss";

export type EmptyTopologyVariant = "pre-ingest" | "no-match" | "ingesting";

interface Props {
  variant: EmptyTopologyVariant;
  onClearFilters?: () => void;
}

export function EmptyTopology({ variant, onClearFilters }: Props) {
  if (variant === "ingesting") {
    return (
      <div className={styles.empty}>
        <Spinner size={20} />
        <h3 className={styles.title}>Ingesting…</h3>
        <p className={styles.body}>The graph will paint when the run finishes.</p>
      </div>
    );
  }

  if (variant === "no-match") {
    return (
      <div className={styles.empty}>
        <h3 className={styles.title}>No services match these filters</h3>
        <p className={styles.body}>Try removing a filter to see more of the graph.</p>
        {onClearFilters ? (
          <Button onClick={onClearFilters} variant="primary" size="sm">
            Clear filters
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className={styles.empty}>
      <h3 className={styles.title}>Run your first ingest</h3>
      <p className={styles.body}>
        Use the banner above to load services, dependencies, and incidents.
      </p>
    </div>
  );
}
