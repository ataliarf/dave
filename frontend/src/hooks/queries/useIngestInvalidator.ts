import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { IngestStatus } from "@dave/shared";
import { useIngestStatus } from "./useIngestStatus";
import { INVALIDATE_AFTER_INGEST } from "./queryKeys";

const TERMINAL_STATUSES: ReadonlySet<IngestStatus> = new Set(["succeeded", "partial", "failed"]);

export function useIngestInvalidator() {
  const qc = useQueryClient();
  const { data } = useIngestStatus();
  const prevRunRef = useRef<{ id: string | null; status: IngestStatus | "idle" | null }>({
    id: null,
    status: null,
  });

  useEffect(() => {
    if (!data) return;

    const status = data.status;
    const id = "id" in data ? data.id : null;
    const prev = prevRunRef.current;

    const isTerminal = status !== "idle" && TERMINAL_STATUSES.has(status);
    const sameRun = id !== null && id === prev.id;
    const wasRunning = prev.status === "running";
    const newTerminalRun = isTerminal && id !== null && id !== prev.id;

    if ((sameRun && wasRunning && isTerminal) || newTerminalRun) {
      for (const key of INVALIDATE_AFTER_INGEST) {
        qc.invalidateQueries({ queryKey: [...key] });
      }
    }

    prevRunRef.current = { id, status };
  }, [data, qc]);
}
