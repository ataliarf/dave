import type { IngestStatusResponse } from "@dave/shared";

export type IngestState =
  | { kind: "idle" }
  | Extract<IngestStatusResponse, { status: "running" }>
  | Extract<IngestStatusResponse, { status: "succeeded" }>
  | Extract<IngestStatusResponse, { status: "partial" }>
  | Extract<IngestStatusResponse, { status: "failed" }>;
