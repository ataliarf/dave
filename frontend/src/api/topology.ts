import type { TopologyExpandResponse, TopologyResponse } from "@dave/shared";
import { apiFetch } from "./client";

export interface TopologyParams {
  teams?: string[];
  tiers?: string[];
  limit?: number;
}

export function getTopology(params: TopologyParams): Promise<TopologyResponse> {
  const search = new URLSearchParams();
  if (params.teams && params.teams.length > 0) search.set("teams", params.teams.join(","));
  if (params.tiers && params.tiers.length > 0) search.set("tiers", params.tiers.join(","));
  if (params.limit != null) search.set("limit", String(params.limit));
  const qs = search.toString();
  return apiFetch<TopologyResponse>(`/topology${qs ? `?${qs}` : ""}`);
}

export interface TopologyExpandParams {
  nodeId: string;
  teams?: string[];
  tiers?: string[];
}

export function expandTopology(params: TopologyExpandParams): Promise<TopologyExpandResponse> {
  const search = new URLSearchParams({ nodeId: params.nodeId });
  if (params.teams && params.teams.length > 0) search.set("teams", params.teams.join(","));
  if (params.tiers && params.tiers.length > 0) search.set("tiers", params.tiers.join(","));
  return apiFetch<TopologyExpandResponse>(`/topology/expand?${search.toString()}`);
}
