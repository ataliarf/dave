import type { IngestRun } from "../domain/ingest.js";

export type StartIngestResponse = Pick<IngestRun, "id" | "status" | "startedAt">;

export type IngestStatusResponse = IngestRun | { status: "idle" };
