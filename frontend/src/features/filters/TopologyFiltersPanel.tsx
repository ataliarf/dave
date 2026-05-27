import type { FilterOptionsResponse } from "@dave/shared";
import type { TopologyFilters, TopologyFiltersPatch } from "../../hooks/useTopologyFilters";
import { FilterPanelShell } from "./FilterPanelShell";
import { TeamFilter } from "./TeamFilter";
import { TierFilter } from "./TierFilter";

interface Props {
  options: Pick<FilterOptionsResponse, "teams" | "tiers"> | undefined;
  filters: TopologyFilters;
  onChange: (patch: TopologyFiltersPatch) => void;
  onClear: () => void;
  hasAny: boolean;
  loading: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export function TopologyFiltersPanel({
  options,
  filters,
  onChange,
  onClear,
  hasAny,
  loading,
  error,
  onRetry,
}: Props) {
  return (
    <FilterPanelShell
      hasAny={hasAny}
      onClear={onClear}
      loading={loading}
      error={error}
      onRetry={onRetry}
    >
      <TierFilter
        options={options?.tiers ?? []}
        value={filters.tiers}
        onChange={(tiers) => onChange({ tiers })}
      />
      <TeamFilter
        options={options?.teams ?? []}
        value={filters.teams}
        onChange={(teams) => onChange({ teams })}
      />
    </FilterPanelShell>
  );
}
