import { useMemo } from "react";
import { Spinner } from "../../ui/Spinner/Spinner";
import { useFilterOptions } from "../../hooks/queries/useFilterOptions";
import { useIncidents } from "../../hooks/queries/useIncidents";
import { useIncidentsFilters } from "../../hooks/useIncidentsFilters";
import { useIngestStatus } from "../../hooks/queries/useIngestStatus";
import { EmptyIncidents, type EmptyIncidentsVariant } from "./EmptyIncidents";
import { IncidentsFiltersPanel } from "../filters/IncidentsFiltersPanel";
import { IncidentsPagination } from "./IncidentsPagination";
import { IncidentsTable } from "./IncidentsTable";
import styles from "./IncidentsTab.module.scss";

export function IncidentsTab() {
  const { filters, setFilters, setPage, clear, hasAny } = useIncidentsFilters();
  const filterOpts = useFilterOptions();
  const { data: ingest } = useIngestStatus();

  const { data, isLoading, isFetching, isError, error } = useIncidents({
    serviceId: filters.serviceId ?? undefined,
    severities: filters.severities,
    status: filters.status ?? undefined,
    page: filters.page,
    pageSize: filters.pageSize,
  });

  const serviceMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of filterOpts.data?.services ?? []) m.set(s.id, s.name);
    return m;
  }, [filterOpts.data]);

  const emptyVariant: EmptyIncidentsVariant | null = (() => {
    if (!data || data.total > 0) return null;
    if (hasAny) return "no-match";
    if (!ingest || ingest.status === "idle") return "pre-ingest";
    if (filterOpts.data && filterOpts.data.services.length === 0) return "pre-ingest";
    return "no-data";
  })();

  return (
    <div className={styles.layout}>
      <IncidentsFiltersPanel
        options={filterOpts.data}
        filters={filters}
        onChange={setFilters}
        onClear={clear}
        hasAny={hasAny}
        loading={filterOpts.isLoading}
        error={filterOpts.isError}
        onRetry={() => void filterOpts.refetch()}
      />

      <div className={styles.main}>
        {isError ? (
          <div className={styles.error}>Failed to load incidents: {error?.message}</div>
        ) : null}

        <div className={styles.body}>
          {isLoading && !data ? (
            <div className={styles.loading}>
              <Spinner size={20} /> Loading incidents…
            </div>
          ) : emptyVariant ? (
            <EmptyIncidents variant={emptyVariant} onClear={hasAny ? clear : undefined} />
          ) : data ? (
            <>
              <div className={styles.tableWrap}>
                <IncidentsTable
                  incidents={data.items}
                  serviceMap={serviceMap}
                  loading={isFetching}
                  pageSize={filters.pageSize}
                />
              </div>
              <IncidentsPagination
                page={filters.page}
                pageSize={filters.pageSize}
                total={data.total}
                hasMore={data.hasMore}
                onPageChange={setPage}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
