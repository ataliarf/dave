import { useCallback, useMemo } from "react";
import { TIERS, type Tier } from "@dave/shared";
import { readListParam, useTypedSearchParams, writeListParam } from "./useTypedSearchParams";

const TIER_SET = new Set<string>(TIERS);

export interface TopologyFilters {
  teams: string[];
  tiers: Tier[];
}

export type TopologyFiltersPatch = Partial<TopologyFilters>;

const SERIALIZERS: {
  [K in keyof TopologyFiltersPatch]-?: (
    p: URLSearchParams,
    v: NonNullable<TopologyFiltersPatch[K]>,
  ) => void;
} = {
  teams: (p, v) => {
    writeListParam(p, "teams", v);
  },
  tiers: (p, v) => {
    writeListParam(p, "tiers", v);
  },
};

export function useTopologyFilters() {
  const { params, update } = useTypedSearchParams();

  const filters = useMemo<TopologyFilters>(() => {
    const teams = readListParam(params, "teams");
    const tiers = readListParam(params, "tiers").filter((t): t is Tier => TIER_SET.has(t));
    return { teams, tiers };
  }, [params]);

  const setFilters = useCallback(
    (patch: TopologyFiltersPatch) => {
      update((p) => {
        for (const key of Object.keys(patch) as (keyof TopologyFiltersPatch)[]) {
          const value = patch[key];
          const serialize = SERIALIZERS[key] as (p: URLSearchParams, v: unknown) => void;
          serialize(p, value as unknown);
        }
        return p;
      });
    },
    [update],
  );

  const clear = useCallback(() => {
    update((p) => {
      p.delete("teams");
      p.delete("tiers");
      return p;
    });
  }, [update]);

  const hasAny = filters.teams.length > 0 || filters.tiers.length > 0;

  return { filters, setFilters, clear, hasAny };
}
