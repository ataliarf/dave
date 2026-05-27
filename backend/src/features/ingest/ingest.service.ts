import type { IngestRun, IngestStatus, IngestSummary } from "@dave/shared";
import { logger } from "../../lib/logger.js";
import { DependencyRepository } from "../../repositories/neo4j/dependency.repository.js";
import { ServiceRepository } from "../../repositories/neo4j/service.repository.js";
import { IncidentRepository } from "../../repositories/postgres/incident.repository.js";
import { IngestRunRepository } from "../../repositories/postgres/ingest-run.repository.js";
import type { IngestExecutor } from "./ingest-executor.js";
import { runDependenciesStep } from "./steps/dependencies-step.js";
import { runIncidentsStep } from "./steps/incidents-step.js";
import { runServicesStep } from "./steps/services-step.js";

export class IngestService {
  constructor(
    private readonly runs: IngestRunRepository,
    private readonly services: ServiceRepository,
    private readonly dependencies: DependencyRepository,
    private readonly incidents: IncidentRepository,
    private readonly executor: IngestExecutor,
  ) {}

  async start(): Promise<IngestRun> {
    const run = await this.runs.createRunning();
    logger.info({ runId: run.id }, "ingest run scheduled");
    this.executor.schedule(run.id, () => this.runIngest(run.id));
    return run;
  }

  async getLatestStatus(): Promise<IngestRun | null> {
    return this.runs.findLatest();
  }

  private async runIngest(runId: string): Promise<void> {
    const log = logger.child({ runId });
    log.info("ingest run starting");

    const servicesOutcome = await runServicesStep(this.services);
    log.info(
      { step: "services", result: this.summaryLine(servicesOutcome.result) },
      "services step done",
    );

    const dependencies = await runDependenciesStep(this.dependencies, servicesOutcome.acceptedIds);
    log.info(
      { step: "dependencies", result: this.summaryLine(dependencies) },
      "dependencies step done",
    );

    const incidents = await runIncidentsStep(this.incidents);
    log.info({ step: "incidents", result: this.summaryLine(incidents) }, "incidents step done");

    const summary: IngestSummary = {
      services: servicesOutcome.result,
      dependencies,
      incidents,
    };

    const status = this.computeStatus(summary);
    await this.runs.finalize(runId, status, summary);
    log.info({ status }, "ingest run finalized");
  }

  private computeStatus(summary: IngestSummary): Exclude<IngestStatus, "running"> {
    const steps = [summary.services, summary.dependencies, summary.incidents];
    const okCount = steps.filter((s) => s.ok).length;
    if (okCount === 0) return "failed";
    const anySkipped = steps.some((s) => s.skipped.length > 0);
    if (okCount === steps.length && !anySkipped) return "succeeded";
    return "partial";
  }

  private summaryLine(r: {
    ok: boolean;
    parsed: number;
    inserted: number;
    updated: number;
    deleted: number;
    skipped: unknown[];
    error?: string;
  }): string {
    if (!r.ok) return `failed: ${r.error ?? "unknown"}`;
    return `ok parsed=${r.parsed} +${r.inserted} ~${r.updated} -${r.deleted} skipped=${r.skipped.length}`;
  }
}
