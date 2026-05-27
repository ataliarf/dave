export interface CheckboxOption<T extends string = string> {
  value: T;
  label: string;
}

export interface CheckboxGroupProps<T extends string = string> {
  legend: string;
  options: CheckboxOption<T>[];
  value: T[];
  onChange: (next: T[]) => void;
  emptyLabel?: string;
}

export interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
