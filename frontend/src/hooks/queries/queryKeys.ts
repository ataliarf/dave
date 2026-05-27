import type { TopologyExpandParams, TopologyParams } from "../../api/topology";
import type { IncidentsParams } from "../../api/incidents";

export const qk = {
  ingestStatus: () => ["ingestStatus"] as const,
  filters: () => ["filters"] as const,
  topology: (params: TopologyParams) => ["topology", params] as const,
  topologyExpand: (params: TopologyExpandParams) => ["topology", "expand", params] as const,
  service: (id: string) => ["service", id] as const,
  blast: (id: string) => ["blast", id] as const,
  incidents: (params: IncidentsParams) => ["incidents", params] as const,
};

/** Prefixes used by `useStartIngest` to invalidate everything that depends on
 * graph + incident state after a successful ingest. */
export const INVALIDATE_AFTER_INGEST = [
  ["topology"],
  ["service"],
  ["blast"],
  ["incidents"],
  ["filters"],
] as const;
