import { Select } from "../../ui/Select/Select";

interface Props {
  options: { id: string; name: string }[];
  value: string | null;
  onChange: (id: string | null) => void;
}

export function ServiceFilter({ options, value, onChange }: Props) {
  const selectOptions = [
    { value: "", label: "All services" },
    ...options.map((s) => ({ value: s.id, label: s.name })),
  ];
  return (
    <Select
      label="Service"
      value={value ?? ""}
      onChange={(v) => onChange(v === "" ? null : v)}
      options={selectOptions}
    />
  );
}
