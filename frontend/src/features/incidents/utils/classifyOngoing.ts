import type { Incident } from "@dave/shared";
import type { IncidentRowVm } from "../types";

export function toRowVm(incident: Incident, now: Date): IncidentRowVm {
  const started = new Date(incident.startedAt).getTime();
  const ended = incident.resolvedAt ? new Date(incident.resolvedAt).getTime() : now.getTime();
  return {
    incident,
    status: incident.resolvedAt ? "resolved" : "ongoing",
    durationMs: Math.max(0, ended - started),
  };
}
