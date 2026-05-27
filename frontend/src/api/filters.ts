import type { FilterOptionsResponse } from "@dave/shared";
import { apiFetch } from "./client";

export function getFilterOptions(): Promise<FilterOptionsResponse> {
  return apiFetch<FilterOptionsResponse>("/filters");
}
