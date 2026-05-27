export const DEPENDENCY_TYPES = ["sync_http", "async_queue", "db_read", "db_write"] as const;
export type DependencyType = (typeof DEPENDENCY_TYPES)[number];

export const CRITICALITIES = ["high", "medium", "low"] as const;
export type Criticality = (typeof CRITICALITIES)[number];

export interface Dependency {
  from: string;
  to: string;
  type: DependencyType;
  criticality: Criticality;
}
