import type { Service, DependencyType, Criticality } from "@dave/shared";
import type { BlastClassification } from "../blast-radius/types";

export type RFNodeData = {
  service: Service;
  matchesFilter: boolean;
  selected: boolean;
  blast: BlastClassification;
  teamBucket: number;
  canExpand: boolean;
  isExpanding: boolean;
  onExpand?: (id: string) => void;
} & Record<string, unknown>;

export type RFEdgeData = {
  type: DependencyType;
  criticality: Criticality;
  blast: BlastClassification;
} & Record<string, unknown>;
