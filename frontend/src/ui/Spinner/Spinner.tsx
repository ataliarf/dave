import { cx } from "../../utils/classNames";
import styles from "./Spinner.module.scss";

interface Props {
  size?: number;
  className?: string;
  label?: string;
}

export function Spinner({ size = 16, className, label = "Loading" }: Props) {
  return (
    <span
      className={cx(styles.spinner, className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label={label}
    />
  );
}
