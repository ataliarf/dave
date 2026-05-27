import type { Service } from "../domain/service.js";
import type { Dependency } from "../domain/dependency.js";

export interface TopologyNode extends Service {
  matchesFilter: boolean;
  /**
   * Total number of distinct neighbors of this service in the full graph
   * (both upstream and downstream, counted once each). Used by the frontend
   * to decide whether the expand-neighbors button is meaningful — if all of
   * a node's neighbors are already visible on the canvas, there's nothing
   * more to fetch and the + is hidden.
   */
  degree: number;
}

export type TopologyEdge = Dependency;

export interface TopologyResponse {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  truncated: boolean;
  totalNodes: number;
}

export interface TopologyExpandResponse {
  nodes: TopologyNode[];
  edges: Dependency[];
}
