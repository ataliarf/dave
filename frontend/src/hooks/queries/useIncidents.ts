import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { IncidentsListResponse } from "@dave/shared";
import { getIncidents, type IncidentsParams } from "../../api/incidents";
import { ApiError } from "../../api/errors";
import { qk } from "./queryKeys";

export function useIncidents(params: IncidentsParams) {
  return useQuery<IncidentsListResponse, ApiError>({
    queryKey: qk.incidents(params),
    queryFn: () => getIncidents(params),
    placeholderData: keepPreviousData,
  });
}
