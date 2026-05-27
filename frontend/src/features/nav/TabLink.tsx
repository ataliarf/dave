import { NavLink } from "react-router-dom";
import { cx } from "../../utils/classNames";
import styles from "./TabNav.module.scss";

interface Props {
  to: string;
  label: string;
  disabled?: boolean;
  badge?: string;
}

export function TabLink({ to, label, disabled, badge }: Props) {
  if (disabled) {
    return (
      <span
        className={cx(styles.tab, styles.disabled)}
        aria-disabled="true"
        title={badge ? `${label} — ${badge}` : undefined}
      >
        {label}
        {badge ? <span className={styles.badge}>{badge}</span> : null}
      </span>
    );
  }

  return (
    <NavLink end to={to} className={({ isActive }) => cx(styles.tab, isActive && styles.active)}>
      {label}
      {badge ? <span className={styles.badge}>{badge}</span> : null}
    </NavLink>
  );
}
