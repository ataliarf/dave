import type { Request, Response } from "express";
import type { IngestStatusResponse, StartIngestResponse } from "@dave/shared";
import type { IngestService } from "./ingest.service.js";

export class IngestController {
  constructor(private readonly ingest: IngestService) {}

  start = async (_req: Request, res: Response): Promise<void> => {
    const run = await this.ingest.start();
    const body: StartIngestResponse = {
      id: run.id,
      status: run.status,
      startedAt: run.startedAt,
    };
    res.status(202).json(body);
  };

  status = async (_req: Request, res: Response): Promise<void> => {
    const latest = await this.ingest.getLatestStatus();
    const body: IngestStatusResponse = latest ?? { status: "idle" };
    res.json(body);
  };
}
