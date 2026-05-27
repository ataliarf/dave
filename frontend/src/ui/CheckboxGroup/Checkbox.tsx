import styles from "./CheckboxGroup.module.scss";
import type { CheckboxProps } from "./types";

export function Checkbox({ id, label, checked, onChange }: CheckboxProps) {
  return (
    <label className={styles.row} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
