import { cx } from "../../utils/classNames";
import styles from "./StatusDot.module.scss";
import type { StatusDotState } from "./consts";

interface Props {
  state: StatusDotState;
  pulse?: boolean;
  className?: string;
}

export function StatusDot({ state, pulse, className }: Props) {
  return <span className={cx(styles.dot, styles[state], pulse && styles.pulse, className)} />;
}
