import styles from "./TruncatedBanner.module.scss";

interface Props {
  shown: number;
  total: number;
}

export function TruncatedBanner({ shown, total }: Props) {
  return (
    <div className={styles.banner} role="status">
      Showing <strong>{shown}</strong> of <strong>{total}</strong> services. Click{" "}
      <strong>+</strong> on any node to pull its neighbors onto the canvas.
    </div>
  );
}
