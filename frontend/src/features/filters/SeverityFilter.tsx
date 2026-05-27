import type { Severity } from "@dave/shared";
import { CheckboxGroup } from "../../ui/CheckboxGroup/CheckboxGroup";

interface Props {
  options: Severity[];
  value: Severity[];
  onChange: (next: Severity[]) => void;
}

export function SeverityFilter({ options, value, onChange }: Props) {
  return (
    <CheckboxGroup<Severity>
      legend="Severity"
      options={options.map((s) => ({ value: s, label: s }))}
      value={value}
      onChange={onChange}
      emptyLabel="No severities yet"
    />
  );
}
