import type { Criticality, DependencyType } from "@dave/shared";

export interface EdgeStyle {
  strokeWidth: number;
  strokeDasharray?: string;
}

const WIDTH_BY_CRITICALITY: Record<Criticality, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const DASH_BY_TYPE: Record<DependencyType, string | undefined> = {
  sync_http: undefined,
  async_queue: "6 4",
  db_read: "2 3",
  db_write: "10 4",
};

export function edgeStyle(type: DependencyType, criticality: Criticality): EdgeStyle {
  return {
    strokeWidth: WIDTH_BY_CRITICALITY[criticality],
    strokeDasharray: DASH_BY_TYPE[type],
  };
}
