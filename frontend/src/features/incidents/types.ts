import type { Incident, IncidentStatus } from "@dave/shared";

export interface IncidentRowVm {
  incident: Incident;
  status: IncidentStatus;
  durationMs: number;
}

export type ColumnKey = "severity" | "title" | "service" | "started" | "resolved" | "duration";
