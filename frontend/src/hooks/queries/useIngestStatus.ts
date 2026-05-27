import { useQuery } from "@tanstack/react-query";
import type { IngestStatusResponse } from "@dave/shared";
import { getIngestStatus } from "../../api/ingest";
import { ApiError } from "../../api/errors";
import { INGEST_POLL_INTERVAL_MS } from "../../lib/consts";
import { qk } from "./queryKeys";

export function useIngestStatus() {
  return useQuery<IngestStatusResponse, ApiError>({
    queryKey: qk.ingestStatus(),
    queryFn: getIngestStatus,
    refetchInterval: (query) => {
      const data = query.state.data;
      return data && "status" in data && data.status === "running"
        ? INGEST_POLL_INTERVAL_MS
        : false;
    },
    staleTime: 0,
  });
}
