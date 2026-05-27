import type { ReactNode } from "react";
import { Button } from "../../ui/Button/Button";
import { Skeleton } from "../../ui/Skeleton/Skeleton";
import { ClearFiltersButton } from "./ClearFiltersButton";
import styles from "./FilterPanelShell.module.scss";

interface Props {
  title?: string;
  hasAny: boolean;
  onClear: () => void;
  loading: boolean;
  error?: boolean;
  onRetry?: () => void;
  children: ReactNode;
}

export function FilterPanelShell({
  title = "Filters",
  hasAny,
  onClear,
  loading,
  error,
  onRetry,
  children,
}: Props) {
  return (
    <aside className={styles.panel} aria-label={title}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {hasAny ? <ClearFiltersButton onClick={onClear} /> : null}
      </header>

      {error ? (
        <div className={styles.error} role="alert">
          <p className={styles.errorText}>Failed to load filters.</p>
          {onRetry ? (
            <Button variant="primary" size="sm" onClick={onRetry}>
              Try again
            </Button>
          ) : null}
        </div>
      ) : loading ? (
        <div className={styles.loading}>
          <Skeleton width="60%" height={10} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="80%" height={14} />
          <Skeleton width="90%" height={14} />
        </div>
      ) : (
        children
      )}
    </aside>
  );
}
