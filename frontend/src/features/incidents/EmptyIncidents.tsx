import { Button } from "../../ui/Button/Button";
import styles from "./EmptyIncidents.module.scss";

export type EmptyIncidentsVariant = "pre-ingest" | "no-data" | "no-match";

interface Props {
  variant: EmptyIncidentsVariant;
  onClear?: () => void;
}

const COPY: Record<EmptyIncidentsVariant, { title: string; body: string }> = {
  "pre-ingest": {
    title: "Run an ingest to see incidents",
    body: "The incidents table populates after the first successful ingest run.",
  },
  "no-data": {
    title: "No incidents recorded yet",
    body: "Nothing in the data files maps to an incident.",
  },
  "no-match": {
    title: "No incidents match these filters",
    body: "Try changing the status, removing a severity, or selecting a different service.",
  },
};

export function EmptyIncidents({ variant, onClear }: Props) {
  const { title, body } = COPY[variant];
  return (
    <div className={styles.empty}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.body}>{body}</p>
      {variant === "no-match" && onClear ? (
        <Button variant="primary" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
