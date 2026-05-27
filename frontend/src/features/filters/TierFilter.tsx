import type { Tier } from "@dave/shared";
import { CheckboxGroup } from "../../ui/CheckboxGroup/CheckboxGroup";

interface Props {
  options: Tier[];
  value: Tier[];
  onChange: (next: Tier[]) => void;
}

export function TierFilter({ options, value, onChange }: Props) {
  return (
    <CheckboxGroup<Tier>
      legend="Tier"
      options={options.map((t) => ({ value: t, label: t }))}
      value={value}
      onChange={onChange}
      emptyLabel="No tiers — run an ingest"
    />
  );
}
