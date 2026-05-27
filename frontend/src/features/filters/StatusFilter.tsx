import type { IncidentStatus } from "@dave/shared";
import { Select } from "../../ui/Select/Select";

interface Props {
  value: IncidentStatus | null;
  onChange: (next: IncidentStatus | null) => void;
}

const OPTIONS: { value: "" | IncidentStatus; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "ongoing", label: "Ongoing only" },
  { value: "resolved", label: "Resolved only" },
];

export function StatusFilter({ value, onChange }: Props) {
  return (
    <Select
      label="Status"
      value={value ?? ""}
      onChange={(v) => onChange(v === "" ? null : (v as IncidentStatus))}
      options={OPTIONS}
    />
  );
}
