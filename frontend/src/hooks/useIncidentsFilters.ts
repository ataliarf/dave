import { useCallback, useMemo } from "react";
import { INCIDENT_STATUSES, SEVERITIES, type IncidentStatus, type Severity } from "@dave/shared";
import { DEFAULT_PAGE_SIZE } from "../lib/consts";
import { readListParam, useTypedSearchParams, writeListParam } from "./useTypedSearchParams";

const SEV_SET = new Set<string>(SEVERITIES);
const STATUS_SET = new Set<string>(INCIDENT_STATUSES);

export interface IncidentsFilters {
  severities: Severity[];
  serviceId: string | null;
  status: IncidentStatus | null;
  page: number;
  pageSize: number;
}

export type IncidentsFiltersPatch = Partial<{
  severities: Severity[];
  serviceId: string | null;
  status: IncidentStatus | null;
}>;

const setOrDelete = (p: URLSearchParams, key: string, value: string | null) => {
  if (value) p.set(key, value);
  else p.delete(key);
};

const SERIALIZERS: {
  [K in keyof IncidentsFiltersPatch]-?: (
    p: URLSearchParams,
    v: NonNullable<IncidentsFiltersPatch[K]>,
  ) => void;
} = {
  severities: (p, v) => {
    writeListParam(p, "severities", v);
  },
  serviceId: (p, v) => setOrDelete(p, "serviceId", v),
  status: (p, v) => setOrDelete(p, "status", v),
};

export function useIncidentsFilters() {
  const { params, update } = useTypedSearchParams();

  const filters = useMemo<IncidentsFilters>(() => {
    const severities = readListParam(params, "severities").filter(
      (s): s is Severity => SEV_SET.has(s),
    );
    const serviceId = params.get("serviceId") || null;
    const statusRaw = params.get("status");
    const status: IncidentStatus | null =
      statusRaw && STATUS_SET.has(statusRaw) ? (statusRaw as IncidentStatus) : null;
    const pageRaw = Number(params.get("page"));
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
    return { severities, serviceId, status, page, pageSize: DEFAULT_PAGE_SIZE };
  }, [params]);

  const setFilters = useCallback(
    (patch: IncidentsFiltersPatch) => {
      update((p) => {
        for (const key of Object.keys(patch) as (keyof IncidentsFiltersPatch)[]) {
          const value = patch[key];
          const serialize = SERIALIZERS[key] as (p: URLSearchParams, v: unknown) => void;
          serialize(p, value as unknown);
        }
        p.delete("page");
        return p;
      });
    },
    [update],
  );

  const setPage = useCallback(
    (page: number) =>
      update((p) => {
        if (page <= 1) p.delete("page");
        else p.set("page", String(page));
        return p;
      }),
    [update],
  );

  const clear = useCallback(() => {
    update((p) => {
      p.delete("severities");
      p.delete("serviceId");
      p.delete("status");
      p.delete("page");
      return p;
    });
  }, [update]);

  const hasAny =
    filters.severities.length > 0 || filters.serviceId !== null || filters.status !== null;

  return { filters, setFilters, setPage, clear, hasAny };
}
