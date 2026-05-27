import type { Tier } from "../domain/service.js";
import type { Severity } from "../domain/incident.js";

/**
 * Available filter options derived from the data currently in the stores.
 * Returned by GET /api/filters. The frontend uses this to populate filter
 * dropdowns/checkboxes so the UI reflects what's actually present rather
 * than the full schema enums.
 */
export interface FilterOptionsResponse {
  /** Distinct team values currently in Neo4j, sorted alphabetically. */
  teams: string[];
  /** Distinct tiers currently in Neo4j (subset of TIERS). */
  tiers: Tier[];
  /** Distinct severities currently in Postgres incidents (subset of SEVERITIES). */
  severities: Severity[];
  /** All services as id+name pairs, for the Incidents-tab service-filter dropdown. */
  services: { id: string; name: string }[];
}
