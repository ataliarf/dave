import { useQuery } from "@tanstack/react-query";
import type { FilterOptionsResponse } from "@dave/shared";
import { getFilterOptions } from "../../api/filters";
import { ApiError } from "../../api/errors";
import { qk } from "./queryKeys";

export function useFilterOptions() {
  return useQuery<FilterOptionsResponse, ApiError>({
    queryKey: qk.filters(),
    queryFn: getFilterOptions,
  });
}
