import path from "node:path";
import { incidentRowSchema, type IngestStepResult } from "@dave/shared";
import { resolveDataDir } from "../../../config/env.js";
import { IncidentRepository } from "../../../repositories/postgres/incident.repository.js";
import { parseCsv } from "../parsers/csv.parser.js";
import { emptyAcceptedError } from "./step-utils.js";

const FILE = "incidents.csv";

export async function runIncidentsStep(repo: IncidentRepository): Promise<IngestStepResult> {
  const filePath = path.join(resolveDataDir(), FILE);

  try {
    const { records, skipped } = await parseCsv(filePath, incidentRowSchema);
    const parsed = records.length + skipped.length;

    if (records.length === 0) {
      if (skipped.length === 0) {
        const reconcile = await repo.reconcile([]);
        return {
          ok: true,
          parsed: 0,
          inserted: 0,
          updated: 0,
          deleted: reconcile.deleted,
          skipped: [],
        };
      }
      return {
        ok: false,
        parsed,
        inserted: 0,
        updated: 0,
        deleted: 0,
        skipped,
        error: emptyAcceptedError(parsed, skipped.length),
      };
    }

    const inputs = records.map((r) => ({
      id: r.id,
      serviceId: r.service_id,
      startedAt: new Date(r.started_at),
      resolvedAt: r.resolved_at ? new Date(r.resolved_at) : null,
      severity: r.severity,
      title: r.title,
    }));

    const upsertCounts = await repo.bulkUpsert(inputs);
    const reconcile = await repo.reconcile(inputs.map((i) => i.id));

    return {
      ok: true,
      parsed,
      inserted: upsertCounts.inserted,
      updated: upsertCounts.updated,
      deleted: reconcile.deleted,
      skipped,
    };
  } catch (err) {
    return {
      ok: false,
      parsed: 0,
      inserted: 0,
      updated: 0,
      deleted: 0,
      skipped: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
