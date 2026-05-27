import { cx } from "../../utils/classNames";
import styles from "./Badge.module.scss";
import { SEVERITY_CLASS, TIER_CLASS } from "./consts";
import type { BadgeProps } from "./types";

export function Badge(props: BadgeProps) {
  const { children, className } = props;

  if (props.tone === "tier") {
    return (
      <span className={cx(styles.badge, styles[TIER_CLASS[props.value]], className)}>
        {children}
      </span>
    );
  }

  if (props.tone === "severity") {
    return (
      <span className={cx(styles.badge, styles[SEVERITY_CLASS[props.value]], className)}>
        {children}
      </span>
    );
  }

  if (props.tone === "team") {
    const bucket = ((props.bucket % 8) + 8) % 8 || 8;
    return (
      <span className={cx(styles.badge, styles.team, className)}>
        <span className={styles.teamDot} style={{ background: `var(--team-${bucket})` }} />
        {children}
      </span>
    );
  }

  return <span className={cx(styles.badge, styles.neutral, className)}>{children}</span>;
}
