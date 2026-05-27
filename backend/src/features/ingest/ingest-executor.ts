import { logger } from "../../lib/logger.js";

export interface IngestExecutor {
  schedule(runId: string, work: () => Promise<void>): void;
}

export class InProcessIngestExecutor implements IngestExecutor {
  schedule(runId: string, work: () => Promise<void>): void {
    setImmediate(() => {
      work().catch((err) => {
        logger.error({ err, runId }, "background ingest crashed");
      });
    });
  }
}
