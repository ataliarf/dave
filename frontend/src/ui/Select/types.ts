import type { SelectHTMLAttributes } from "react";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SelectProps<T extends string = string> extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "onChange" | "value"
> {
  value: T | "";
  onChange: (value: T | "") => void;
  options: SelectOption<T>[];
  label?: string;
}
