import { CheckboxGroup } from "../../ui/CheckboxGroup/CheckboxGroup";

interface Props {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
}

export function TeamFilter({ options, value, onChange }: Props) {
  return (
    <CheckboxGroup
      legend="Team"
      options={options.map((t) => ({ value: t, label: t }))}
      value={value}
      onChange={onChange}
      emptyLabel="No teams — run an ingest"
    />
  );
}
