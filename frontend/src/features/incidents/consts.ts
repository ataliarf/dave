import type { ColumnKey } from "./types";

export const COLUMNS: { key: ColumnKey; label: string; width: string }[] = [
  { key: "severity", label: "Severity", width: "11%" },
  { key: "title", label: "Title", width: "33%" },
  { key: "service", label: "Service", width: "17%" },
  { key: "started", label: "Started", width: "13%" },
  { key: "resolved", label: "Resolved", width: "13%" },
  { key: "duration", label: "Duration", width: "13%" },
];
