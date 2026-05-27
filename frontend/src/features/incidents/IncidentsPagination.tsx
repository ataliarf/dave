import { Button } from "../../ui/Button/Button";
import { cx } from "../../utils/classNames";
import styles from "./IncidentsPagination.module.scss";

interface Props {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

export function IncidentsPagination({ page, pageSize, total, hasMore, onPageChange }: Props) {
  if (total === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasMultiplePages = totalPages > 1;
  const showPrev = page > 1;
  const showNext = hasMore;

  return (
    <div className={styles.bar}>
      <span className={styles.summary}>
        Showing <strong>{start}</strong>–<strong>{end}</strong> of <strong>{total}</strong>
      </span>
      {hasMultiplePages ? (
        <div className={styles.controls}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(page - 1)}
            className={cx(!showPrev && styles.hiddenSlot)}
            aria-hidden={!showPrev}
            tabIndex={showPrev ? undefined : -1}
          >
            ← Prev
          </Button>
          <span className={styles.page}>
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(page + 1)}
            className={cx(!showNext && styles.hiddenSlot)}
            aria-hidden={!showNext}
            tabIndex={showNext ? undefined : -1}
          >
            Next →
          </Button>
        </div>
      ) : null}
    </div>
  );
}
