import type { IngestStatusResponse, StartIngestResponse } from "@dave/shared";
import { apiFetch } from "./client";

export function getIngestStatus(): Promise<IngestStatusResponse> {
  return apiFetch<IngestStatusResponse>("/ingest/status");
}

export function startIngest(): Promise<StartIngestResponse> {
  return apiFetch<StartIngestResponse>("/ingest", { method: "POST" });
}
