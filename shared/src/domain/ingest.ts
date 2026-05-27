export const INGEST_STATUSES = ["running", "succeeded", "partial", "failed"] as const;
export type IngestStatus = (typeof INGEST_STATUSES)[number];

export const INGEST_STEPS = ["services", "dependencies", "incidents"] as const;
export type IngestStep = (typeof INGEST_STEPS)[number];

export interface IngestSkip {
  row: number;
  reason: string;
}

export interface IngestStepResult {
  ok: boolean;
  parsed: number;
  inserted: number;
  updated: number;
  deleted: number;
  skipped: IngestSkip[];
  error?: string;
}

export type IngestSummary = Record<IngestStep, IngestStepResult>;

export interface IngestRun {
  id: string;
  startedAt: string;
  finishedAt: string | null;
  status: IngestStatus;
  summary: IngestSummary | null;
}
