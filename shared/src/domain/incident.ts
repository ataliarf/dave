export const SEVERITIES = ["sev1", "sev2", "sev3", "sev4"] as const;
export type Severity = (typeof SEVERITIES)[number];

/**
 * Incident lifecycle states derived from `resolvedAt`:
 *   - 'ongoing'  -> resolvedAt IS NULL
 *   - 'resolved' -> resolvedAt IS NOT NULL
 * Closed enum on purpose: there's nothing in between in the data contract.
 */
export const INCIDENT_STATUSES = ["ongoing", "resolved"] as const;
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export interface Incident {
  id: string;
  serviceId: string;
  startedAt: string;
  resolvedAt: string | null;
  severity: Severity;
  title: string;
}
