import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useBlastRadius } from "../../hooks/queries/useBlastRadius";
import { useBlastRadiusFlag } from "../../hooks/useBlastRadiusFlag";
import { useFilterOptions } from "../../hooks/queries/useFilterOptions";
import { useIngestStatus } from "../../hooks/queries/useIngestStatus";
import { useSelectedService } from "../../hooks/useSelectedService";
import { useTopologyFilters } from "../../hooks/useTopologyFilters";
import { useTopologySubgraph } from "../../hooks/useTopologySubgraph";
import { Spinner } from "../../ui/Spinner/Spinner";
import { buildBlastClassifier } from "../blast-radius/utils/blastHighlight";
import { TopologyFiltersPanel } from "../filters/TopologyFiltersPanel";
import { ServiceDetailDrawer } from "../service-detail/ServiceDetailDrawer";
import { EmptyTopology, type EmptyTopologyVariant } from "./EmptyTopology";
import { TopologyCanvas } from "./TopologyCanvas";
import { TruncatedBanner } from "./TruncatedBanner";
import styles from "./TopologyTab.module.scss";

export function TopologyTab() {
  const { filters, setFilters, clear, hasAny } = useTopologyFilters();
  const { id: selectedId, select } = useSelectedService();
  const { enabled: blastEnabled, set: setBlastEnabled } = useBlastRadiusFlag();

  const filterOpts = useFilterOptions();
  const {
    topology,
    isLoading,
    isError,
    error,
    isFetching,
    expand,
    isExpanding,
    expandError,
    clearExpandError,
  } = useTopologySubgraph({
    teams: filters.teams,
    tiers: filters.tiers,
  });
  const blastQuery = useBlastRadius(selectedId, blastEnabled);
  const { data: ingest } = useIngestStatus();

  const blast = useMemo(
    () => buildBlastClassifier(blastQuery.data, selectedId, blastEnabled && !!blastQuery.data),
    [blastQuery.data, selectedId, blastEnabled],
  );

  useEffect(() => {
    if (blastQuery.isError && blastQuery.error) {
      toast.error(`Could not load blast radius: ${blastQuery.error.message}. Please try again.`, {
        id: "blast-radius-error",
      });
      setBlastEnabled(false);
    }
  }, [blastQuery.isError, blastQuery.error, setBlastEnabled]);

  useEffect(() => {
    if (expandError) {
      toast.error(`Could not expand neighbors: ${expandError}. Please try again.`, {
        id: "topology-expand-error",
      });
      clearExpandError();
    }
  }, [expandError, clearExpandError]);

  useEffect(() => {
    if (selectedId) {
      void expand(selectedId);
    }
  }, [selectedId, expand]);

  const emptyVariant: EmptyTopologyVariant | null = (() => {
    if (!topology || topology.nodes.length === 0) {
      if (ingest && "status" in ingest && ingest.status === "running") return "ingesting";
      if (!ingest || ingest.status === "idle") return "pre-ingest";
      if (hasAny) return "no-match";
      return "pre-ingest";
    }
    return null;
  })();

  return (
    <div className={styles.layout}>
      <TopologyFiltersPanel
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
          <div className={styles.error}>Failed to load topology: {error?.message}</div>
        ) : null}

        {topology?.truncated ? (
          <TruncatedBanner
            shown={topology.nodes.reduce((count, n) => (n.matchesFilter ? count + 1 : count), 0)}
            total={topology.totalNodes}
          />
        ) : null}

        {isLoading ? (
          <div className={styles.loading}>
            <Spinner size={20} />
            <span>Loading topology…</span>
          </div>
        ) : emptyVariant ? (
          <EmptyTopology variant={emptyVariant} onClearFilters={hasAny ? clear : undefined} />
        ) : topology ? (
          <TopologyCanvas
            topology={topology}
            selectedId={selectedId}
            blast={blast}
            onSelect={select}
            onExpand={expand}
            isExpanding={isExpanding}
          />
        ) : null}

        {isFetching && !isLoading ? (
          <div className={styles.fetching} aria-live="polite">
            <Spinner size={12} /> updating…
          </div>
        ) : null}
      </div>

      <ServiceDetailDrawer />
    </div>
  );
}
