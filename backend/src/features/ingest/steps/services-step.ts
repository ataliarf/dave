import path from "node:path";
import { serviceSchema, type IngestStepResult } from "@dave/shared";
import { resolveDataDir } from "../../../config/env.js";
import { ServiceRepository } from "../../../repositories/neo4j/service.repository.js";
import { parseJsonl } from "../parsers/jsonl.parser.js";
import { emptyAcceptedError } from "./step-utils.js";

const FILE = "services.jsonl";

export async function runServicesStep(
  repo: ServiceRepository,
): Promise<{ result: IngestStepResult; acceptedIds: Set<string> }> {
  const filePath = path.join(resolveDataDir(), FILE);

  try {
    const { records, skipped } = await parseJsonl(filePath, serviceSchema);
    const parsed = records.length + skipped.length;

    if (records.length === 0) {
      if (skipped.length === 0) {
        const reconcile = await repo.reconcile([]);
        return {
          result: {
            ok: true,
            parsed: 0,
            inserted: 0,
            updated: 0,
            deleted: reconcile.deleted,
            skipped: [],
          },
          acceptedIds: new Set(),
        };
      }
      return {
        result: {
          ok: false,
          parsed,
          inserted: 0,
          updated: 0,
          deleted: 0,
          skipped,
          error: emptyAcceptedError(parsed, skipped.length),
        },
        acceptedIds: new Set(),
      };
    }

    const upsertCounts = await repo.bulkUpsert(records);
    const reconcile = await repo.reconcile(records.map((r) => r.id));

    return {
      result: {
        ok: true,
        parsed,
        inserted: upsertCounts.inserted,
        updated: upsertCounts.updated,
        deleted: reconcile.deleted,
        skipped,
      },
      acceptedIds: new Set(records.map((r) => r.id)),
    };
  } catch (err) {
    return {
      result: {
        ok: false,
        parsed: 0,
        inserted: 0,
        updated: 0,
        deleted: 0,
        skipped: [],
        error: err instanceof Error ? err.message : String(err),
      },
      acceptedIds: new Set(),
    };
  }
}
