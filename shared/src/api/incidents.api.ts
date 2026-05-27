import type { Incident } from "../domain/incident.js";

export interface IncidentsListResponse {
  items: Incident[];
  total: number;
  hasMore: boolean;
}
