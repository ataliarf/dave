import { readFile } from "node:fs/promises";
import type { ZodType, ZodTypeDef } from "zod";
import type { IngestSkip } from "@dave/shared";

export interface ParseResult<T> {
  records: T[];
  skipped: IngestSkip[];
}

export type Schema<T> = ZodType<T, ZodTypeDef, any>;

export async function parseJsonl<T>(
  absolutePath: string,
  schema: Schema<T>,
): Promise<ParseResult<T>> {
  const raw = await readFile(absolutePath, "utf8");
  const lines = raw.split(/\r?\n/);

  const records: T[] = [];
  const skipped: IngestSkip[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.trim().length === 0) continue;

    const rowNumber = i + 1;

    let json: unknown;
    try {
      json = JSON.parse(line);
    } catch (err) {
      skipped.push({
        row: rowNumber,
        reason: `invalid JSON: ${err instanceof Error ? err.message : String(err)}`,
      });
      continue;
    }

    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      skipped.push({
        row: rowNumber,
        reason: `validation failed: ${parsed.error.issues
          .map((issue) => `${issue.path.join(".") || "<root>"} ${issue.message}`)
          .join("; ")}`,
      });
      continue;
    }

    records.push(parsed.data);
  }

  return { records, skipped };
}
