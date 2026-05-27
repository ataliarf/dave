import path from "node:path";
import { dependencySchema, type IngestSkip, type IngestStepResult } from "@dave/shared";
import { resolveDataDir } from "../../../config/env.js";
import { DependencyRepository } from "../../../repositories/neo4j/dependency.repository.js";
import { parseJsonl } from "../parsers/jsonl.parser.js";
import { emptyAcceptedError } from "./step-utils.js";

const FILE = "dependencies.jsonl";

export async function runDependenciesStep(
  repo: DependencyRepository,
  knownServiceIds: Set<string>,
): Promise<IngestStepResult> {
  const filePath = path.join(resolveDataDir(), FILE);

  try {
    const { records, skipped: parseSkipped } = await parseJsonl(filePath, dependencySchema);
    const parsed = records.length + parseSkipped.length;

    const accepted: typeof records = [];
    const skipped: IngestSkip[] = [...parseSkipped];
    for (let i = 0; i < records.length; i++) {
      const dep = records[i]!;
      const missing: string[] = [];
      if (!knownServiceIds.has(dep.from)) missing.push(`from=${dep.from}`);
      if (!knownServiceIds.has(dep.to)) missing.push(`to=${dep.to}`);
      if (missing.length > 0) {
        skipped.push({
          row: i + 1,
          reason: `unknown service ref: ${missing.join(", ")}`,
        });
        continue;
      }
      accepted.push(dep);
    }

    if (accepted.length === 0) {
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

    const upsertCounts = await repo.bulkUpsert(accepted);
    const reconcile = await repo.reconcile(accepted.map((d) => [d.from, d.to] as [string, string]));

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
