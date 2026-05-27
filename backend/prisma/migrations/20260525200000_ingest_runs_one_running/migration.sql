-- At most one ingest run may be 'running' at a time.
-- Partial unique index makes the concurrency guard a hard DB invariant
-- rather than a race-prone application-level check.
CREATE UNIQUE INDEX "ingest_runs_one_running"
  ON "ingest_runs" ((status))
  WHERE status = 'running';
