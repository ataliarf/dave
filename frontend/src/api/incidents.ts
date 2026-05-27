import type { IncidentStatus, IncidentsListResponse } from "@dave/shared";
import { apiFetch } from "./client";

export interface IncidentsParams {
  serviceId?: string;
  severities?: string[];
  status?: IncidentStatus;
  page: number;
  pageSize: number;
}

export function getIncidents(params: IncidentsParams): Promise<IncidentsListResponse> {
  const search = new URLSearchParams();
  if (params.serviceId) search.set("serviceId", params.serviceId);
  if (params.severities && params.severities.length > 0)
    search.set("severities", params.severities.join(","));
  if (params.status) search.set("status", params.status);
  search.set("page", String(params.page));
  search.set("pageSize", String(params.pageSize));
  return apiFetch<IncidentsListResponse>(`/incidents?${search.toString()}`);
}
