import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Dependency, Tier, TopologyEdge, TopologyNode, TopologyResponse } from "@dave/shared";
import { expandTopology } from "../api/topology";
import { ApiError } from "../api/errors";
import { useTopology } from "./queries/useTopology";
import { qk } from "./queries/queryKeys";

const SEED_LIMIT = 10;
const EXPAND_STALE_MS = 30_000;

interface SubgraphFilters {
  teams: string[];
  tiers: Tier[];
}

interface ExtraState {
  filterKey: string;
  nodes: Map<string, TopologyNode>;
  edges: Map<string, TopologyEdge>;
  expandedIds: Set<string>;
}

function emptyExtraFor(filterKey: string): ExtraState {
  return {
    filterKey,
    nodes: new Map(),
    edges: new Map(),
    expandedIds: new Set(),
  };
}

function edgeKey(e: Pick<Dependency, "from" | "to">): string {
  return `${e.from}->${e.to}`;
}

export function useTopologySubgraph(filters: SubgraphFilters) {
  const qc = useQueryClient();
  const seed = useTopology({
    teams: filters.teams,
    tiers: filters.tiers,
    limit: SEED_LIMIT,
  });

  const filterKey = `${filters.teams.join(",")}|${filters.tiers.join(",")}`;

  const [extra, setExtra] = useState<ExtraState>(() => emptyExtraFor(filterKey));
  const [expandingIds, setExpandingIds] = useState<Set<string>>(new Set());
  const [expandError, setExpandError] = useState<string | null>(null);

  const lastFilterKey = useRef(filterKey);
  useEffect(() => {
    if (lastFilterKey.current !== filterKey) {
      lastFilterKey.current = filterKey;
      setExtra(emptyExtraFor(filterKey));
      setExpandingIds(new Set());
      setExpandError(null);
    }
  }, [filterKey]);

  const liveExtra = extra.filterKey === filterKey ? extra : null;

  const topology: TopologyResponse | undefined = useMemo(() => {
    if (!seed.data) return undefined;

    const nodes = new Map<string, TopologyNode>();
    const edges = new Map<string, TopologyEdge>();

    for (const n of seed.data.nodes) nodes.set(n.id, n);
    for (const e of seed.data.edges) edges.set(edgeKey(e), e);

    if (liveExtra) {
      for (const [id, n] of liveExtra.nodes) {
        if (!nodes.has(id)) nodes.set(id, n);
      }
      for (const [k, e] of liveExtra.edges) {
        if (!edges.has(k)) edges.set(k, e);
      }
    }

    const allNodes = Array.from(nodes.values());
    const matchedShown = allNodes.reduce((count, n) => (n.matchesFilter ? count + 1 : count), 0);

    return {
      nodes: allNodes,
      edges: Array.from(edges.values()),
      truncated: matchedShown < seed.data.totalNodes,
      totalNodes: seed.data.totalNodes,
    };
  }, [seed.data, liveExtra]);

  const expand = useCallback(
    async (nodeId: string) => {
      if (liveExtra?.expandedIds.has(nodeId) || expandingIds.has(nodeId)) return;

      setExpandingIds((prev) => {
        const next = new Set(prev);
        next.add(nodeId);
        return next;
      });
      setExpandError(null);

      try {
        const expandParams = {
          nodeId,
          teams: filters.teams,
          tiers: filters.tiers,
        };
        const data = await qc.fetchQuery({
          queryKey: qk.topologyExpand(expandParams),
          queryFn: () => expandTopology(expandParams),
          staleTime: EXPAND_STALE_MS,
        });

        setExtra((prev) => {
          if (prev.filterKey !== filterKey) return prev;
          const nodes = new Map(prev.nodes);
          const edges = new Map(prev.edges);
          for (const n of data.nodes) {
            if (!nodes.has(n.id)) nodes.set(n.id, n);
          }
          for (const e of data.edges) {
            const k = edgeKey(e);
            if (!edges.has(k)) edges.set(k, e);
          }
          const expandedIds = new Set(prev.expandedIds);
          expandedIds.add(nodeId);
          return { filterKey: prev.filterKey, nodes, edges, expandedIds };
        });
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to expand neighbors";
        setExpandError(message);
      } finally {
        setExpandingIds((prev) => {
          const next = new Set(prev);
          next.delete(nodeId);
          return next;
        });
      }
    },
    [qc, liveExtra, expandingIds, filterKey, filters.teams, filters.tiers],
  );

  const isExpanded = useCallback(
    (id: string) => liveExtra?.expandedIds.has(id) ?? false,
    [liveExtra],
  );
  const isExpanding = useCallback((id: string) => expandingIds.has(id), [expandingIds]);

  return {
    topology,
    isLoading: seed.isLoading,
    isError: seed.isError,
    error: seed.error,
    isFetching: seed.isFetching,
    expand,
    isExpanded,
    isExpanding,
    expandError,
    clearExpandError: () => setExpandError(null),
  };
}
