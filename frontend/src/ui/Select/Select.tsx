import { cx } from "../../utils/classNames";
import styles from "./Select.module.scss";
import type { SelectProps } from "./types";

export function Select<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
  ...rest
}: SelectProps<T>) {
  return (
    <label className={cx(styles.wrap, className)}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value as T | "")}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value || "__empty__"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
