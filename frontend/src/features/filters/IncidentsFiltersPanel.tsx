import type { FilterOptionsResponse } from "@dave/shared";
import { FilterPanelShell } from "./FilterPanelShell";
import type { IncidentsFilters, IncidentsFiltersPatch } from "../../hooks/useIncidentsFilters";
import { SeverityFilter } from "./SeverityFilter";
import { ServiceFilter } from "./ServiceFilter";
import { StatusFilter } from "./StatusFilter";

interface Props {
  options: Pick<FilterOptionsResponse, "severities" | "services"> | undefined;
  filters: IncidentsFilters;
  onChange: (patch: IncidentsFiltersPatch) => void;
  onClear: () => void;
  hasAny: boolean;
  loading: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export function IncidentsFiltersPanel({
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
      <SeverityFilter
        options={options?.severities ?? []}
        value={filters.severities}
        onChange={(severities) => onChange({ severities })}
      />
      <StatusFilter value={filters.status} onChange={(status) => onChange({ status })} />
      <ServiceFilter
        options={options?.services ?? []}
        value={filters.serviceId}
        onChange={(serviceId) => onChange({ serviceId })}
      />
    </FilterPanelShell>
  );
}
