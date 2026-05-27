import { Checkbox } from "./Checkbox";
import styles from "./CheckboxGroup.module.scss";
import type { CheckboxGroupProps } from "./types";

export function CheckboxGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  emptyLabel = "No options available",
}: CheckboxGroupProps<T>) {
  const selected = new Set(value);

  const toggle = (v: T, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(v);
    else next.delete(v);
    onChange(Array.from(next));
  };

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      {options.length === 0 ? (
        <p className={styles.empty}>{emptyLabel}</p>
      ) : (
        <div className={styles.list}>
          {options.map((opt) => (
            <Checkbox
              key={opt.value}
              id={`${legend}-${opt.value}`}
              label={opt.label}
              checked={selected.has(opt.value)}
              onChange={(c) => toggle(opt.value, c)}
            />
          ))}
        </div>
      )}
    </fieldset>
  );
}
