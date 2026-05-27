import type { Service } from "../domain/service.js";
import type { Incident } from "../domain/incident.js";
import type { DependencyType, Criticality } from "../domain/dependency.js";

export interface DirectNeighbor {
  id: string;
  name: string;
  team: string;
  type: DependencyType;
  criticality: Criticality;
}

export interface ServiceDetailsResponse {
  service: Service;
  /** Services that call this one (depth = 1). */
  directUpstream: DirectNeighbor[];
  /** Services this one calls (depth = 1). */
  directDownstream: DirectNeighbor[];
  /** Incidents on this service from the last 7 days, newest first. */
  recentIncidents: Incident[];
}

export interface BlastRadiusNode {
  id: string;
  distance: number;
}

export interface BlastRadiusResponse {
  /** Services that transitively depend on this one (callers of callers...). */
  upstream: BlastRadiusNode[];
  /** Services this one transitively depends on. */
  downstream: BlastRadiusNode[];
}
